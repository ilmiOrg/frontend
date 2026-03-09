import React, { useRef, useEffect } from 'react'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import 'overlayscrollbars/overlayscrollbars.css'
import styles from './style.module.css'

function buildClassName(parts) {
  return parts.filter(Boolean).join(' ')
}

function ScrollContainerRender(
  {
    children,
    className,
    style,
    scrollbarsRef,
    disableHorizontalScroll = false,
    disableVerticalScroll = false,
    ...rest
  },
  containerRef
) {
  const osRef = useRef(null)

  useEffect(() => {
    if (!osRef.current || !scrollbarsRef) return
    const osInstance = osRef.current.osInstance()
    if (!osInstance) return
    const { viewport } = osInstance.elements()
    if (!viewport) return
    scrollbarsRef.current = {
      osInstance,
      view: viewport,
      scrollTop: (top) => { viewport.scrollTop = top },
      scrollLeft: (left) => { viewport.scrollLeft = left },
      container: viewport
    }
    return () => { scrollbarsRef.current = null }
  }, [scrollbarsRef])

  const containerClassName = buildClassName([
    styles.scrollContainer,
    className,
    disableHorizontalScroll && styles.disableHorizontalScroll,
    disableVerticalScroll && styles.disableVerticalScroll
  ])

  const osOptions = {
    scrollbars: {
      autoHide: 'never',
      theme: 'os-theme-custom-blue'
    },
    overflow: {
      x: disableHorizontalScroll ? 'hidden' : 'scroll',
      y: disableVerticalScroll ? 'hidden' : 'scroll'
    }
  }

  return (
    <OverlayScrollbarsComponent
      ref={osRef}
      className={containerClassName}
      style={style}
      options={osOptions}
      {...rest}
    >
      {children}
    </OverlayScrollbarsComponent>
  )
}

export const ScrollContainer = React.forwardRef(ScrollContainerRender)
