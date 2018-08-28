import React from 'react'

import classes from './Input.css'

const input = (props) => {
    let classNames = classes.Input

    if (props.wide)
        classNames = [classNames, classes.Wide].join(' ')
    if (props.center)
        classNames = [classNames, classes.TextCenter].join(' ')

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
