import React from 'react'
import ThreeColumnGrid from '../../layout/ThreeColumnGrid'
import Card from '../../../core/ui/molecules/Card'
import MainNav from '../../navigation/components/MainNav'

const PlaceholderPage = ({ 
  icon = '🏗️', 
  title = 'Coming Soon', 
  description = 'This feature is under construction. Please check back later!' 
}) => {
  const middleContent = (
    <div className="placeholder-content">
      <Card variant="elevated" padding="xl">
        <div className="placeholder-icon">{icon}</div>
        <h1 className="placeholder-title">{title}</h1>
        <p className="placeholder-description">{description}</p>
      </Card>
    </div>
  )

  return (
    <ThreeColumnGrid
      leftColumn={<MainNav />}
      middleColumn={middleContent}
      rightColumn={null}
    />
  )
}

export default PlaceholderPage