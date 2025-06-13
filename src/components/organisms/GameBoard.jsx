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

  // Initialize game
  const initializeGame = useCallback(() => {
    const newCards = gameService.generateGameCards()
    setCards(newCards)
    setFlippedCards([])
    setMoves(0)
    setStartTime(null)
    setElapsedTime(0)
    setIsWon(false)
    setIsProcessing(false)
  }, [])

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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-2xl">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display text-center text-white mb-8"
        >
          Memory Match
        </motion.h1>
        
        <GameStats 
          moves={moves}
          time={elapsedTime}
          formatTime={gameService.formatTime}
        />
        
        <GameGrid
          cards={cards}
          onCardClick={handleCardClick}
          isDisabled={isProcessing || flippedCards.length >= 2}
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