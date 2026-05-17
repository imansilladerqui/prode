import { useLottie } from 'lottie-react'
import loaderAnimation from '../assets/wc2026-loader.lottie.json'

export const LoaderLottie = () => {
  const { View } = useLottie({
    animationData: loaderAnimation,
    loop: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
    },
  })

  return (
    <div className="loader__lottie" aria-hidden>
      {View}
    </div>
  )
}
