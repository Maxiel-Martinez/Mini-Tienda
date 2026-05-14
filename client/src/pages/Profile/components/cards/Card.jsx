const DEFAULT_ICON = (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
)

export const Card = ({
  title,
  value,
  subtitle,
  trend,
  comparison,
  icon = DEFAULT_ICON,
  iconClassName = 'dark-blue',
  trendClassName = 'positive',
  accentClassName = '',
  cardClassName = '',
}) => {
  return (
      <div className={`stat-card ${cardClassName}`.trim()}>
        <div className="stat-card-header">
            <span className="stat-card-title">{title}</span>
            <div className={`stat-icon ${iconClassName}`.trim()}>
                {icon}
            </div>
        </div>
        <div className={`stat-value ${accentClassName}`.trim()}>{value}</div>
        <div className={`stat-change ${trendClassName}`.trim()}>
            <span>{trend ?? subtitle}</span>
            {comparison ? <span>{comparison}</span> : null}
        </div>
    </div>
  )
}
