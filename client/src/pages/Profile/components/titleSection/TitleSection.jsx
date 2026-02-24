import './TitleSection.css'

export const TitleSection = ({ title, subtitle, buttonText }) => {
  return (
    <div className="title-section">
      <div className="title-left">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="title-right">
        <button className="btn-nuevo">
          <span style={{ fontSize: "18px" }}>+</span>
          {buttonText}
        </button>
      </div>
    </div>
  )
}
