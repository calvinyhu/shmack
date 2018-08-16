import React from 'react'

const navigationItem = (props) => (
    <li className={props.className}>
        <a href='/'>{props.name}</a>
    </li>
)

export default navigationItem
