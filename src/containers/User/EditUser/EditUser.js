import React from 'react'

import classes from './EditUser.css'

const EditUser = (props) => {
    return (
        <div className={classes.UserInfo}>
            <form onSubmit={props.submit}>
                <input
                    type='text'
                    name='firstName'
                    placeholder='First Name'
                    value={props.firstName}
                    onChange={props.changeHandler} />
                <input
                    type='text'
                    name='lastName'
                    placeholder='Last Name'
                    value={props.lastName}
                    onChange={props.changeHandler} />
                <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    value={props.email}
                    onChange={props.changeHandler} />
                <input
                    type='text'
                    name='location'
                    placeholder='Location'
                    value={props.location}
                    onChange={props.changeHandler} />
                <button>Save</button>
            </form>
            <button onClick={props.cancel}>Cancel</button>
        </div>
    )
}

export default EditUser
