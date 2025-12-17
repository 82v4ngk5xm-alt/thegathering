'use client'

import React from 'react'
import { Scripture } from '@/types'

interface ScriptureDisplayProps {
  scripture: Scripture
  backgroundImageUrl?: string
}

export function ScriptureDisplay({ scripture, backgroundImageUrl }: ScriptureDisplayProps) {
  const displayImage = backgroundImageUrl || scripture.background_image_url

  return (
    <div
      className="scripture-background relative w-full min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: displayImage ? `url(${displayImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Overlay for text readability */}
      <div className="scripture-overlay absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 max-w-3xl">
        <div className="text-center text-white">
          {/* Scripture Reference */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-2">
              {scripture.book} {scripture.chapter}:{scripture.verses}
            </h1>
            <p className="text-lg text-gray-200">{scripture.translation}</p>
          </div>

          {/* Scripture Text */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 md:p-12 border border-white border-opacity-20">
            <p className="text-xl md:text-2xl leading-relaxed font-serif text-white italic">
              "{scripture.text}"
            </p>
          </div>

          {/* Date indicator */}
          <div className="mt-8 text-sm text-gray-200">
            <p>Scripture of the Day</p>
          </div>
        </div>
      </div>
    </div>
  )
}
