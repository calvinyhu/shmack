import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavItem.css';
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
    let navItemClasses = classes.NavItem;

    if (this.props.main) navItemClasses += ' ' + classes.Main;
    if (this.props.borderMain) navItemClasses += ' ' + classes.BorderMain;

    if (this.state.isTouch) {
      if (this.props.main) navItemClasses += ' ' + classes.MainTouchHover;
      this.isTouched = true;
    }

    if (!this.isTouched && this.state.isMouse) {
      if (this.props.main) navItemClasses += ' ' + classes.MainMouseHover;
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
