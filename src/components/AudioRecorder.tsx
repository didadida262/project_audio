'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Square } from 'lucide-react'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { cn } from '@/lib/utils'
import { BaseComponentProps } from '@/types'

interface AudioRecorderProps extends BaseComponentProps {
  onRecordingComplete: (audioBlob: Blob) => void
  onTextUpdate: (text: string) => void
}

export function AudioRecorder({ onRecordingComplete, onTextUpdate, className }: AudioRecorderProps) {
  const [recognizedText, setRecognizedText] = useState('')
  const { 
    isRecording, 
    audioBlob, 
    duration, 
    startRecording, 
    stopRecording, 
    clearRecording, 
    error 
  } = useAudioRecorder()

  const handleStartRecording = async () => {
    setRecognizedText('')
    await startRecording()
  }

  const handleStopRecording = () => {
    stopRecording()
    if (audioBlob) {
      onRecordingComplete(audioBlob)
    }
  }

  const handleClearRecording = () => {
    clearRecording()
    setRecognizedText('')
    onTextUpdate('')
  }

  // Simulate speech recognition (in a real app, you'd use Web Speech API or a service)
  const simulateSpeechRecognition = () => {
    if (isRecording) {
      const sampleTexts = [
        '你好，这是一个语音识别测试',
        '我正在录音，请稍等',
        '变身器功能正在开发中',
        '这是一个很酷的语音处理应用'
      ]
      
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
      setRecognizedText(randomText)
      onTextUpdate(randomText)
    }
  }

  // Start simulation when recording starts
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(simulateSpeechRecognition, 2000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording])

  return (
    <div className={cn('flex flex-col items-center space-y-6', className)}>
      {/* Recording Status */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-sm text-muted-foreground mb-2">
            录音中... {Math.floor(duration)}s
          </div>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [20, 40, 20] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Record Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={!!error}
        className={cn(
          'relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300',
          'focus:outline-none focus:ring-4 focus:ring-primary/30',
          isRecording
            ? 'bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/50'
            : 'bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg shadow-primary/50',
          error && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isRecording ? (
          <Square className="w-8 h-8 text-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
        
        {isRecording && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-4 border-destructive/30"
          />
        )}
      </motion.button>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {audioBlob && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearRecording}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            清除录音
          </motion.button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-destructive text-sm text-center max-w-xs"
        >
          {error}
        </motion.div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground max-w-xs">
        {isRecording 
          ? '点击停止录音' 
          : '点击开始录音，说出你想要转换的话'
        }
      </div>
    </div>
  )
}
