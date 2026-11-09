const variants = {
  primary:
    'bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:ring-emerald-700',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400',
}

const sizes = {
  small: 'min-h-9 px-4 py-2 text-sm',
  medium: 'min-h-11 px-5 py-2.5 text-sm',
  icon: 'size-11 p-0',
}

function Button({
  as: Component = 'button',
  children,
  className = '',
  disabled = false,
  fullWidth = false,
  isLoading = false,
  onClick,
  size = 'medium',
  type,
  variant = 'primary',
  ...props
}) {
  const isDisabled = disabled || isLoading
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.medium,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault()
      return
    }

    onClick?.(event)
  }

  return (
    <Component
      className={classes}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-disabled={Component !== 'button' && isDisabled ? true : undefined}
      aria-busy={isLoading || undefined}
      onClick={Component === 'button' ? onClick : handleClick}
      type={Component === 'button' ? (type ?? 'button') : undefined}
      {...props}
    >
      {isLoading && (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </Component>
  )
}

export default Button

