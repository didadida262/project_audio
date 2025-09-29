export interface VoiceTransformOptions {
  type: 'hacker' | 'female'
  inputFile: File
}

export interface TransformResult {
  success: boolean
  outputFile?: Blob
  error?: string
}

export class VoiceTransformer {
  private static instance: VoiceTransformer
  private ffmpeg: any = null

  private constructor() {}

  static getInstance(): VoiceTransformer {
    if (!VoiceTransformer.instance) {
      VoiceTransformer.instance = new VoiceTransformer()
    }
    return VoiceTransformer.instance
  }

  async initialize(): Promise<void> {
    if (typeof window !== 'undefined') {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg')
      const { fetchFile, toBlobURL } = await import('@ffmpeg/util')
      
      this.ffmpeg = new FFmpeg()
      
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })
    }
  }

  async transformVoice(options: VoiceTransformOptions): Promise<TransformResult> {
    try {
      if (!this.ffmpeg) {
        await this.initialize()
      }

      const inputFileName = 'input.webm'
      const outputFileName = 'output.wav'

      // Write input file to FFmpeg
      await this.ffmpeg.writeFile(inputFileName, await fetchFile(options.inputFile))

      let filterComplex = ''
      
      if (options.type === 'hacker') {
        // Hacker voice: lower pitch, add reverb, make it deeper
        filterComplex = `
          [0:a]asetrate=22050,aresample=44100,
          atempo=0.8,
          aecho=0.8:0.88:60:0.4,
          bass=g=8:f=100,
          treble=g=-5:f=3000,
          volume=1.2[out]
        `
      } else if (options.type === 'female') {
        // Female voice: higher pitch, brighter tone
        filterComplex = `
          [0:a]asetrate=48000,aresample=44100,
          atempo=1.2,
          treble=g=8:f=2000,
          bass=g=-3:f=200,
          volume=1.1[out]
        `
      }

      // Apply the filter
      await this.ffmpeg.exec([
        '-i', inputFileName,
        '-filter_complex', filterComplex,
        '-map', '[out]',
        '-c:a', 'pcm_s16le',
        outputFileName
      ])

      // Read the output file
      const data = await this.ffmpeg.readFile(outputFileName)
      const outputBlob = new Blob([data.buffer], { type: 'audio/wav' })

      // Clean up
      await this.ffmpeg.deleteFile(inputFileName)
      await this.ffmpeg.deleteFile(outputFileName)

      return {
        success: true,
        outputFile: outputBlob
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  // Alternative method using Web Audio API for simpler transformations
  async transformVoiceWebAudio(options: VoiceTransformOptions): Promise<TransformResult> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const arrayBuffer = await options.inputFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      )
      
      const source = offlineContext.createBufferSource()
      source.buffer = audioBuffer
      
      if (options.type === 'hacker') {
        // Lower pitch and add distortion
        source.playbackRate.value = 0.7
        const gainNode = offlineContext.createGain()
        gainNode.gain.value = 1.2
        
        source.connect(gainNode)
        gainNode.connect(offlineContext.destination)
      } else if (options.type === 'female') {
        // Higher pitch
        source.playbackRate.value = 1.4
        const gainNode = offlineContext.createGain()
        gainNode.gain.value = 0.9
        
        source.connect(gainNode)
        gainNode.connect(offlineContext.destination)
      } else {
        source.connect(offlineContext.destination)
      }
      
      source.start()
      
      const renderedBuffer = await offlineContext.startRendering()
      const wavBlob = this.audioBufferToWav(renderedBuffer)
      
      return {
        success: true,
        outputFile: wavBlob
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  private audioBufferToWav(buffer: AudioBuffer): Blob {
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
}
