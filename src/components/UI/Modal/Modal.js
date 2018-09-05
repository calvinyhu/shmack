import React from 'react'

import classes from './Modal.css'
import Aux from '../../../hoc/Auxiliary/Auxiliary'
import Button from '../Button/Button'
import Backdrop from '../Backdrop/Backdrop'

const modal = (props) => {
    let modalClasses = classes.Modal

    if (props.isOpen)
        modalClasses += ' ' + classes.OpenModal
    else
        modalClasses += ' ' + classes.CloseModal

    return (
        <Aux>
            <div className={modalClasses}>
                <p>{props.children}</p>
                <Button wide click={props.click}>{props.btnMsg}</Button>
            </div>
            <Backdrop isOpen={props.isOpen} click={props.close}/>
        </Aux>
    )
}

export default modal
