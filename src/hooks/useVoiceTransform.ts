import { useState, useCallback } from 'react'
import { VoiceTransformer, TransformResult } from '@/utils/ffmpegUtils'

export interface UseVoiceTransformReturn {
  isTransforming: boolean
  transformedAudio: Blob | null
  error: string | null
  transformToHacker: (audioBlob: Blob) => Promise<void>
  transformToFemale: (audioBlob: Blob) => Promise<void>
  clearTransformed: () => void
}

export function useVoiceTransform(): UseVoiceTransformReturn {
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformedAudio, setTransformedAudio] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)

  const transformAudio = useCallback(async (audioBlob: Blob, type: 'hacker' | 'female') => {
    try {
      setIsTransforming(true)
      setError(null)
      setTransformedAudio(null)

      const transformer = VoiceTransformer.getInstance()
      const result: TransformResult = await transformer.transformVoiceWebAudio({
        type,
        inputFile: audioBlob as File
      })

      if (result.success && result.outputFile) {
        setTransformedAudio(result.outputFile)
      } else {
        setError(result.error || 'Transformation failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transformation failed')
    } finally {
      setIsTransforming(false)
    }
  }, [])

  const transformToHacker = useCallback((audioBlob: Blob) => {
    return transformAudio(audioBlob, 'hacker')
  }, [transformAudio])

  const transformToFemale = useCallback((audioBlob: Blob) => {
    return transformAudio(audioBlob, 'female')
  }, [transformAudio])

  const clearTransformed = useCallback(() => {
    setTransformedAudio(null)
    setError(null)
  }, [])

  return {
    isTransforming,
    transformedAudio,
    error,
    transformToHacker,
    transformToFemale,
    clearTransformed
  }
}
