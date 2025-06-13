import { motion } from 'framer-motion'
import { memo, useMemo } from 'react'
import Card from '@/components/atoms/Card'

const GameGrid = memo(({ cards, onCardClick, isDisabled, difficulty = 'easy' }) => {
  const gridConfig = useMemo(() => {
    switch (difficulty) {
      case 'easy': 
        return {
          className: 'grid-responsive-4x6',
          gap: 'gap-3',
          maxWidth: 'max-w-2xl'
        }
      case 'medium': 
        return {
          className: 'grid-responsive-6x8',
          gap: 'gap-2.5',
          maxWidth: 'max-w-4xl'
        }
      case 'hard': 
        return {
          className: 'grid-responsive-8x10',
          gap: 'gap-2',
          maxWidth: 'max-w-6xl'
        }
      default: 
        return {
          className: 'grid-responsive-4x6',
          gap: 'gap-3',
          maxWidth: 'max-w-2xl'
        }
    }
  }, [difficulty])

  const cardElements = useMemo(() => 
    cards.map((card, index) => (
      <motion.div
        key={card.id}
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ 
          delay: index * 0.02,
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        <Card
          card={card}
          onClick={onCardClick}
          isDisabled={isDisabled}
        />
      </motion.div>
    )), [cards, onCardClick, isDisabled]
  )

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`grid grid-optimized ${gridConfig.className} ${gridConfig.gap} ${gridConfig.maxWidth} mx-auto px-4`}
    >
      {cardElements}
    </motion.div>
  )
})

GameGrid.displayName = 'GameGrid'

export default GameGrid