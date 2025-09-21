'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Youtube,
  Send,
  Calendar,
  Image,
  Type,
  Hash,
  Smile,
  BarChart,
  Check,
  Plus,
  X
} from 'lucide-react'

export function AnimatedDashboardMockup() {
  const [step, setStep] = useState(0)
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([])
  const [postContent, setPostContent] = useState('')
  const [isScheduling, setIsScheduling] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const platforms = [
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600' },
  ]

  const samplePosts = [
    "🚀 Excited to announce our new product launch! Get ready for something amazing...",
    "💡 5 tips to boost your productivity this week:\n1. Start with the hardest task\n2. Take regular breaks",
    "🌟 Thank you for 10K followers! Your support means everything to us.",
    "📊 New blog post: How we increased engagement by 300% in just 30 days",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= 5) {
          // Reset animation
          setConnectedPlatforms([])
          setPostContent('')
          setIsScheduling(false)
          setIsPublishing(false)
          return 0
        }
        return prev + 1
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  // Execute step animations
  useEffect(() => {
    if (step === 1) {
      // Connect platforms one by one
      const connectPlatforms = async () => {
        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 400))
          setConnectedPlatforms(prev => [...prev, platforms[i].id])
        }
      }
      connectPlatforms()
    } else if (step === 2) {
      // Type post content
      const post = samplePosts[Math.floor(Math.random() * samplePosts.length)]
      let currentText = ''
      const typeInterval = setInterval(() => {
        if (currentText.length < post.length) {
          currentText += post[currentText.length]
          setPostContent(currentText)
        } else {
          clearInterval(typeInterval)
        }
      }, 30)
      return () => clearInterval(typeInterval)
    } else if (step === 3) {
      setIsScheduling(true)
    } else if (step === 4) {
      setIsPublishing(true)
    }
  }, [step])

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Browser window frame */}
      <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800">
        {/* Browser toolbar */}
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white dark:bg-gray-700 rounded-md px-4 py-1 text-xs text-gray-600 dark:text-gray-400 w-64 text-center">
              app.socialscheduler.com
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 space-y-4">
              {/* Platform connections */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Connected Platforms
                </h3>
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <motion.div
                      key={platform.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: connectedPlatforms.includes(platform.id) ? 1 : 0.3,
                        x: 0,
                        scale: connectedPlatforms.includes(platform.id) ? 1 : 0.95
                      }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        connectedPlatforms.includes(platform.id) 
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                          : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <div className={`p-1.5 rounded-md text-white ${platform.color}`}>
                        <platform.icon className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-medium">{platform.name}</span>
                      {connectedPlatforms.includes(platform.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <Check className="w-3 h-3 text-green-600" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <BarChart className="w-4 h-4" />
                  Quick Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Posts Today</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Scheduled</span>
                    <span className="font-semibold">28</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Reach</span>
                    <span className="font-semibold">15.2K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1">
              {/* Compose post */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Create Post
                  </h2>
                </div>
                
                <div className="p-4">
                  {/* Text area with typing animation */}
                  <div className="min-h-[120px] p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <AnimatePresence mode="wait">
                      {postContent && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                        >
                          {postContent}
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="inline-block w-0.5 h-4 bg-green-600 ml-0.5"
                          />
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Toolbar */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Image className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Smile className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Hash className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <div className="ml-auto flex gap-2">
                      <AnimatePresence>
                        {isScheduling && (
                          <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                          >
                            <Calendar className="w-4 h-4" />
                            Schedule
                          </motion.button>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {isPublishing && (
                          <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
                          >
                            <Send className="w-4 h-4" />
                            Publishing...
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform previews */}
              <AnimatePresence>
                {step >= 3 && postContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-4 grid grid-cols-3 gap-3"
                  >
                    {connectedPlatforms.slice(0, 3).map((platformId, index) => {
                      const platform = platforms.find(p => p.id === platformId)
                      if (!platform) return null

                      return (
                        <motion.div
                          key={platform.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1 rounded text-white ${platform.color}`}>
                              <platform.icon className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-medium">{platform.name}</span>
                            {isPublishing && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.2 }}
                                className="ml-auto"
                              >
                                <Check className="w-3 h-3 text-green-600" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {postContent}
                          </p>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mt-4 gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= step ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}