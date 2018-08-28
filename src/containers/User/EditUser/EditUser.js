import React from 'react'

import classes from './EditUser.css'
import * as db from '../../../utilities/database'
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
                    name={db.FIRST_NAME}
                    placeholder='First Name'
                    value={props.values[db.FIRST_NAME]}
                    change={props.change} />
                <Input
                    wide
                    type='text'
                    name={db.LAST_NAME}
                    placeholder='Last Name'
                    value={props.values[db.LAST_NAME]}
                    change={props.change} />
                <Input
                    wide
                    type='text'
                    name={db.LOCATION}
                    placeholder='Location'
                    value={props.values[db.LOCATION]}
                    change={props.change} />
            </Aux>
        )
    }

    return (
        <div className={classes.UserInfo}>
            <form onSubmit={props.submit}>
                {inputs}
                <Button wide>Save</Button>
            </form>
            <Button placeholderLink click={props.cancel}>Back to profile</Button>
        </div>
    )
}

export default EditUser
