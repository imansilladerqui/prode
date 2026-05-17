import { lazy, Suspense } from 'react'

const LOGO_SRC = `${import.meta.env.BASE_URL}wc2026-loader.png`

const LoaderLottie = lazy(() =>
  import('./LoaderLottie').then((m) => ({ default: m.LoaderLottie })),
)

type Props = {
  className?: string
}

export const Loader = ({ className }: Props) => {
  const rootClass = className ? `loader ${className}` : 'loader'

  return (
    <div className={rootClass} role="status" aria-live="polite" aria-label="Loading">
      <Suspense
        fallback={
          <img className="loader__lottie loader__lottie--static" src={LOGO_SRC} alt="" decoding="async" />
        }
      >
        <LoaderLottie />
      </Suspense>
    </div>
  )
}
