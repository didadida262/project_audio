'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Square } from 'lucide-react'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { cn } from '@/lib/utils'

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void
  onTextUpdate: (text: string) => void
  className?: string
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
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            录音中... {Math.floor(duration)}s
          </div>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [20, 40, 20] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 bg-purple-500 rounded-full"
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
          'focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-700',
          isRecording
            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50'
            : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/50',
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
            className="absolute inset-0 rounded-full border-4 border-red-300"
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
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
          className="text-red-500 text-sm text-center max-w-xs"
        >
          {error}
        </motion.div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-xs">
        {isRecording 
          ? '点击停止录音' 
          : '点击开始录音，说出你想要转换的话'
        }
      </div>
    </div>
  )
}
