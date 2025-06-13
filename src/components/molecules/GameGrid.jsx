import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'

const GameGrid = ({ cards, onCardClick, isDisabled, difficulty = 'easy' }) => {
  const getGridCols = () => {
    switch (difficulty) {
      case 'easy': return 'grid-cols-4 sm:grid-cols-6'
      case 'medium': return 'grid-cols-6 sm:grid-cols-8'
      case 'hard': return 'grid-cols-8 sm:grid-cols-10'
      default: return 'grid-cols-4 sm:grid-cols-6'
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`grid ${getGridCols()} gap-2 max-w-4xl mx-auto px-4`}
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ 
            delay: index * 0.05,
            duration: 0.3
          }}
        >
          <Card
            card={card}
            onClick={onCardClick}
            isDisabled={isDisabled}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default GameGrid