import { useState, useRef, useCallback } from 'react'
import { AudioRecorder, AudioRecorderOptions } from '@/utils/audioUtils'

export interface UseAudioRecorderReturn {
  isRecording: boolean
  audioBlob: Blob | null
  duration: number
  startRecording: () => Promise<void>
  stopRecording: () => void
  clearRecording: () => void
  error: string | null
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const recorderRef = useRef<AudioRecorder | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setAudioBlob(null)
      setDuration(0)
      
      const options: AudioRecorderOptions = {
        onStart: () => {
          setIsRecording(true)
          // Start duration counter
          intervalRef.current = setInterval(() => {
            setDuration(prev => prev + 0.1)
          }, 100)
        },
        onStop: () => {
          setIsRecording(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        },
        onError: (err) => {
          setError(err.message)
          setIsRecording(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        }
      }
      
      recorderRef.current = new AudioRecorder(options)
      await recorderRef.current.start()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (recorderRef.current) {
      const blob = recorderRef.current.stop()
      if (blob) {
        setAudioBlob(blob)
      }
    }
  }, [])

  const clearRecording = useCallback(() => {
    setAudioBlob(null)
    setDuration(0)
    setError(null)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  return {
    isRecording,
    audioBlob,
    duration,
    startRecording,
    stopRecording,
    clearRecording,
    error
  }
}
