import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './NavItem.module.scss';
import Button from '../Button';

class NavItem extends Button {
  static propTypes = {
    link: PropTypes.bool,
    borderMain: PropTypes.bool,
    bold: PropTypes.bool,
    clear: PropTypes.bool,
    to: PropTypes.string.isRequired,
    click: PropTypes.func.isRequired,
    children: PropTypes.any
  };

  handleTouchEnd = event => {
    const touch = event.changedTouches[0];
    const withinX =
      touch.clientX <= this.touchBounds.right &&
      touch.clientX >= this.touchBounds.left;
    const withinY =
      touch.clientY <= this.touchBounds.bot &&
      touch.clientY >= this.touchBounds.top;

    if (this.props.click && withinX && withinY) this.props.click();

    this.setState({ isTouch: false });
  };

  render() {
    if (this.state.isTouch) this.isTouched = true;

    const navItemClasses = classnames({
      [styles.NavItem]: true,
      [styles.Link]: this.props.link,
      [styles.Clear]: this.props.clear,
      [styles.BorderMain]: this.props.borderMain,
      [styles.Bold]: this.props.bold,
      [styles.ClearTouchHover]: this.state.isTouch && this.props.clear,
      [styles.LinkTouchHover]: this.state.isTouch && this.props.link,
      [styles.ClearMouseHover]:
        !this.isTouched && this.state.isMouse && this.props.clear,
      [styles.LinkMouseHover]:
        !this.isTouched && this.state.isMouse && this.props.link
    });

    return (
      <NavLink
        className={navItemClasses}
        to={this.props.to}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.props.click}
      >
        {this.props.children}
      </NavLink>
    );
  }
}

export default NavItem;
