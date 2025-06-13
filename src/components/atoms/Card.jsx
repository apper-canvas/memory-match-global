import { motion } from 'framer-motion'
import { memo } from 'react'

const Card = memo(({ 
  card, 
  onClick, 
  isDisabled = false,
  className = '' 
}) => {
  const handleClick = () => {
    if (!isDisabled && !card.isFlipped && !card.isMatched) {
      onClick(card)
    }
  }

  const isInteractive = !isDisabled && !card.isFlipped && !card.isMatched

  return (
    <div className="perspective-1000">
      <motion.div
        className={`card-3d relative w-full aspect-square cursor-pointer ${className}`}
        whileHover={isInteractive ? { 
          scale: 1.05,
          rotateX: 5,
          rotateY: 5
        } : {}}
        whileTap={isInteractive ? { scale: 0.95 } : {}}
        onClick={handleClick}
        animate={card.isMatched ? {
          scale: [1, 1.1, 1],
          transition: { duration: 0.4, ease: "easeOut" }
        } : {}}
        layout
      >
        <div className={`card-flip w-full h-full ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}>
          {/* Card Back */}
          <div className="card-face rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg border-2 border-purple-400/30 flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/40"></div>
            </div>
          </div>
          
          {/* Card Front */}
          <div className={`card-face card-back rounded-xl shadow-lg border-2 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl ${
            card.isMatched 
              ? 'bg-success/20 border-success animate-pulse-success' 
              : 'bg-surface border-gray-600'
          }`}>
            {card.emoji}
          </div>
        </div>
      </motion.div>
    </div>
  )
})

Card.displayName = 'Card'

export default Card