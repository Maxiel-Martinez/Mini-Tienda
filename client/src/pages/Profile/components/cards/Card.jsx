export const Card = ({ title, value, subtitle }) => {
  return (
      <div className="stat-card">
        <div className="stat-card-header">
            <span className="stat-card-title">{title}</span>
            <div className="stat-icon dark-blue">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
            </div>
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-change positive">
            <span>{subtitle}</span>
        </div>
    </div>
  )
}
