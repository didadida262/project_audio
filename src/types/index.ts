// 音频相关类型定义
export interface AudioRecorderState {
  isRecording: boolean
  audioBlob: Blob | null
  duration: number
  error: string | null
}

export interface VoiceTransformState {
  isTransforming: boolean
  transformedAudio: Blob | null
  error: string | null
}

// 变音类型
export type VoiceTransformType = 'hacker' | 'female'

// 录音选项
export interface RecordingOptions {
  sampleRate?: number
  channels?: number
  bitRate?: number
  echoCancellation?: boolean
  noiseSuppression?: boolean
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AudioRecord {
  id: number
  userId: string
  originalAudioUrl: string
  transformedAudioUrl?: string
  transformType?: VoiceTransformType
  createdAt: Date
}

// 组件Props类型
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// 音频处理结果
export interface AudioProcessResult {
  success: boolean
  outputFile?: Blob
  error?: string
  duration?: number
  fileSize?: number
}

// 用户界面状态
export interface UIState {
  isDarkMode: boolean
  currentPage: string
  isLoading: boolean
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

// 扩展Window接口以支持Web Audio API
declare global {
  interface Window {
    AudioContext: typeof AudioContext
    webkitAudioContext: typeof AudioContext
  }
}

// 导出所有类型
export * from './audio'
export * from './ui'
