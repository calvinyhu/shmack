import React from 'react'

import classes from './Button.css'

const button = (props) => {
    let classNames = classes.Button

    if (props.link)
        classNames = classes.PlaceholderLink
    
    if (props.className)
        classNames = props.className

    if (props.wide)
        classNames = [classNames, classes.Wide].join(' ')

    if (props.thin)
        classNames = [classNames, classes.Thin].join(' ')

    if (props.circle)
        classNames = [classNames, classes.Circle].join(' ')
        
    if (props.onMain)
        classNames = [classNames, classes.OnMain].join(' ')

    return (
        <button
            className={classNames}
            onClick={props.click}>{props.children}
        </button>
    )
}

export default button
