export interface AudioRecorderOptions {
  onDataAvailable?: (event: BlobEvent) => void
  onStart?: () => void
  onStop?: () => void
  onError?: (error: Error) => void
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private stream: MediaStream | null = null
  private chunks: Blob[] = []
  private options: AudioRecorderOptions

  constructor(options: AudioRecorderOptions = {}) {
    this.options = options
  }

  async start(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      this.chunks = []
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data)
          this.options.onDataAvailable?.(event)
        }
      }
      
      this.mediaRecorder.onstart = () => {
        this.options.onStart?.()
      }
      
      this.mediaRecorder.onstop = () => {
        this.options.onStop?.()
      }
      
      this.mediaRecorder.start(100) // Collect data every 100ms
    } catch (error) {
      this.options.onError?.(error as Error)
    }
  }

  stop(): Blob | null {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop()
      this.stream?.getTracks().forEach(track => track.stop())
      
      if (this.chunks.length > 0) {
        return new Blob(this.chunks, { type: 'audio/webm' })
      }
    }
    return null
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording'
  }

  getDuration(): number {
    // This is a simplified duration calculation
    // In a real implementation, you'd track the actual recording time
    return this.chunks.length * 0.1 // Approximate duration
  }
}

export function createAudioContext(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

export function playAudio(audioBlob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    const url = URL.createObjectURL(audioBlob)
    
    audio.src = url
    audio.onended = () => {
      URL.revokeObjectURL(url)
      resolve()
    }
    audio.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to play audio'))
    }
    
    audio.play()
  })
}

export function convertToWav(audioBlob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      const audioContext = createAudioContext()
      
      audioContext.decodeAudioData(arrayBuffer)
        .then(audioBuffer => {
          const wavBlob = audioBufferToWav(audioBuffer)
          resolve(wavBlob)
        })
        .catch(reject)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(audioBlob)
  })
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const length = buffer.length
  const sampleRate = buffer.sampleRate
  const numberOfChannels = buffer.numberOfChannels
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2)
  const view = new DataView(arrayBuffer)
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
  
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + length * numberOfChannels * 2, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numberOfChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numberOfChannels * 2, true)
  view.setUint16(32, numberOfChannels * 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, length * numberOfChannels * 2, true)
  
  // Convert audio data
  let offset = 44
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' })
}
