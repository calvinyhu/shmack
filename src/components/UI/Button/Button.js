import React from 'react'

import classes from './Button.css'

const button = (props) => {
    let classNames = classes.Button

    if (props.link)
        classNames = classes.PlaceholderLink

    if (props.wide)
        classNames += ' ' + classes.Wide

    if (props.thin)
        classNames += ' ' + classes.Thin

    if (props.circle)
        classNames += ' ' + classes.Circle
        
    if (props.onMain)
        classNames += ' ' + classes.OnMain

    if (props.secondaryColor)
        classNames += ' ' + classes.SecondaryColor
    
    if (props.mini)
        classNames += ' ' + classes.Mini

    return (
        <button
            className={classNames}
            onClick={props.click}>{props.children}
        </button>
    )
}

export default button
