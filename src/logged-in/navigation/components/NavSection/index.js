import React, { useState } from 'react'
import NavItem from '../NavItem'
import styles from './style.module.css'

const NavSection = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(section?.expanded || false)
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }
  
  // If section has no subsections, render as simple nav item
  if (!section?.sections) {
    return (
      <NavItem
        icon={section?.icon}
        label={section?.label}
        path={section?.path}
        badge={section?.badge}
      />
    )
  }
  
  // If section has subsections, render as expandable group
  return (
    <div className={styles.navSection}>
      <NavItem
        icon={section?.icon}
        label={section?.label}
        badge={section?.badge}
        onClick={handleToggle}
        hasSubItems={true}
        isExpanded={isExpanded}
      />
      
      {isExpanded && section?.sections && (
        <div className={styles.navSectionItems}>
          {section.sections.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              path={item.path}
              badge={item.badge}
              isSubItem={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default NavSection


