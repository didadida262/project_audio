'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Play, Pause, Loader2, Zap, User } from 'lucide-react'
import { useVoiceTransform } from '@/hooks/useVoiceTransform'
import { cn } from '@/lib/utils'

interface VoiceTransformerProps {
  audioBlob: Blob | null
  className?: string
}

export function VoiceTransformer({ audioBlob, className }: VoiceTransformerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  
  const {
    isTransforming,
    transformedAudio,
    error,
    transformToHacker,
    transformToFemale,
    clearTransformed
  } = useVoiceTransform()

  const playAudio = async (blob: Blob) => {
    try {
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }

      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      
      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(url)
      }
      
      audio.onerror = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(url)
      }
      
      setCurrentAudio(audio)
      await audio.play()
      setIsPlaying(true)
    } catch (err) {
      console.error('Failed to play audio:', err)
    }
  }

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      setIsPlaying(false)
    }
  }

  const downloadAudio = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleTransform = async (type: 'hacker' | 'female') => {
    if (!audioBlob) return
    
    if (type === 'hacker') {
      await transformToHacker(audioBlob)
    } else {
      await transformToFemale(audioBlob)
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Transform Buttons */}
      <div className="grid grid-cols-1 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleTransform('hacker')}
          disabled={!audioBlob || isTransforming}
          className={cn(
            'flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-300',
            'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800',
            'text-white shadow-lg hover:shadow-xl',
            (!audioBlob || isTransforming) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isTransforming ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
          <span className="font-medium">
            {isTransforming ? '转换中...' : '黑客声音'}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleTransform('female')}
          disabled={!audioBlob || isTransforming}
          className={cn(
            'flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-300',
            'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600',
            'text-white shadow-lg hover:shadow-xl',
            (!audioBlob || isTransforming) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isTransforming ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="font-medium">
            {isTransforming ? '转换中...' : '女生声音'}
          </span>
        </motion.button>
      </div>

      {/* Transformed Audio Controls */}
      {transformedAudio && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              转换完成
            </h3>
            <button
              onClick={clearTransformed}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              清除
            </button>
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isPlaying ? stopAudio() : playAudio(transformedAudio)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isPlaying ? '暂停' : '播放'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => downloadAudio(transformedAudio, 'transformed-voice.wav')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>下载</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Instructions */}
      {!audioBlob && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>请先录音，然后选择变音效果</p>
        </div>
      )}
    </div>
  )
}
