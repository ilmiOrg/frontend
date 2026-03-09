import React, { Suspense, lazy } from 'react'
import styles from './style.module.css'

const Spline = lazy(() => import('@splinetool/react-spline'))

/**
 * @param {Object} props
 * @param {string} props.scene - Spline scene URL
 * @param {string} [props.className]
 * @param {(app: import('@splinetool/runtime').Application) => void} [props.onLoad] - Called when scene loads; use to move objects etc.
 * @param {number} [props.nudgeRobotRight] - Add this to the robot's position.x (moves it right). Canvas stays full width.
 * @param {string[]} [props.robotObjectNames] - Object names to try when nudging (default: ['Robot', 'Character', 'Agent'])
 */
export function SplineScene({ scene, className = '', onLoad, nudgeRobotRight, robotObjectNames = ['Robot', 'Character', 'Agent'] }) {
  const handleLoad = React.useCallback(
    (app) => {
      if (nudgeRobotRight != null && nudgeRobotRight !== 0) {
        const names = robotObjectNames.length ? robotObjectNames : ['Robot', 'Character', 'Agent']
        let nudged = false
        for (const name of names) {
          const obj = app.findObjectByName(name)
          if (obj && obj.position) {
            obj.position.x += nudgeRobotRight
            nudged = true
            break
          }
        }
        const all = app.getAllObjects?.() || []
        if (!nudged && all.length) {
          const lowerNames = names.map((n) => n.toLowerCase())
          for (const obj of all) {
            if (obj && obj.position && obj.name) {
              const match = lowerNames.some((n) => obj.name.toLowerCase().includes(n))
              if (match) {
                obj.position.x += nudgeRobotRight
                nudged = true
                break
              }
            }
          }
        }
        if (!nudged && all.length) {
          for (const obj of all) {
            if (obj && obj.position) {
              obj.position.x += nudgeRobotRight
            }
          }
        }
        if (typeof app.requestRender === 'function') {
          app.requestRender()
        }
      }
      onLoad?.(app)
    },
    [nudgeRobotRight, robotObjectNames, onLoad]
  )

  return (
    <Suspense
      fallback={
        <div className={styles.fallback}>
          <span className={styles.loader} />
        </div>
      }
    >
      <Spline scene={scene} className={className || styles.spline} onLoad={handleLoad} />
    </Suspense>
  )
}
