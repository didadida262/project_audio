// 音频处理相关类型定义

export interface AudioBuffer {
  length: number
  sampleRate: number
  numberOfChannels: number
  duration: number
  getChannelData(channel: number): Float32Array
}

export interface AudioContext {
  sampleRate: number
  currentTime: number
  state: AudioContextState
  createBufferSource(): AudioBufferSourceNode
  createGain(): GainNode
  createAnalyser(): AnalyserNode
  decodeAudioData(audioData: ArrayBuffer): Promise<AudioBuffer>
  resume(): Promise<void>
  suspend(): Promise<void>
  close(): Promise<void>
}

export type AudioContextState = 'suspended' | 'running' | 'closed'

export interface AudioBufferSourceNode {
  buffer: AudioBuffer | null
  playbackRate: AudioParam
  connect(destination: AudioNode): AudioBufferSourceNode
  disconnect(): void
  start(when?: number, offset?: number, duration?: number): void
  stop(when?: number): void
}

export interface GainNode {
  gain: AudioParam
  connect(destination: AudioNode): GainNode
  disconnect(): void
}

export interface AnalyserNode {
  frequencyBinCount: number
  fftSize: number
  getByteFrequencyData(array: Uint8Array): void
  getByteTimeDomainData(array: Uint8Array): void
  connect(destination: AudioNode): AnalyserNode
  disconnect(): void
}

export interface AudioParam {
  value: number
  defaultValue: number
  minValue: number
  maxValue: number
  setValueAtTime(value: number, startTime: number): AudioParam
  linearRampToValueAtTime(value: number, endTime: number): AudioParam
  exponentialRampToValueAtTime(value: number, endTime: number): AudioParam
}

export interface AudioNode {
  connect(destination: AudioNode): AudioNode
  disconnect(): void
}

// MediaRecorder相关类型
export interface MediaRecorderOptions {
  mimeType?: string
  audioBitsPerSecond?: number
  videoBitsPerSecond?: number
  bitsPerSecond?: number
}

export interface MediaRecorderEventMap {
  dataavailable: BlobEvent
  error: MediaRecorderErrorEvent
  pause: Event
  resume: Event
  start: Event
  stop: Event
}

export interface BlobEvent extends Event {
  data: Blob
  timecode: number
}

export interface MediaRecorderErrorEvent extends Event {
  error: DOMException
}

// 音频格式类型
export type AudioFormat = 'wav' | 'mp3' | 'ogg' | 'webm' | 'm4a'

export interface AudioFormatOptions {
  format: AudioFormat
  quality?: number
  bitRate?: number
  sampleRate?: number
  channels?: number
}
