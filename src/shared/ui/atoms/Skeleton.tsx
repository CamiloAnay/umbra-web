type Props = {
  className?: string
}

export function Skeleton({ className = '' }: Props) {
  return (
    <span
      aria-hidden
      className={`block animate-pulse rounded-[2px] bg-ink/8 motion-reduce:animate-none ${className}`}
    />
  )
}
