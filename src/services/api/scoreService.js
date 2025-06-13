import scoresData from '../mockData/scores.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ScoreService {
  constructor() {
    this.scores = [...scoresData]
  }

  async getAll() {
    await delay(200)
    return [...this.scores].sort((a, b) => a.time - b.time)
  }

  async getBestScore() {
    await delay(200)
    if (this.scores.length === 0) return null
    return [...this.scores].sort((a, b) => a.time - b.time)[0]
  }

  async create(score) {
    await delay(300)
    const newScore = {
      ...score,
      id: Date.now().toString(),
      date: new Date().toISOString()
    }
    this.scores.push(newScore)
    return { ...newScore }
  }

  async getPersonalBest() {
    await delay(200)
    const sortedScores = [...this.scores].sort((a, b) => {
      if (a.time === b.time) return a.moves - b.moves
      return a.time - b.time
    })
    return sortedScores[0] || null
  }
}

export default new ScoreService()