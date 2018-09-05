import React from 'react'

import classes from './Backdrop.css'

const backdrop = (props) => {
    let backdropClasses = classes.Backdrop

    if (props.isOpen)
        backdropClasses += ' ' + classes.OpenBackdrop
    else
        backdropClasses += ' ' + classes.CloseBackdrop

    return <div className={backdropClasses} onClick={props.click}></div>
}

export default backdrop
