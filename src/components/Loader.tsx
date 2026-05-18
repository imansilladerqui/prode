import { useLottie } from 'lottie-react'
import loaderAnimation from '../assets/wc2026-loader.lottie.json'
import type { LoaderProps } from '../types'

export const Loader = ({ className }: LoaderProps) => {
  const rootClass = className ? `loader ${className}` : 'loader'
  const { View } = useLottie({
    animationData: loaderAnimation,
    loop: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
    },
  })

  return (
    <div className={rootClass} role="status" aria-live="polite" aria-label="Loading">
      <div className="loader__lottie" aria-hidden>
        {View}
      </div>
    </div>
  )
}
