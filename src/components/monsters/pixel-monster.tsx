'use client'

import { useEffect, useRef } from 'react'
import type { MonsterState, MonsterTraits } from '@/shared/types/monster'
import { DEFAULT_MONSTER_TRAITS } from '@/shared/types/monster'

export interface PixelMonsterProps {
  state: MonsterState
  traits: MonsterTraits
}

export function PixelMonster ({ state, traits = DEFAULT_MONSTER_TRAITS }: PixelMonsterProps): React.ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return

    const ctx = canvas.getContext('2d')
    if (ctx == null) return

    canvas.width = 160
    canvas.height = 160

    let animationId: number

    const animate = (): void => {
      frameRef.current += 1
      drawMonster(ctx, state, frameRef.current, traits ?? DEFAULT_MONSTER_TRAITS)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId !== undefined) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [state, traits])

  return <canvas ref={canvasRef} className='mx-auto h-full w-full' style={{ imageRendering: 'pixelated' }} />
}

export default PixelMonster

function drawMonster (
  ctx: CanvasRenderingContext2D,
  state: MonsterState,
  frame: number,
  traits: MonsterTraits
): void {
  const pixelSize = 6
  const bounce = Math.sin(frame * 0.05) * 3

  ctx.clearRect(0, 0, 160, 160)

  let bodyColor = traits.bodyColor
  let accentColor = traits.accentColor

  if (state === 'sad') {
    bodyColor = adjustColorBrightness(traits.bodyColor, -20)
    accentColor = adjustColorBrightness(traits.accentColor, -20)
  }
  if (state === 'hungry') {
    bodyColor = adjustColorBrightness(traits.bodyColor, 10)
    accentColor = adjustColorBrightness(traits.accentColor, 10)
  }
  if (state === 'sleepy') {
    bodyColor = adjustColorBrightness(traits.bodyColor, -10)
    accentColor = adjustColorBrightness(traits.accentColor, -10)
  }
  if (state === 'angry') {
    bodyColor = adjustColorBrightness(traits.bodyColor, 15)
    accentColor = adjustColorBrightness(traits.accentColor, 15)
  }

  let extraBounce = 0
  if (state === 'happy') {
    extraBounce = Math.abs(Math.sin(frame * 0.2)) * -8
  }

  const bodyY = 55 + bounce + extraBounce

  drawBody(ctx, traits.bodyStyle, bodyColor, accentColor, bodyY, pixelSize)

  drawEyes(ctx, traits.eyeStyle, traits.eyeColor, state, bodyY, pixelSize, frame)

  drawMouth(ctx, state, traits.eyeColor, traits.cheekColor, bodyY, pixelSize, frame)

  const armWave = Math.sin(frame * 0.1) * 5
  ctx.fillStyle = bodyColor
  ctx.fillRect(33, bodyY + 30 + armWave, pixelSize, pixelSize * 3)
  ctx.fillRect(27, bodyY + 33 + armWave, pixelSize, pixelSize * 2)

  ctx.fillRect(123, bodyY + 30 - armWave, pixelSize, pixelSize * 3)
  ctx.fillRect(129, bodyY + 33 - armWave, pixelSize, pixelSize * 2)

  ctx.fillRect(57, bodyY + 54, pixelSize * 3, pixelSize * 2)
  ctx.fillRect(105, bodyY + 54, pixelSize * 3, pixelSize * 2)

  drawAntenna(ctx, traits.antennaStyle, traits.antennaColor, traits.bobbleColor, bodyY, pixelSize, frame)

  drawAccessory(ctx, traits.accessory, traits.accentColor, bodyY, pixelSize, frame)

  drawStateEffects(ctx, state, bodyY, pixelSize, frame)
}

type MonsterStyle = MonsterTraits['bodyStyle']

type EyeStyle = MonsterTraits['eyeStyle']

type AntennaStyle = MonsterTraits['antennaStyle']

type AccessoryStyle = MonsterTraits['accessory']

