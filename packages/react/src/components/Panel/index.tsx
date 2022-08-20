import React, { HTMLAttributes, ReactNode, forwardRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import rndid from '../../utils/rndid'

interface PanelProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  heading?:
    | ReactNode
    | {
        id?: string
        text: ReactNode
        level: number | undefined
      }
  collapsed?: boolean
  className?: string
}

const Panel = forwardRef<HTMLElement, PanelProps>(
  ({ children, collapsed, className, heading, ...other }: PanelProps, ref) => {
    const headingId = !heading
      ? undefined
      : typeof heading === 'object' && 'id' in heading
      ? heading.id
      : rndid()

    const Heading = () => {
      if (!headingId) {
        return null
      }

      const HeadingComponent = `h${
        heading &&
        typeof heading === 'object' &&
        'level' in heading &&
        !!heading.level
          ? heading.level
          : 2
      }` as 'h1'

      return (
        <HeadingComponent id={headingId} className="Panel__Heading">
          {heading && typeof heading === 'object' && 'text' in heading
            ? heading.text
            : heading}
        </HeadingComponent>
      )
    }

    return (
      <section
        aria-labelledby={headingId}
        className={classNames('Panel', className, {
          ['Panel--collapsed']: collapsed
        })}
        ref={ref}
        {...other}
      >
        <Heading />
        {children}
      </section>
    )
  }
)

Panel.displayName = 'Panel'
Panel.propTypes = {
  children: PropTypes.node.isRequired,
  heading: PropTypes.oneOfType([PropTypes.object, PropTypes.node]),
  className: PropTypes.string
}

export default Panel
