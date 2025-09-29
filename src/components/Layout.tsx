'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TextDisplay } from './TextDisplay'
import { AudioRecorder } from './AudioRecorder'
import { VoiceTransformer } from './VoiceTransformer'
import { cn } from '@/lib/utils'

export function Layout() {
  const [recognizedText, setRecognizedText] = useState('')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob)
  }

  const handleTextUpdate = (text: string) => {
    setRecognizedText(text)
  }

  const handleRecordingStart = () => {
    setIsRecording(true)
  }

  const handleRecordingStop = () => {
    setIsRecording(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          变身器
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          实时语音转换，让你的声音变得与众不同
        </p>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Side - Recording */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Text Display */}
            <TextDisplay
              text={recognizedText}
              isRecording={isRecording}
              className="h-64"
            />

            {/* Audio Recorder */}
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              onTextUpdate={handleTextUpdate}
              className="flex justify-center"
            />
          </motion.div>

          {/* Right Side - Voice Transformation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
                变音效果
              </h2>
              
              <VoiceTransformer
                audioBlob={audioBlob}
                className="w-full"
              />
            </div>

            {/* Features Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                功能特色
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>实时语音识别</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>多种变音效果</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full" />
                  <span>高质量音频处理</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>一键下载分享</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center py-6 text-gray-500 dark:text-gray-400"
      >
        <p className="text-sm">
          Powered by React, Next.js & FFmpeg
        </p>
      </motion.footer>
    </div>
  )
}
