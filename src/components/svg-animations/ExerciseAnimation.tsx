import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { AnimationKey } from '../../types'

interface ExerciseAnimationProps {
  type: AnimationKey
  title: string
}

const transition = { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }
const shoulderTransition = { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const }

const motionFor = (type: AnimationKey) => {
  switch (type) {
    case 'neckSideStretch':
      return { headX: [-6, 10, -6], headRotate: [-10, 12, -10], armY: [0, 0, 0] }
    case 'neckTurn':
      return { headX: [-8, 8, -8], headRotate: [-4, 4, -4], armY: [0, 0, 0] }
    case 'chestOpen':
    case 'scapulaSqueeze':
      return { headX: [0, 0, 0], headRotate: [0, 0, 0], armY: [16, -6, 16] }
    case 'chinTuck':
      return { headX: [10, -8, 10], headRotate: [0, 0, 0], armY: [0, 0, 0] }
    case 'armRaise':
    case 'fullBodyReach':
      return { headX: [0, 0, 0], headRotate: [0, 0, 0], armY: [18, -28, 18] }
    case 'sideStretch':
      return { headX: [-10, 12, -10], headRotate: [-6, 8, -6], armY: [4, -20, 4] }
    case 'neckCircle':
      return { headX: [-8, 8, 8, -8], headRotate: [-8, 8, -8, 8], armY: [0, 0, 0, 0] }
    case 'thoracicRotate':
      return { headX: [-10, 10, -10], headRotate: [-8, 8, -8], armY: [0, -6, 0] }
    default:
      return { headX: [0, 0, 0], headRotate: [0, 0, 0], armY: [0, 0, 0] }
  }
}

const FrontBody = ({ children }: { children?: ReactNode }) => (
  <svg viewBox="0 0 360 360" role="img" className="exercise-svg shoulder-front-svg">
    <defs>
      <linearGradient id="frontBodyLine" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#4dd4ac" />
        <stop offset="100%" stopColor="#6aa7ff" />
      </linearGradient>
    </defs>
    <circle cx="180" cy="78" r="32" fill="#eef8ff" stroke="#6aa7ff" strokeWidth="5" />
    <line x1="180" y1="112" x2="180" y2="238" stroke="url(#frontBodyLine)" strokeWidth="12" strokeLinecap="round" />
    <line x1="180" y1="238" x2="134" y2="305" stroke="url(#frontBodyLine)" strokeWidth="10" strokeLinecap="round" />
    <line x1="180" y1="238" x2="226" y2="305" stroke="url(#frontBodyLine)" strokeWidth="10" strokeLinecap="round" />
    {children}
  </svg>
)

const ShoulderShrugViews = () => (
  <div className="dual-action-view">
    <div className="front-view">
      <span className="view-label">正视图</span>
      <FrontBody>
        <motion.g animate={{ y: [16, -22, 16] }} transition={shoulderTransition}>
          <line x1="122" y1="158" x2="238" y2="158" stroke="url(#frontBodyLine)" strokeWidth="12" strokeLinecap="round" />
          <line x1="122" y1="158" x2="104" y2="238" stroke="url(#frontBodyLine)" strokeWidth="9" strokeLinecap="round" />
          <line x1="238" y1="158" x2="256" y2="238" stroke="url(#frontBodyLine)" strokeWidth="9" strokeLinecap="round" />
          <circle cx="122" cy="158" r="12" fill="#4dd4ac" />
          <circle cx="238" cy="158" r="12" fill="#4dd4ac" />
        </motion.g>
        <motion.g animate={{ y: [12, -18, 12] }} transition={shoulderTransition}>
          <line x1="98" y1="174" x2="98" y2="126" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
          <path d="M84 140 L98 124 L112 140" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="262" y1="174" x2="262" y2="126" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
          <path d="M248 140 L262 124 L276 140" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      </FrontBody>
    </div>
    <div className="side-view">
      <span className="view-label">侧视图</span>
      <svg viewBox="0 0 190 230" role="img" aria-label="耸肩侧视图">
        <circle cx="82" cy="42" r="24" fill="#eef8ff" stroke="#6aa7ff" strokeWidth="4" />
        <line x1="82" y1="68" x2="82" y2="155" stroke="#4dd4ac" strokeWidth="9" strokeLinecap="round" />
        <motion.g animate={{ y: [12, -20, 12] }} transition={shoulderTransition}>
          <circle cx="88" cy="88" r="13" fill="#facc15" />
          <line x1="88" y1="88" x2="106" y2="165" stroke="#6aa7ff" strokeWidth="8" strokeLinecap="round" />
          <circle cx="106" cy="165" r="8" fill="#dffcf2" />
        </motion.g>
        <line x1="132" y1="124" x2="132" y2="72" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
        <path d="M120 84 L132 70 L144 84" fill="none" stroke="#facc15" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="95" y="212" textAnchor="middle" fill="#fef3c7" fontSize="14" fontWeight="800">肩头向上，不抬手</text>
      </svg>
    </div>
  </div>
)

