import React from 'react'

import classes from './Fab.css'
import { MAT_ICONS } from '../../../utilities/styles'
import Button from '../Button/Button'

const fab = (props) => {
    let fabClasses = classes.Fab

    if (props.isOpen)
        fabClasses += ' ' + classes.OpenFab
    else
        fabClasses += ' ' + classes.CloseFab

    if (props.action)
        fabClasses += ' ' + classes.ActionFab

    return (
        <div className={fabClasses} onClick={props.click}>
            <Button circle mini={props.mini} secondaryColor={props.secondaryColor}>
                <div className={MAT_ICONS}>{props.children}</div>
            </Button>
        </div>
    )
}

export default fab
