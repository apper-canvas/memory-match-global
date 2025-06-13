import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const GameStats = ({ moves, time, formatTime }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center gap-8 mb-8 px-4"
    >
      <div className="flex items-center gap-2 bg-surface/50 rounded-lg px-4 py-2 border border-gray-600">
        <ApperIcon name="MousePointer" className="w-5 h-5 text-accent" />
        <span className="text-gray-300 font-medium">Moves:</span>
        <span className="text-white font-bold text-lg">{moves}</span>
      </div>
      
      <div className="flex items-center gap-2 bg-surface/50 rounded-lg px-4 py-2 border border-gray-600">
        <ApperIcon name="Clock" className="w-5 h-5 text-accent" />
        <span className="text-gray-300 font-medium">Time:</span>
        <span className="text-white font-bold text-lg font-mono">{formatTime(time)}</span>
      </div>
    </motion.div>
  )
}

export default GameStats