const ShoulderRollViews = () => (
  <div className="dual-action-view">
    <div className="front-view">
      <span className="view-label">正视图</span>
      <FrontBody>
        <line x1="122" y1="158" x2="238" y2="158" stroke="url(#frontBodyLine)" strokeWidth="12" strokeLinecap="round" />
        <line x1="122" y1="158" x2="104" y2="238" stroke="url(#frontBodyLine)" strokeWidth="9" strokeLinecap="round" />
        <line x1="238" y1="158" x2="256" y2="238" stroke="url(#frontBodyLine)" strokeWidth="9" strokeLinecap="round" />
        <circle cx="122" cy="158" r="12" fill="#4dd4ac" />
        <circle cx="238" cy="158" r="12" fill="#4dd4ac" />
        <path d="M92 156 C98 112 146 110 152 156 C154 194 102 198 92 156" fill="none" stroke="#facc15" strokeDasharray="7 7" strokeWidth="5" />
        <path d="M208 156 C214 112 262 110 268 156 C270 194 218 198 208 156" fill="none" stroke="#facc15" strokeDasharray="7 7" strokeWidth="5" />
        <motion.circle cx="122" cy="116" r="9" fill="#facc15" animate={{ cx: [122, 152, 122, 92, 122], cy: [116, 156, 196, 156, 116] }} transition={transition} />
        <motion.circle cx="238" cy="116" r="9" fill="#facc15" animate={{ cx: [238, 268, 238, 208, 238], cy: [116, 156, 196, 156, 116] }} transition={transition} />
        <text x="180" y="334" textAnchor="middle" fill="#fef3c7" fontSize="18" fontWeight="800">肩头画圆，手臂放松垂下</text>
      </FrontBody>
    </div>
    <div className="side-view">
      <span className="view-label">侧视图</span>
      <svg viewBox="0 0 190 230" role="img" aria-label="肩部环绕侧视图">
        <circle cx="78" cy="42" r="24" fill="#eef8ff" stroke="#6aa7ff" strokeWidth="4" />
        <line x1="78" y1="68" x2="78" y2="155" stroke="#4dd4ac" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="88" cy="94" rx="24" ry="34" fill="none" stroke="#facc15" strokeDasharray="6 6" strokeWidth="5" />
        <motion.g animate={{ x: [0, 20, 0, -16, 0], y: [-22, 0, 26, 0, -22] }} transition={transition}>
          <circle cx="88" cy="94" r="12" fill="#facc15" />
          <line x1="88" y1="94" x2="108" y2="166" stroke="#6aa7ff" strokeWidth="8" strokeLinecap="round" />
          <circle cx="108" cy="166" r="8" fill="#dffcf2" />
        </motion.g>
        <path d="M118 68 C148 80 150 112 124 130" fill="none" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
        <path d="M124 130 L124 112 L140 122" fill="none" stroke="#facc15" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="95" y="212" textAnchor="middle" fill="#fef3c7" fontSize="14" fontWeight="800">向上、向后、向下滚动</text>
      </svg>
    </div>
  </div>
)

export const ExerciseAnimation = ({ type, title }: ExerciseAnimationProps) => {
  const movement = motionFor(type)

  if (type === 'shoulderShrug' || type === 'shoulderRoll') {
    return (
      <div className="animation-stage">
        <div className="panel-label">标准动作演示</div>
        {type === 'shoulderShrug' ? <ShoulderShrugViews /> : <ShoulderRollViews />}
        <div className="animation-caption">{title}</div>
      </div>
    )
  }

  return (
    <div className="animation-stage">
      <div className="panel-label">标准动作演示</div>
      <svg viewBox="0 0 360 360" role="img" aria-label={title} className="exercise-svg">
        <defs>
          <linearGradient id="bodyLine" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#4dd4ac" />
            <stop offset="100%" stopColor="#6aa7ff" />
          </linearGradient>
        </defs>
        <motion.g animate={{ x: movement.headX, rotate: movement.headRotate }} transition={transition} style={{ transformOrigin: '180px 98px' }}>
          <circle cx="180" cy="82" r="33" fill="#eef8ff" stroke="#6aa7ff" strokeWidth="5" />
          <line x1="180" y1="115" x2="180" y2="145" stroke="url(#bodyLine)" strokeWidth="10" strokeLinecap="round" />
        </motion.g>
        <line x1="180" y1="145" x2="180" y2="235" stroke="url(#bodyLine)" strokeWidth="12" strokeLinecap="round" />
        <motion.g animate={{ y: movement.armY }} transition={transition}>
          <line x1="124" y1="154" x2="236" y2="154" stroke="url(#bodyLine)" strokeWidth="11" strokeLinecap="round" />
          <line x1="124" y1="154" x2="92" y2="218" stroke="url(#bodyLine)" strokeWidth="9" strokeLinecap="round" />
          <line x1="236" y1="154" x2="268" y2="218" stroke="url(#bodyLine)" strokeWidth="9" strokeLinecap="round" />
          <circle cx="124" cy="154" r="9" fill="#4dd4ac" />
          <circle cx="236" cy="154" r="9" fill="#4dd4ac" />
          <circle cx="92" cy="218" r="8" fill="#6aa7ff" />
          <circle cx="268" cy="218" r="8" fill="#6aa7ff" />
        </motion.g>
        <line x1="180" y1="235" x2="132" y2="302" stroke="url(#bodyLine)" strokeWidth="10" strokeLinecap="round" />
        <line x1="180" y1="235" x2="228" y2="302" stroke="url(#bodyLine)" strokeWidth="10" strokeLinecap="round" />
        <circle cx="180" cy="145" r="10" fill="#dffcf2" />
        <circle cx="180" cy="235" r="10" fill="#dffcf2" />
      </svg>
      <div className="animation-caption">{title}</div>
    </div>
  )
}
