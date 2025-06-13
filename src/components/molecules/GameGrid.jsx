import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'

const GameGrid = ({ cards, onCardClick, isDisabled }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
className="grid grid-cols-8 gap-2 max-w-4xl mx-auto px-4"
    >
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