'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const AuroraBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const time = { value: 0 }
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      hue: number
      alpha: number
    }> = []

    // Create particles for light theme
    for (let i = 0; i < 4; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 300 + 150,
        hue: Math.random() * 60 + 120, // Green to light blue range
        alpha: Math.random() * 0.15 + 0.05
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time.value += 0.01

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius
        if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius
        if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius
        if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius

        // Create gradient for light theme
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius
        )

        const hue = particle.hue + Math.sin(time.value + particle.x * 0.01) * 20
        gradient.addColorStop(0, `hsla(${hue}, 70%, 70%, ${particle.alpha})`)
        gradient.addColorStop(0.4, `hsla(${hue}, 60%, 75%, ${particle.alpha * 0.6})`)
        gradient.addColorStop(0.7, `hsla(${hue}, 50%, 80%, ${particle.alpha * 0.3})`)
        gradient.addColorStop(1, `hsla(${hue}, 40%, 85%, 0)`)

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Light gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-blue-50/30" />

      {/* Grid pattern for light theme */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 197, 94, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Light floating orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-300 rounded-full filter blur-3xl opacity-20"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300 rounded-full filter blur-3xl opacity-20"
      />

      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-200 rounded-full filter blur-3xl opacity-15"
      />
    </div>
  )
}

export default AuroraBackground