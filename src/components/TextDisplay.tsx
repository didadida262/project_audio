'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TextDisplayProps {
  text: string
  isRecording: boolean
  className?: string
}

export function TextDisplay({ text, isRecording, className = '' }: TextDisplayProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (text !== displayedText) {
      setIsTyping(true)
      const timeout = setTimeout(() => {
        setDisplayedText(text)
        setIsTyping(false)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [text, displayedText])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {isRecording ? '正在录音...' : '语音识别'}
        </span>
      </div>
      
      <div className="min-h-[120px] max-h-[300px] overflow-y-auto">
        {displayedText ? (
          <motion.p
            key={displayedText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
          >
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-6 bg-purple-500 ml-1"
              />
            )}
          </motion.p>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-600">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full border-2 border-purple-300 border-t-purple-600 animate-spin" />
              <p className="text-sm">点击录音按钮开始说话</p>
            </div>
          </div>
        )}
      </div>
      
      {isRecording && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"
        />
      )}
    </motion.div>
  )
}
