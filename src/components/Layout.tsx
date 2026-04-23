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
    <div className="min-h-screen bg-background text-foreground selection:bg-purple-500/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center py-12"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          变声器
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          实时语音转换，让你的声音变得与众不同
        </p>
      </motion.header>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 pb-16">
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
            <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-xl border border-border">
              <h2 className="text-2xl font-bold mb-6 text-center">
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
              className="bg-accent/50 backdrop-blur-sm rounded-xl p-6 border border-border"
            >
              <h3 className="text-lg font-semibold mb-4">
                功能特色
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
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
