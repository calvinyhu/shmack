import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './DragDrawer.module.scss';

class DragDrawer extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    maxOffsetX: PropTypes.number.isRequired,
    offsetX: PropTypes.number,
    close: PropTypes.func.isRequired,
    touchStart: PropTypes.func.isRequired,
    touchMove: PropTypes.func.isRequired,
    touchEnd: PropTypes.func.isRequired,
    children: PropTypes.element
  };

  constructor(props) {
    super(props);
    this.drawerRef = React.createRef();
  }

  handleClick = () => {
    if (this.props.isOpen) this.props.close();
  };

  render() {
    const style = { transform: `translateX(${this.props.offsetX}px)` };

    if (this.props.offsetX === null) style.transform = 'translateX(-100%)';
    else if (
      this.props.offsetX === 0 ||
      this.props.offsetX === this.props.maxOffsetX
    )
      style.transition = `0.5s cubic-bezier(0.26, 0.94, 0.58, 1)`;

    const touchBarClasses = classnames({
      [styles.TouchBar]: true,
      [styles.ExpandTouchBar]: this.props.isOpen
    });
    let touchBar = (
      <div className={touchBarClasses} onClick={this.handleClick} />
    );

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
        {touchBar}
      </div>
    );
  }
}

export default DragDrawer;
