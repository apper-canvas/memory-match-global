import cardData from '../mockData/cards.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class GameService {
  getDifficultyConfig(difficulty = 'easy') {
    const configs = {
      easy: { pairs: 12, gridCols: 4 },
      medium: { pairs: 24, gridCols: 6 },
      hard: { pairs: 40, gridCols: 8 }
    }
    return configs[difficulty] || configs.easy
  }

  generateGameCardsByDifficulty(difficulty = 'easy') {
    const config = this.getDifficultyConfig(difficulty)
    const availableEmojis = cardData.emojis.slice(0, config.pairs)
    
    // Create pairs of cards with emojis
    const pairs = []
    availableEmojis.forEach((emoji, index) => {
      pairs.push(
        { id: `${index}-a`, emoji, isFlipped: false, isMatched: false, position: index * 2 },
        { id: `${index}-b`, emoji, isFlipped: false, isMatched: false, position: index * 2 + 1 }
      )
    })
    
    // Shuffle the cards
    return this.shuffleArray([...pairs]).map((card, index) => ({
      ...card,
      position: index
    }))
  }

  generateGameCards() {
    return this.generateGameCardsByDifficulty('easy')
  }

  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  async flipCard(cards, cardId) {
    await delay(100)
    return cards.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    )
  }

  async flipCardsBack(cards, cardIds) {
    await delay(1000) // 1 second delay to memorize
    return cards.map(card => 
      cardIds.includes(card.id) ? { ...card, isFlipped: false } : card
    )
  }

  async matchCards(cards, cardIds) {
    await delay(200)
    return cards.map(card => 
      cardIds.includes(card.id) ? { ...card, isMatched: true } : card
    )
  }

  checkMatch(card1, card2) {
    return card1.emoji === card2.emoji
  }

  checkWin(cards) {
    return cards.every(card => card.isMatched)
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

export default new GameService()