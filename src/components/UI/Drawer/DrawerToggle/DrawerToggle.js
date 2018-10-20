import React from 'react';

import styles from './DrawerToggle.module.scss';

const drawerToggle = props => {
  let bar1 = [styles.Bar, styles.Position1];
  let bar2 = [styles.Bar, styles.Position2];
  let bar3 = [styles.Bar, styles.Position3];
  let bar4 = [styles.Bar, styles.Position4];

  if (props.showDrawer) {
    bar1.push(styles.AnimateBar1);
    bar2.push(styles.AnimateBar2);
    bar3.push(styles.AnimateBar3);
    bar4.push(styles.AnimateBar4);
  }

  return (
    <div className={styles.DrawerToggle} onClick={props.toggleDrawer}>
      <div className={bar1.join(' ')} />
      <div className={bar2.join(' ')} />
      <div className={bar3.join(' ')} />
      <div className={bar4.join(' ')} />
    </div>
  );
};

export default drawerToggle;
