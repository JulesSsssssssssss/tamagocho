const BODY_FILLS = ['#B89AF5', '#F5A3C7', '#8BD8BD', '#F6D365', '#FF9A8B'] as const
const BODY_STROKES = ['#7D63D1', '#D160A5', '#469086', '#F08A24', '#C24C47'] as const
const EYE_COLORS = ['#222', '#1F2933', '#2E2A47', '#2A3A4B'] as const
const HIGHLIGHT_OPACITY = [0.4, 0.5, 0.6, 0.7] as const
const CHEEK_COLORS = ['#FFB3C6', '#FFD0DC', '#FFC9D8', '#FFB8CC'] as const
const ACCESSORY_COLORS = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347'] as const
const PATTERN_COLORS = ['#8B008B', '#FF1493', '#00BFFF', '#32CD32'] as const

function getRandomItem<T> (collection: readonly T[]): T {
  return collection[Math.floor(Math.random() * collection.length)]
}

function getRandomInRange (min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export interface MonsterConfig {
  bodyFill: string
  bodyStroke: string
  eyeRadius: number
  leftEyeCx: number
  rightEyeCx: number
  pupilRadius: number
  highlightOpacity: number
  shadowOpacity: number
  bobAmplitude: number
  bobDuration: number
  hasHorns: boolean
  hasCheeks: boolean
  hasTongue: boolean
  hasSpots: boolean
  hasEyelashes: boolean
  hasTeeth: boolean
  hasEars: boolean
  hasSpikes: boolean
  hasStripes: boolean
  cheekColor: string
  accessoryColor: string
  patternColor: string
  eyeColor1: string
  eyeColor2: string
}

export interface MonsterSvgOptions {
  width?: number
  height?: number
  emotion?: 'happy' | 'sad' | 'angry' | 'hungry' | 'sleepy'
}

function generateMonsterConfig (): MonsterConfig {
  const eyeOffset = getRandomInRange(12, 15)
  const eyeRadius = getRandomInRange(4, 6)
  const leftEyeCx = 60 - eyeOffset / 2
  const rightEyeCx = 60 + eyeOffset / 2

  return {
    bodyFill: getRandomItem(BODY_FILLS),
    bodyStroke: getRandomItem(BODY_STROKES),
    eyeRadius,
    leftEyeCx,
    rightEyeCx,
    pupilRadius: eyeRadius / 2,
    highlightOpacity: getRandomItem(HIGHLIGHT_OPACITY),
    shadowOpacity: getRandomInRange(0.08, 0.16),
    bobAmplitude: getRandomInRange(3, 6),
    bobDuration: getRandomInRange(2.5, 4),
    hasHorns: Math.random() > 0.5,
    hasCheeks: Math.random() > 0.4,
    hasTongue: Math.random() > 0.6,
    hasSpots: Math.random() > 0.5,
    hasEyelashes: Math.random() > 0.5,
    hasTeeth: Math.random() > 0.4,
    hasEars: Math.random() > 0.5,
    hasSpikes: Math.random() > 0.6,
    hasStripes: Math.random() > 0.6,
    cheekColor: getRandomItem(CHEEK_COLORS),
    accessoryColor: getRandomItem(ACCESSORY_COLORS),
    patternColor: getRandomItem(PATTERN_COLORS),
    eyeColor1: getRandomItem(EYE_COLORS),
    eyeColor2: getRandomItem(EYE_COLORS)
  }
}

function buildMonsterSvg (config: MonsterConfig, emotion: 'happy' | 'sad' | 'angry' | 'hungry' | 'sleepy', width: number, height: number): string {
  const { leftEyeCx, rightEyeCx, eyeRadius, pupilRadius, highlightOpacity, shadowOpacity, bobAmplitude, bobDuration } = config
  const mouthBaselineY = 66

  let mouthEndY: number
  let mouthControlY: number
  let mouthD: string
  let eyeExpression: string

  switch (emotion) {
    case 'happy': {
      const smileDepth = 8
      mouthEndY = mouthBaselineY
      mouthControlY = mouthBaselineY + smileDepth
      mouthD = `M${leftEyeCx.toFixed(1)} ${mouthEndY} Q60 ${mouthControlY} ${rightEyeCx.toFixed(1)} ${mouthEndY}`
      eyeExpression = ''
      break
    }
    case 'sad': {
      const sadDepth = 5
      mouthEndY = mouthBaselineY - 6
      mouthControlY = mouthBaselineY + sadDepth
      mouthD = `M${leftEyeCx.toFixed(1)} ${mouthEndY} Q60 ${mouthControlY} ${rightEyeCx.toFixed(1)} ${mouthEndY}`
      eyeExpression = `<line x1="${(leftEyeCx - 1).toFixed(1)}" y1="50" x2="${(leftEyeCx + 1).toFixed(1)}" y2="58" stroke="#222" stroke-width="1.5"/>
  <line x1="${(rightEyeCx - 1).toFixed(1)}" y1="50" x2="${(rightEyeCx + 1).toFixed(1)}" y2="58" stroke="#222" stroke-width="1.5"/>`
      break
    }
    case 'angry': {
      mouthEndY = mouthBaselineY
      mouthControlY = mouthBaselineY - 3
      mouthD = `M${leftEyeCx.toFixed(1)} ${(mouthBaselineY - 3)} Q60 ${mouthControlY} ${rightEyeCx.toFixed(1)} ${mouthEndY}`
      eyeExpression = `<line x1="${(leftEyeCx - 2).toFixed(1)}" y1="50" x2="${(leftEyeCx + 2).toFixed(1)}" y2="57" stroke="#222" stroke-width="1.5"/>
  <line x1="${(rightEyeCx + 2).toFixed(1)}" y1="50" x2="${(rightEyeCx - 2).toFixed(1)}" y2="57" stroke="#222" stroke-width="1.5"/>`
      break
    }
    case 'hungry': {
      const hungryDepth = 12
      mouthEndY = mouthBaselineY
      mouthControlY = mouthBaselineY + hungryDepth
      mouthD = `M${(leftEyeCx + 1).toFixed(1)} ${mouthEndY} Q60 ${mouthControlY} ${(rightEyeCx - 1).toFixed(1)} ${mouthEndY}`
      eyeExpression = `<circle cx="${leftEyeCx.toFixed(1)}" cy="55" r="2" fill="#FF69B4"/>
  <circle cx="${rightEyeCx.toFixed(1)}" cy="55" r="2" fill="#FF69B4"/>`
      break
    }
    case 'sleepy': {
      mouthEndY = mouthBaselineY + 3
      mouthControlY = mouthBaselineY + 1
      mouthD = `M${leftEyeCx.toFixed(1)} ${mouthEndY} Q60 ${mouthControlY} ${rightEyeCx.toFixed(1)} ${mouthEndY}`
      eyeExpression = `<line x1="${(leftEyeCx - 3).toFixed(1)}" y1="55" x2="${(leftEyeCx + 3).toFixed(1)}" y2="55" stroke="#222" stroke-width="2" stroke-linecap="round"/>
  <line x1="${(rightEyeCx - 3).toFixed(1)}" y1="55" x2="${(rightEyeCx + 3).toFixed(1)}" y2="55" stroke="#222" stroke-width="2" stroke-linecap="round"/>`
      break
    }
    default: {
      const smileDepth = 8
      mouthEndY = mouthBaselineY
      mouthControlY = mouthBaselineY + smileDepth
      mouthD = `M${leftEyeCx.toFixed(1)} ${mouthEndY} Q60 ${mouthControlY} ${rightEyeCx.toFixed(1)} ${mouthEndY}`
      eyeExpression = ''
    }
  }

  const mouthEndYStr = mouthEndY.toFixed(1)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <defs>
    ${config.hasStripes
? `<pattern id="stripes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="8" y2="8" stroke="${config.patternColor}" stroke-width="1" opacity="0.2"/>
    </pattern>`
: ''}
  </defs>
  ${config.hasEars
? `<ellipse cx="30" cy="35" rx="8" ry="12" fill="${config.bodyFill}" stroke="${config.bodyStroke}" stroke-width="2"/>
  <ellipse cx="30" cy="38" rx="4" ry="7" fill="${config.accessoryColor}" opacity="0.7"/>
  <ellipse cx="90" cy="35" rx="8" ry="12" fill="${config.bodyFill}" stroke="${config.bodyStroke}" stroke-width="2"/>
  <ellipse cx="90" cy="38" rx="4" ry="7" fill="${config.accessoryColor}" opacity="0.7"/>`
: ''}
  ${config.hasHorns
? `<path d="M45 25 Q40 10 35 5" stroke="${config.accessoryColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="35" cy="5" r="3" fill="${config.accessoryColor}"/>
  <path d="M75 25 Q80 10 85 5" stroke="${config.accessoryColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="85" cy="5" r="3" fill="${config.accessoryColor}"/>`
: ''}
  ${config.hasSpikes
? `<polygon points="50,15 45,30 55,28" fill="${config.bodyStroke}" opacity="0.7"/>
  <polygon points="60,10 55,25 65,25" fill="${config.bodyStroke}" opacity="0.7"/>
  <polygon points="70,15 65,30 75,28" fill="${config.bodyStroke}" opacity="0.7"/>`
: ''}
  <path d="M40 40 Q60 10 80 40 Q90 70 80 100 Q70 90 60 100 Q50 90 40 100 Q30 70 40 40Z" fill="${config.bodyFill}" stroke="${config.bodyStroke}" stroke-width="3">
    <animateTransform attributeName="transform" type="translate" values="0 0; 0 -${bobAmplitude}; 0 0" dur="${bobDuration}s" repeatCount="indefinite"/>
  </path>
  ${config.hasStripes ? '<path d="M40 40 Q60 10 80 40 Q90 70 80 100 Q70 90 60 100 Q50 90 40 100 Q30 70 40 40Z" fill="url(#stripes)"/>' : ''}
  ${config.hasSpots
? `<circle cx="50" cy="60" r="4" fill="${config.bodyStroke}" opacity="0.3"/>
  <circle cx="70" cy="75" r="3" fill="${config.bodyStroke}" opacity="0.25"/>
  <circle cx="55" cy="85" r="3" fill="${config.bodyStroke}" opacity="0.2"/>
  <circle cx="72" cy="55" r="2.5" fill="${config.patternColor}" opacity="0.35"/>`
: ''}
  ${config.hasCheeks
? `<ellipse cx="35" cy="65" rx="6" ry="5" fill="${config.cheekColor}" opacity="0.6"/>
  <ellipse cx="85" cy="65" rx="6" ry="5" fill="${config.cheekColor}" opacity="0.6"/>`
: ''}
  <circle cx="${leftEyeCx.toFixed(1)}" cy="55" r="${eyeRadius.toFixed(1)}" fill="${config.eyeColor1}"/>
  <circle cx="${rightEyeCx.toFixed(1)}" cy="55" r="${eyeRadius.toFixed(1)}" fill="${config.eyeColor2}"/>
  <circle cx="${(leftEyeCx + 2).toFixed(1)}" cy="53" r="${pupilRadius.toFixed(1)}" fill="#fff" opacity="${highlightOpacity}"/>
  <circle cx="${(rightEyeCx + 2).toFixed(1)}" cy="53" r="${pupilRadius.toFixed(1)}" fill="#fff" opacity="${highlightOpacity}"/>
  ${eyeExpression}
  ${config.hasEyelashes
? `<line x1="${(leftEyeCx - 1).toFixed(1)}" y1="48" x2="${(leftEyeCx - 2).toFixed(1)}" y2="45" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="${leftEyeCx.toFixed(1)}" y1="48" x2="${leftEyeCx.toFixed(1)}" y2="44" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="${(leftEyeCx + 1).toFixed(1)}" y1="48" x2="${(leftEyeCx + 2).toFixed(1)}" y2="45" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="${(rightEyeCx - 1).toFixed(1)}" y1="48" x2="${(rightEyeCx - 2).toFixed(1)}" y2="45" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="${rightEyeCx.toFixed(1)}" y1="48" x2="${rightEyeCx.toFixed(1)}" y2="44" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="${(rightEyeCx + 1).toFixed(1)}" y1="48" x2="${(rightEyeCx + 2).toFixed(1)}" y2="45" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>`
: ''}
  <path d="${mouthD}" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/>
  ${config.hasTeeth
? `<line x1="54" y1="${mouthEndYStr}" x2="54" y2="${(Number(mouthEndYStr) + 3).toFixed(1)}" stroke="#f5f5dc" stroke-width="1.5"/>
  <line x1="60" y1="${mouthEndYStr}" x2="60" y2="${(Number(mouthEndYStr) + 4).toFixed(1)}" stroke="#f5f5dc" stroke-width="1.5"/>
  <line x1="66" y1="${mouthEndYStr}" x2="66" y2="${(Number(mouthEndYStr) + 3).toFixed(1)}" stroke="#f5f5dc" stroke-width="1.5"/>`
: ''}
  ${config.hasTongue ? '<ellipse cx="60" cy="78" rx="3" ry="4" fill="#FF69B4" opacity="0.8"/>' : ''}
  <ellipse cx="60" cy="104" rx="15" ry="3" fill="#000" opacity="${shadowOpacity.toFixed(2)}"/>
</svg>`
}

export function generateRandomMonsterSvg ({ width = 120, height = 120, emotion = 'happy' }: MonsterSvgOptions = {}): { svg: string, config: MonsterConfig } {
  const config = generateMonsterConfig()
  const svg = buildMonsterSvg(config, emotion, width, height)
  return { svg, config }
}

export function updateMonsterEmotion (config: MonsterConfig, emotion: 'happy' | 'sad' | 'angry' | 'hungry' | 'sleepy', width: number = 120, height: number = 120): string {
  return buildMonsterSvg(config, emotion, width, height)
}
