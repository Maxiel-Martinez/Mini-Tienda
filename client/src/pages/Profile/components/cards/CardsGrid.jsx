import { Card } from './Card'
import './Cards.css'
export const CardsGrid = (props) => {
  const {arrayCards} = props
  return (
    <div className="stats-grid">
      {arrayCards.map((card, index) => (
        <Card key={index} title={card.title} value={card.value} subtitle={card.subtitle} />
      ))}
    </div>
  )
}
