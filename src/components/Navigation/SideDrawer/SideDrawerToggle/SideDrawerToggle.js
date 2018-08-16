import React from 'react'

import classes from './SideDrawerToggle.css'

const sideDrawerToggle = (props) => {
    let bar1 = [classes.Bar1]
    let bar2 = [classes.Bar2]
    let bar3 = [classes.Bar3]

    if (props.showSideDrawer) {
        bar1.push(classes.AnimateBar1)
        bar2.push(classes.AnimateBar2)
        bar3.push(classes.AnimateBar3)
    }

    return (
        <div className={classes.SideDrawerToggle} onClick={props.toggleSideDrawer}>
            <div className={bar1.join(' ')}></div>
            <div className={bar2.join(' ')}></div>
            <div className={bar3.join(' ')}></div>
        </div>
    )
}

export default sideDrawerToggle
