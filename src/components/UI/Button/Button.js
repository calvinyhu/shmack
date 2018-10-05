import React, { PureComponent } from 'react';

import classes from './Button.css';

class Button extends PureComponent {
  touchPos = { x: 0, y: 0 };
  touchBounds = { top: 0, bot: 0, left: 0, right: 0 };

  state = {
    isMouse: false,
    isTouch: false
  };

  handleTouchStart = event => {
    const touch = event.changedTouches[0];
    this.touchPos.x = touch.clientX;
    this.touchPos.y = touch.clientY;

    // const targetHeight = event.target.clientHeight;
    // const targetWidth = event.target.clientWidth;
    // this.touchBounds.top = this.touchPos.y + targetHeight;
    // this.touchBounds.bot = this.touchPos.y - targetHeight;
    // this.touchBounds.left = this.touchPos.x - targetWidth;
    // this.touchBounds.right = this.touchPos.x + targetWidth;

    this.setState({ isTouch: true });
  };

  handleTouchEnd = event => {
    if (event && event.cancelable) event.preventDefault();

    const touch = event.changedTouches[0];
    // const withinX =
    //   touch.clientX <= this.touchBounds.right &&
    //   touch.clientX >= this.touchBounds.left;
    // const withinY =
    //   touch.clientY <= this.touchBounds.top &&
    //   touch.clientY >= this.touchBounds.bot;
    const samePos =
      touch.clientX === this.touchPos.x && touch.clientY === this.touchPos.y;

    if (this.props.click && samePos) this.props.click();

    this.setState({ isTouch: false });
  };

  handleMouseEnter = () => {
    console.log('handleMouseEnter');
    this.setState({ isMouse: true });
  };

  handleMouseLeave = () => {
    console.log('handleMouseLeave');
    this.setState({ isMouse: false });
  };

  render() {
    let buttonClasses = classes.Button;

    if (this.props.link) buttonClasses = classes.PlaceholderLink;
    if (this.props.small) buttonClasses += ' ' + classes.Small;
    if (this.props.circle) buttonClasses += ' ' + classes.Circle;
    if (this.props.main) buttonClasses += ' ' + classes.Main;
    if (this.props.clear) buttonClasses += ' ' + classes.Clear;
    if (this.props.translucent) buttonClasses += ' ' + classes.Translucent;

    // Hover effects
    if (this.state.isTouch && this.props.main)
      buttonClasses += ' ' + classes.MainTouchHover;

    if (this.state.isMouse && this.props.main)
      buttonClasses += ' ' + classes.MainMouseHover;

    return (
      <button
        className={buttonClasses}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        // onMouseEnter={this.handleMouseEnter}
        // onMouseLeave={this.handleMouseLeave}
        onClick={this.props.click}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
