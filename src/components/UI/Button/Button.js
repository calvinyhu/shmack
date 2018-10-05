import React, { PureComponent } from 'react';

import classes from './Button.css';

class Button extends PureComponent {
  state = {
    isMouse: false,
    isTouch: false
  };

  handleTouchStart = () => this.setState({ isTouch: true });

  handleTouchEnd = event => {
    event.preventDefault();
    this.setState({ isTouch: false });
    if (this.props.click) this.props.click();
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

    if (this.state.isTouch && this.props.main)
      buttonClasses += ' ' + classes.MainTouchHover;

    if (this.state.isMouse && this.props.main)
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
