import { useEffect, useState } from 'react'

function TypewriterText({
  text,
  animate = true,
  delay = 0,
  speed = 55,
  className = '',
}) {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  const shouldAnimate = animate && !prefersReducedMotion
  const [characterCount, setCharacterCount] = useState(
    shouldAnimate ? 0 : text.length,
  )
  const [hasStarted, setHasStarted] = useState(!shouldAnimate)

  useEffect(() => {
    if (!shouldAnimate) return undefined

    let intervalId
    const timeoutId = window.setTimeout(() => {
      setHasStarted(true)
      intervalId = window.setInterval(() => {
        setCharacterCount((currentCount) => {
          if (currentCount >= text.length) {
            window.clearInterval(intervalId)
            return currentCount
          }

          return currentCount + 1
        })
      }, speed)
    }, delay)

    return () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
    }
  }, [delay, shouldAnimate, speed, text])

  const isTyping = hasStarted && characterCount < text.length

  return (
    <span className={`relative block w-fit ${className}`}>
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span className="absolute inset-0 whitespace-nowrap" aria-hidden="true">
        {text.slice(0, characterCount)}
        {isTyping && (
          <span className="ml-0.5 inline-block h-[0.82em] w-[3px] animate-pulse rounded-full bg-current align-[-0.04em]" />
        )}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  )
}

export default TypewriterText

