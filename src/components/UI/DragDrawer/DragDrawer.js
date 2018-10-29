import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import throttle from 'raf-throttle';

import styles from './DragDrawer.module.scss';

class DragDrawer extends Component {
  static propTypes = {
    children: PropTypes.element
  };

  constructor(props) {
    super(props);
    this.drawerRef = React.createRef();
  }

  render() {
    const style = { transform: `translateX(${this.props.offsetX}px)` };
    if (this.props.offsetX === null) style.transform = 'translateX(-100%)';

    return (
      <div
        ref={this.drawerRef}
        style={style}
        className={styles.DragDrawer}
        onTouchStart={this.props.touchStart}
        onTouchMove={this.props.touchMove}
        onTouchEnd={this.props.touchEnd}
      >
        {this.props.children}
        <div className={styles.TouchBar} />
      </div>
    );
  }
}

export default DragDrawer;
