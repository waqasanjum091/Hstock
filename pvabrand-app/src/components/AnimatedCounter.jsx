import { motion } from 'framer-motion'
import { useCountUp } from '../hooks/useAnimations'

export default function AnimatedCounter({ end, suffix = '', prefix = '', label, duration = 2000 }) {
  const { count, ref } = useCountUp(end, duration)

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}
