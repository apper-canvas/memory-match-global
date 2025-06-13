import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const Confetti = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899']
    const newParticles = []

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        size: 4 + Math.random() * 8
      })
    }

    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="confetti-particle absolute"
          style={{
            backgroundColor: particle.color,
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0'
          }}
          initial={{ 
            y: -100,
            x: 0,
            rotate: 0,
            opacity: 1
          }}
          animate={{ 
            y: window.innerHeight + 100,
            x: (Math.random() - 0.5) * 200,
            rotate: 720,
            opacity: 0
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

export default Confetti