import React from 'react'

import classes from './DrawerToggle.css'

const drawerToggle = (props) => {
    let bar1 = [classes.Bar, classes.Position1]
    let bar2 = [classes.Bar, classes.Position2]
    let bar3 = [classes.Bar, classes.Position3]
    let bar4 = [classes.Bar, classes.Position4]

    if (props.showDrawer) {
        bar1.push(classes.AnimateBar1)
        bar2.push(classes.AnimateBar2)
        bar3.push(classes.AnimateBar3)
        bar4.push(classes.AnimateBar4)
    }

    return (
        <div className={classes.DrawerToggle} onClick={props.toggleDrawer}>
            <div className={bar1.join(' ')}></div>
            <div className={bar2.join(' ')}></div>
            <div className={bar3.join(' ')}></div>
            <div className={bar4.join(' ')}></div>
        </div>
    )
}

export default drawerToggle
