import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { gameService } from '@/services'
import GameGrid from '@/components/molecules/GameGrid'
import GameStats from '@/components/molecules/GameStats'
import WinModal from '@/components/molecules/WinModal'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const GameBoard = () => {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [moves, setMoves] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isWon, setIsWon] = useState(false)
const [isProcessing, setIsProcessing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [theme, setTheme] = useState('classic')
// Initialize game
  const initializeGame = useCallback(() => {
    const newCards = gameService.generateGameCardsByDifficulty(difficulty)
    setCards(newCards)
    setFlippedCards([])
    setMoves(0)
    setStartTime(null)
    setElapsedTime(0)
    setIsWon(false)
    setIsProcessing(false)
  }, [difficulty])

// Update theme class on document body - optimized
  useEffect(() => {
    const themeClass = `theme-${theme}`
    document.body.className = themeClass
    // Force repaint for theme changes
    document.body.offsetHeight
  }, [theme])

// Timer effect
  useEffect(() => {
    let timer
    if (startTime && !isWon && !isPaused) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [startTime, isWon, isPaused])

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // Handle card click
  const handleCardClick = async (clickedCard) => {
    if (isProcessing || clickedCard.isFlipped || clickedCard.isMatched) return

    // Start timer on first move
    if (!startTime) {
      setStartTime(Date.now())
    }

    try {
      setIsProcessing(true)
      
      // Flip the clicked card
      const cardsWithFlipped = await gameService.flipCard(cards, clickedCard.id)
      setCards(cardsWithFlipped)
      
      const newFlippedCards = [...flippedCards, clickedCard]
      setFlippedCards(newFlippedCards)
      
      // If this is the second card in the pair
      if (newFlippedCards.length === 2) {
        setMoves(prev => prev + 1)
        
        const [firstCard, secondCard] = newFlippedCards
        const isMatch = gameService.checkMatch(firstCard, secondCard)
        
        if (isMatch) {
          // Match found
          const cardsWithMatched = await gameService.matchCards(
            cardsWithFlipped, 
            [firstCard.id, secondCard.id]
          )
          setCards(cardsWithMatched)
          setFlippedCards([])
          
          // Check for win
          if (gameService.checkWin(cardsWithMatched)) {
            setIsWon(true)
            toast.success("Congratulations! You won!")
          }
        } else {
          // No match - flip cards back
          const cardsFlippedBack = await gameService.flipCardsBack(
            cardsWithFlipped, 
            [firstCard.id, secondCard.id]
          )
          setCards(cardsFlippedBack)
          setFlippedCards([])
        }
      }
    } catch (error) {
      toast.error("Something went wrong!")
      console.error("Game error:", error)
    } finally {
      setIsProcessing(false)
    }
}

  const handlePause = () => {
    if (!startTime || isWon) return
    
    if (isPaused) {
      // Resume: adjust startTime to account for paused duration
      const pausedDuration = elapsedTime * 1000
      setStartTime(Date.now() - pausedDuration)
      setIsPaused(false)
      toast.success("Game resumed!")
    } else {
      // Pause
      setIsPaused(true)
      toast.success("Game paused!")
    }
  }

  const handleReset = () => {
    setIsPaused(false)
    initializeGame()
    toast.success("Game reset!")
  }

  // Get theme-specific icons
  const getThemeIcons = () => {
    const iconMap = {
      classic: { pause: isPaused ? 'Play' : 'Pause', reset: 'RotateCcw' },
      ocean: { pause: isPaused ? 'Waves' : 'Anchor', reset: 'Shell' },
      forest: { pause: isPaused ? 'Leaf' : 'TreePine', reset: 'Flower2' },
      sunset: { pause: isPaused ? 'Sun' : 'Moon', reset: 'Sunrise' }
    }
    return iconMap[theme] || iconMap.classic
  }

const handleRestart = () => {
    initializeGame()
    toast.success("New game started!")
  }

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty)
    // Auto-restart game when difficulty changes
    setTimeout(() => {
      const newCards = gameService.generateGameCardsByDifficulty(newDifficulty)
      setCards(newCards)
      setFlippedCards([])
      setMoves(0)
      setStartTime(null)
      setElapsedTime(0)
      setIsWon(false)
      setIsProcessing(false)
    }, 100)
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }
return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-2xl">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display text-center text-white mb-6"
        >
          Memory Match
        </motion.h1>
        
        {/* Game Settings */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-4 mb-6 px-4"
        >
          <div className="flex items-center gap-2">
            <label className="text-gray-300 text-sm font-medium">Difficulty:</label>
<select 
              value={difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              className="bg-surface border border-gray-600 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="easy">Easy (4x6)</option>
              <option value="medium">Medium (6x8)</option>
              <option value="hard">Hard (8x10)</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-gray-300 text-sm font-medium">Theme:</label>
<select 
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="bg-surface border border-gray-600 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="classic">Classic</option>
              <option value="ocean">Ocean</option>
              <option value="forest">Forest</option>
              <option value="sunset">Sunset</option>
            </select>
</div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePause}
              variant="secondary"
              size="sm"
              disabled={!startTime || isWon}
              className="flex items-center gap-2"
            >
              <ApperIcon name={getThemeIcons().pause} size={16} />
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            
            <Button
              onClick={handleReset}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <ApperIcon name={getThemeIcons().reset} size={16} />
              Reset
            </Button>
          </div>
        </motion.div>
        
        <GameStats 
          moves={moves}
          time={elapsedTime}
          formatTime={gameService.formatTime}
        />
<GameGrid
          cards={cards}
          onCardClick={handleCardClick}
          isDisabled={isProcessing || flippedCards.length >= 2 || isPaused}
          difficulty={difficulty}
        />
        <WinModal
          isOpen={isWon}
          moves={moves}
          time={elapsedTime}
          formatTime={gameService.formatTime}
          onRestart={handleRestart}
        />
      </div>
    </div>
  )
}

export default GameBoard