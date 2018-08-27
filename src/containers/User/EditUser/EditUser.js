import React from 'react'

import classes from './EditUser.css'
import * as db from '../../../utilities/database'
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

const EditUser = (props) => {
    const inputs = (
        <Auxiliary>
            <input
                type='text'
                name={db.FIRST_NAME}
                placeholder='First Name'
                value={props.values[db.FIRST_NAME]}
                onChange={props.change} />
            <input
                type='text'
                name={db.LAST_NAME}
                placeholder='Last Name'
                value={props.values[db.LAST_NAME]}
                onChange={props.change} />
            <input
                type='email'
                name={db.EMAIL}
                placeholder='Email'
                value={props.values[db.EMAIL]}
                onChange={props.change} />
            <input
                type='text'
                name={db.LOCATION}
                placeholder='Location'
                value={props.values[db.LOCATION]}
                onChange={props.change} />
        </Auxiliary>
    )
    return (
        <div className={classes.UserInfo}>
            <form onSubmit={props.submit}>
                {inputs}
                <button>Save</button>
            </form>
            <button onClick={props.cancel}>Go back to profile</button>
        </div>
    )
}

export default EditUser
