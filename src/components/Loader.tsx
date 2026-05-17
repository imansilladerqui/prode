type Props = {
  label?: string
  className?: string
}

export const Loader = ({ label, className }: Props) => {
  const rootClass = className ? `loader ${className}` : 'loader'

  return (
    <div className={rootClass} role="status" aria-live="polite" aria-label={label}>
      <div className="loader__spinner" aria-hidden />
      {label ? <p className="loader__label">{label}</p> : null}
    </div>
  )
}
