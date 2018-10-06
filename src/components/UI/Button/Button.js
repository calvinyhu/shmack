import React, { Component, PureComponent } from 'react';

import classes from './Button.css';

class Button extends PureComponent {
  isTouched = false;
  touchBounds = { top: 0, bot: 0, left: 0, right: 0 };

  state = {
    isMouse: false,
    isTouch: false
  };

  handleTouchStart = event => {
    const rect = event.target.getBoundingClientRect();
    this.touchBounds.top = rect.top;
    this.touchBounds.bot = rect.bottom;
    this.touchBounds.left = rect.left;
    this.touchBounds.right = rect.right;

    this.setState({ isTouch: true });
  };

  handleTouchEnd = event => {
    if (event && event.cancelable) event.preventDefault();

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

  handleMouseEnter = () => this.setState({ isMouse: true });
  handleMouseLeave = () => this.setState({ isMouse: false });

  render() {
    let buttonClasses = classes.Button;

    if (this.props.link) buttonClasses = classes.PlaceholderLink;
    if (this.props.small) buttonClasses += ' ' + classes.Small;
    if (this.props.circle) buttonClasses += ' ' + classes.Circle;
    if (this.props.main) buttonClasses += ' ' + classes.Main;
    if (this.props.clear) buttonClasses += ' ' + classes.Clear;
    if (this.props.translucent) buttonClasses += ' ' + classes.Translucent;

    // Hover effects
    if (this.state.isTouch && this.props.main) {
      buttonClasses += ' ' + classes.MainTouchHover;
      this.isTouched = true;
    }

    if (!this.isTouched && this.state.isMouse && this.props.main)
      buttonClasses += ' ' + classes.MainMouseHover;

    return (
      <button
        className={buttonClasses}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.props.click}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
