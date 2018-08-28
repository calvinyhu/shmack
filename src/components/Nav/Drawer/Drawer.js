import React from 'react'

import classes from './Drawer.css'

const drawer = (props) => {
    let classNames = classes.TopDrawer

    if (props.isOpen)
        classNames = [classNames, classes.OpenTopDrawer].join(' ')
    else
        classNames = [classes.TopDrawer, classes.CloseTopDrawer].join(' ')

    return (
        <div className={classNames}>
            {props.children}
        </div>
    )
}

export default drawer
