import React from 'react'

import classes from './EditUser.css'
import { FIELDS } from '../../../utilities/database'
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../../components/UI/Button/Button'
import Input from '../../../components/UI/Input/Input'

const EditUser = (props) => {
    let inputs = null
    
    if (props.values) {
        inputs = (
            <Aux>
                <Input
                    wide
                    type='text'
                    name={FIELDS.FIRST_NAME}
                    placeholder='First Name'
                    value={props.values[FIELDS.FIRST_NAME]}
                    change={props.change} />
                <Input
                    wide
                    type='text'
                    name={FIELDS.LAST_NAME}
                    placeholder='Last Name'
                    value={props.values[FIELDS.LAST_NAME]}
                    change={props.change} />
                <Input
                    wide
                    type='text'
                    name={FIELDS.LOCATION}
                    placeholder='Location'
                    value={props.values[FIELDS.LOCATION]}
                    change={props.change} />
            </Aux>
        )
    }

    return (
        <div className={classes.UserInfo}>
            <form onSubmit={props.submit}>
                {inputs}
                <Button wide>Save</Button>
                {props.children}
            </form>
            <Button placeholderLink click={props.back}>Back to profile</Button>
        </div>
    )
}

export default EditUser
