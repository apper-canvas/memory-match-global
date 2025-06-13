import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Confetti from '@/components/atoms/Confetti'

const WinModal = ({ isOpen, moves, time, formatTime, onRestart }) => {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showConfetti && <Confetti />}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={onRestart}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-surface rounded-2xl p-8 max-w-md w-full text-center border border-primary/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <ApperIcon name="Trophy" className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-display text-white mb-2"
              >
                Congratulations!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 mb-6"
              >
                You matched all pairs successfully!
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-4 mb-8"
              >
                <div className="bg-background/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ApperIcon name="MousePointer" className="w-5 h-5 text-accent" />
                    <span className="text-gray-400 text-sm">Moves</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{moves}</span>
                </div>
                
                <div className="bg-background/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ApperIcon name="Clock" className="w-5 h-5 text-accent" />
                    <span className="text-gray-400 text-sm">Time</span>
                  </div>
                  <span className="text-2xl font-bold text-white font-mono">{formatTime(time)}</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={onRestart}
                  size="lg"
                  className="w-full"
                >
                  <ApperIcon name="RotateCcw" className="w-5 h-5 mr-2" />
                  Play Again
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default WinModal