import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'

export default function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all duration-300"
    >
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <FiStar key={i} size={14} className="text-orange-400 fill-orange-400" />
        ))}
      </div>

      {/* Text */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white shadow-sm shadow-orange-200">
          {testimonial.avatar}
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
          <div className="text-xs text-gray-400">{testimonial.role} &bull; {testimonial.platform}</div>
        </div>
      </div>
    </motion.div>
  )
}
