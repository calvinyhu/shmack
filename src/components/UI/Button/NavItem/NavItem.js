import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './NavItem.module.scss';
import Button from '../Button';

class NavItem extends Button {
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
    let navItemClasses = styles.NavItem;

    if (this.props.link) navItemClasses += ' ' + styles.Link;
    if (this.props.main) navItemClasses += ' ' + styles.Main;
    if (this.props.borderMain) navItemClasses += ' ' + styles.BorderMain;

    if (this.state.isTouch) {
      if (this.props.main) navItemClasses += ' ' + styles.MainTouchHover;
      if (this.props.link) navItemClasses += ' ' + styles.LinkTouchHover;
      this.isTouched = true;
    }

    if (!this.isTouched && this.state.isMouse) {
      if (this.props.main) navItemClasses += ' ' + styles.MainMouseHover;
      if (this.props.link) navItemClasses += ' ' + styles.LinkMouseHover;
    }

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
