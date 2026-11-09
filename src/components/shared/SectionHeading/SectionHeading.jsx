const toneStyles = {
  light: {
    title: 'text-slate-950',
    description: 'text-slate-600',
  },
  dark: {
    title: 'text-white',
    description: 'text-slate-300',
  },
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
  className = '',
}) {
  const alignment =
    align === 'left' ? 'items-start text-left' : 'items-center text-center'
  const colors = toneStyles[tone] ?? toneStyles.light

  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 max-w-2xl text-3xl font-bold tracking-[-0.035em] sm:text-4xl ${colors.title}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 max-w-2xl text-base leading-7 ${colors.description}`}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeading

