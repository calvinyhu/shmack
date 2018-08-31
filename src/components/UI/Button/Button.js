import React from 'react'

import classes from './Button.css'

const button = (props) => {
    let classNames = classes.Button

    if (props.placeholderLink)
        classNames = classes.PlaceholderLink
    
    if (props.className)
        classNames = props.className

    if (props.wide)
        classNames = [classNames, classes.Wide].join(' ')

    if (props.circle)
        classNames = [classNames, classes.Circle].join(' ')

    return (
        <button
            className={classNames}
            onClick={props.click}>{props.children}
        </button>
    )
}

export default button
