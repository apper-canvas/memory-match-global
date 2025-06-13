import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { gameService } from '@/services'
import GameGrid from '@/components/molecules/GameGrid'
import GameStats from '@/components/molecules/GameStats'
import WinModal from '@/components/molecules/WinModal'

const GameBoard = () => {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [moves, setMoves] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isWon, setIsWon] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
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

  // Update theme class on document body
  useEffect(() => {
    document.body.className = `theme-${theme}`
  }, [theme])

  // Timer effect
  useEffect(() => {
    let timer
    if (startTime && !isWon) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [startTime, isWon])

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
        </motion.div>
        
        <GameStats 
          moves={moves}
          time={elapsedTime}
          formatTime={gameService.formatTime}
        />
<GameGrid
          cards={cards}
          onCardClick={handleCardClick}
          isDisabled={isProcessing || flippedCards.length >= 2}
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