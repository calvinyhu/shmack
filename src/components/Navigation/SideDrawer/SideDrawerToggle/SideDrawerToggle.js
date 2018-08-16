import React from 'react'

import classes from './SideDrawerToggle.css'

const sideDrawerToggle = (props) => {
    let bar1 = classes.Bar1;
    let bar2 = classes.Bar2;
    let bar3 = classes.Bar3;

    return (
        <div className={classes.SideDrawerToggle} onClick={props.toggleSideDrawer}>
            <div className={bar1}></div>
            <div className={bar2}></div>
            <div className={bar3}></div>
        </div>
    )
}

export default sideDrawerToggle