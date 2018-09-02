import React from 'react'

import classes from './Input.css'

const input = (props) => {
    let classNames = classes.Input

    if (props.wide)
        classNames = [classNames, classes.Wide].join(' ')
    if (props.thin)
        classNames = [classNames, classes.Thin].join(' ')
    if (props.transparent)
        classNames = [classNames, classes.Transparent].join(' ')
    if (props.center)
        classNames = [classNames, classes.TextCenter].join(' ')
    if (props.onMain)
        classNames = [classNames, classes.OnMain].join(' ')
    if (props.onOppAdj)
        classNames = [classNames, classes.OnOppAdj].join(' ')

    return (
        <input
            className={classNames}
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.change} />
    )
}

export default input