function drawBody (
  ctx: CanvasRenderingContext2D,
  style: MonsterStyle,
  bodyColor: string,
  accentColor: string,
  bodyY: number,
  pixelSize: number
): void {
  ctx.fillStyle = accentColor

  switch (style) {
    case 'round':
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 11; x++) {
          if (
            (y === 0 && x >= 3 && x <= 7) ||
            (y === 1 && x >= 2 && x <= 8) ||
            (y >= 2 && y <= 7 && x >= 1 && x <= 9) ||
            (y === 8 && x >= 2 && x <= 8)
          ) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      ctx.fillStyle = bodyColor
      for (let y = 1; y < 8; y++) {
        for (let x = 2; x < 9; x++) {
          if (y >= 2 && y <= 6) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 1 && x >= 3 && x <= 7) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 7 && x >= 3 && x <= 7) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      break

    case 'square':
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 11; x++) {
          if (x >= 1 && x <= 9) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      ctx.fillStyle = bodyColor
      for (let y = 1; y < 8; y++) {
        for (let x = 2; x < 9; x++) {
          ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
        }
      }
      break

    case 'tall':
      for (let y = 0; y < 11; y++) {
        for (let x = 0; x < 9; x++) {
          if (
            (y === 0 && x >= 2 && x <= 6) ||
            (y === 1 && x >= 1 && x <= 7) ||
            (y >= 2 && y <= 9 && x >= 1 && x <= 7) ||
            (y === 10 && x >= 2 && x <= 6)
          ) {
            ctx.fillRect(51 + x * pixelSize, bodyY - 12 + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      ctx.fillStyle = bodyColor
      for (let y = 1; y < 10; y++) {
        for (let x = 2; x < 7; x++) {
          if (y >= 2 && y <= 8) {
            ctx.fillRect(51 + x * pixelSize, bodyY - 12 + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 1 && x >= 3 && x <= 5) {
            ctx.fillRect(51 + x * pixelSize, bodyY - 12 + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 9 && x >= 3 && x <= 5) {
            ctx.fillRect(51 + x * pixelSize, bodyY - 12 + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      break

    case 'wide':
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 13; x++) {
          if (
            (y === 0 && x >= 3 && x <= 9) ||
            (y === 1 && x >= 2 && x <= 10) ||
            (y >= 2 && y <= 5 && x >= 1 && x <= 11) ||
            (y === 6 && x >= 2 && x <= 10)
          ) {
            ctx.fillRect(39 + x * pixelSize, bodyY + 6 + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      ctx.fillStyle = bodyColor
      for (let y = 1; y < 6; y++) {
        for (let x = 2; x < 11; x++) {
          if (y >= 2 && y <= 4) {
            ctx.fillRect(39 + x * pixelSize, bodyY + 6 + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 1 && x >= 3 && x <= 9) {
            ctx.fillRect(39 + x * pixelSize, bodyY + 6 + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 5 && x >= 3 && x <= 9) {
            ctx.fillRect(39 + x * pixelSize, bodyY + 6 + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      break
  }
}

function drawEyes (
  ctx: CanvasRenderingContext2D,
  style: EyeStyle,
  eyeColor: string,
  state: MonsterState,
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  ctx.fillStyle = eyeColor

  if (state === 'sleepy') {
    ctx.fillRect(63, bodyY + 24, pixelSize * 2, pixelSize)
    ctx.fillRect(93, bodyY + 24, pixelSize * 2, pixelSize)
    return
  }

  const eyeBlink = Math.floor(frame / 80) % 12 === 0

  if (eyeBlink) {
    ctx.fillRect(63, bodyY + 24, pixelSize * 2, pixelSize)
    ctx.fillRect(93, bodyY + 24, pixelSize * 2, pixelSize)
    return
  }

  switch (style) {
    case 'big':
      ctx.fillRect(63, bodyY + 21, pixelSize * 2, pixelSize * 2)
      ctx.fillRect(93, bodyY + 21, pixelSize * 2, pixelSize * 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(66, bodyY + 21, pixelSize, pixelSize)
      ctx.fillRect(96, bodyY + 21, pixelSize, pixelSize)
      ctx.fillRect(69, bodyY + 24, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(99, bodyY + 24, pixelSize / 2, pixelSize / 2)
      break

    case 'small':
      ctx.fillRect(66, bodyY + 24, pixelSize, pixelSize)
      ctx.fillRect(96, bodyY + 24, pixelSize, pixelSize)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(66, bodyY + 24, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(96, bodyY + 24, pixelSize / 2, pixelSize / 2)
      break

    case 'star':
      ctx.fillRect(66, bodyY + 21, pixelSize, pixelSize * 2)
      ctx.fillRect(63, bodyY + 24, pixelSize * 2, pixelSize)
      ctx.fillRect(96, bodyY + 21, pixelSize, pixelSize * 2)
      ctx.fillRect(93, bodyY + 24, pixelSize * 2, pixelSize)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(66, bodyY + 24, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(96, bodyY + 24, pixelSize / 2, pixelSize / 2)
      break

    case 'sleepy':
      ctx.fillRect(63, bodyY + 24, pixelSize * 2, pixelSize)
      ctx.fillRect(93, bodyY + 24, pixelSize * 2, pixelSize)
      ctx.fillRect(63, bodyY + 21, pixelSize * 2, pixelSize / 2)
      ctx.fillRect(93, bodyY + 21, pixelSize * 2, pixelSize / 2)
      break
  }
}

function drawMouth (
  ctx: CanvasRenderingContext2D,
  state: MonsterState,
  eyeColor: string,
  cheekColor: string,
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  ctx.fillStyle = eyeColor

  if (state === 'happy') {
    ctx.fillRect(75, bodyY + 42, pixelSize * 3, pixelSize)
    ctx.fillRect(69, bodyY + 39, pixelSize, pixelSize)
    ctx.fillRect(105, bodyY + 39, pixelSize, pixelSize)

    ctx.fillStyle = cheekColor
    ctx.fillRect(57, bodyY + 36, pixelSize * 2, pixelSize)
    ctx.fillRect(111, bodyY + 36, pixelSize * 2, pixelSize)
  } else if (state === 'sad') {
    ctx.fillRect(75, bodyY + 39, pixelSize * 3, pixelSize)
    ctx.fillRect(69, bodyY + 42, pixelSize, pixelSize)
    ctx.fillRect(105, bodyY + 42, pixelSize, pixelSize)
  } else if (state === 'hungry') {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 4; x++) {
        if ((y === 0 && x >= 1 && x <= 2) || y === 1 || (y === 2 && x >= 1 && x <= 2)) {
          ctx.fillRect(75 + x * pixelSize, bodyY + 36 + y * pixelSize, pixelSize, pixelSize)
        }
      }
    }
  } else if (state === 'sleepy') {
    ctx.fillRect(78, bodyY + 42, pixelSize * 2, pixelSize)
  } else if (state === 'angry') {
    ctx.fillRect(72, bodyY + 42, pixelSize * 4, pixelSize)
  }
}

function drawAntenna (
  ctx: CanvasRenderingContext2D,
  style: AntennaStyle,
  antennaColor: string,
  bobbleColor: string,
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  const bobbleY = bodyY - 18 + Math.sin(frame * 0.08) * 3

  switch (style) {
    case 'single':
      ctx.fillStyle = antennaColor
      ctx.fillRect(75, bodyY - 6, pixelSize, pixelSize * 3)
      ctx.fillStyle = bobbleColor
      ctx.fillRect(72, bobbleY, pixelSize * 3, pixelSize * 3)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(75, bobbleY + 3, pixelSize, pixelSize)
      break

    case 'double':
      ctx.fillStyle = antennaColor
      ctx.fillRect(63, bodyY - 6, pixelSize, pixelSize * 3)
      ctx.fillRect(87, bodyY - 12, pixelSize, pixelSize * 3)
      ctx.fillStyle = bobbleColor
      ctx.fillRect(63, bobbleY, pixelSize * 3, pixelSize * 3)
      ctx.fillRect(81, bobbleY, pixelSize * 3, pixelSize * 3)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(66, bobbleY + 3, pixelSize, pixelSize)
      ctx.fillRect(84, bobbleY + 3, pixelSize, pixelSize)
      break

    case 'curly': {
      ctx.fillStyle = antennaColor
      const curvePoints = [
        { x: 78, y: bodyY - 12 },
        { x: 84, y: bodyY - 15 },
        { x: 84, y: bodyY - 21 },
        { x: 78, y: bodyY - 24 }
      ]
      curvePoints.forEach((point) => {
        ctx.fillRect(point.x, point.y, pixelSize, pixelSize)
      })
      ctx.fillStyle = bobbleColor
      ctx.fillRect(72, bodyY - 27, pixelSize * 3, pixelSize * 3)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(75, bodyY - 24, pixelSize, pixelSize)
      break
    }

    case 'none':
      // No antenna to draw
      break
  }
}

function drawAccessory (
  ctx: CanvasRenderingContext2D,
  accessory: AccessoryStyle,
  accentColor: string,
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  const bounce = Math.sin(frame * 0.05) * 2
  ctx.fillStyle = accentColor

  switch (accessory) {
    case 'horns':
      ctx.beginPath()
      ctx.moveTo(48, bodyY + 10)
      ctx.lineTo(42, bodyY - 6)
      ctx.lineTo(52, bodyY + 4)
      ctx.closePath()
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(102, bodyY + 10)
      ctx.lineTo(108, bodyY - 6)
      ctx.lineTo(98, bodyY + 4)
      ctx.closePath()
      ctx.fill()
      break

    case 'ears':
      ctx.beginPath()
      ctx.moveTo(48, bodyY + 12)
      ctx.quadraticCurveTo(38, bodyY, 46, bodyY - 12)
      ctx.quadraticCurveTo(54, bodyY, 48, bodyY + 12)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(102, bodyY + 12)
      ctx.quadraticCurveTo(112, bodyY, 104, bodyY - 12)
      ctx.quadraticCurveTo(96, bodyY, 102, bodyY + 12)
      ctx.fill()
      break

    case 'tail':
      ctx.beginPath()
      ctx.moveTo(120, bodyY + 60)
      ctx.quadraticCurveTo(140, bodyY + 40 + bounce, 125, bodyY + 20)
      ctx.quadraticCurveTo(130, bodyY + 35 + bounce, 120, bodyY + 60)
      ctx.fill()
      break

    case 'none':
      break
  }
}

function drawStateEffects (
  ctx: CanvasRenderingContext2D,
  state: MonsterState,
  bodyY: number,
  pixelSize: number,
  frame: number
): void {
  if (state === 'happy') {
    ctx.fillStyle = 'rgba(255, 223, 0, 0.3)'
    for (let i = 0; i < 5; i++) {
      const angle = (frame * 0.05 + i * (Math.PI * 2 / 5)) % (Math.PI * 2)
      const x = 80 + Math.cos(angle) * 35
      const y = bodyY + Math.sin(angle) * 15
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  if (state === 'sleepy') {
    ctx.fillStyle = 'rgba(120, 144, 156, 0.4)'
    const zOffset = Math.sin(frame * 0.08) * 5
    ctx.beginPath()
    ctx.arc(112, bodyY - 15 - zOffset, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(125, bodyY - 25 - zOffset * 1.2, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(135, bodyY - 35 - zOffset * 1.4, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  if (state === 'angry') {
    ctx.strokeStyle = 'rgba(255, 88, 88, 0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(60, bodyY - 12)
    ctx.lineTo(50, bodyY - 22)
    ctx.moveTo(100, bodyY - 12)
    ctx.lineTo(110, bodyY - 22)
    ctx.stroke()
  }
}

function adjustColorBrightness (hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const r = (num >> 16) + amt
  const g = ((num >> 8) & 0x00ff) + amt
  const b = (num & 0x0000ff) + amt

  const clamp = (value: number): number => {
    if (value < 1) return 0
    if (value > 255) return 255
    return value
  }

  return (
    '#' +
    (
      0x1000000 +
      clamp(r) * 0x10000 +
      clamp(g) * 0x100 +
      clamp(b)
    )
      .toString(16)
      .slice(1)
  )
}
