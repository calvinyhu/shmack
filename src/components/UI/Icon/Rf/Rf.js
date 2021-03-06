import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ArrowLeft from 'react-feather/dist/icons/arrow-left';
import Check from 'react-feather/dist/icons/check';
import CheckCircle from 'react-feather/dist/icons/check-circle';
import Dollar from 'react-feather/dist/icons/dollar-sign';
import Filter from 'react-feather/dist/icons/filter';
import Home from 'react-feather/dist/icons/home';
import Info from 'react-feather/dist/icons/info';
import Logout from 'react-feather/dist/icons/log-out';
import MapPin from 'react-feather/dist/icons/map-pin';
import Menu from 'react-feather/dist/icons/menu';
import Nav from 'react-feather/dist/icons/navigation';
import Smartphone from 'react-feather/dist/icons/smartphone';
import Plus from 'react-feather/dist/icons/plus';
import Refresh from 'react-feather/dist/icons/refresh-cw';
import Search from 'react-feather/dist/icons/search';
import Sliders from 'react-feather/dist/icons/sliders';
import ThumbsDown from 'react-feather/dist/icons/thumbs-down';
import ThumbsUp from 'react-feather/dist/icons/thumbs-up';
import User from 'react-feather/dist/icons/user';
import X from 'react-feather/dist/icons/x';

import styles from './Rf.module.scss';

const Rf = props => {
  Rf.propTypes = {
    white: PropTypes.bool,
    darkMain: PropTypes.bool,
    children: PropTypes.string.isRequired
  };

  const iconClasses = classnames({
    [styles.Icon]: true,
    [styles.Sm]: props.sm,
    [styles.Lg]: props.lg,
    [styles.White]: props.white,
    [styles.DarkMain]: props.darkMain,
    [styles.DarkerMain]: props.darkerMain
  });

  switch (props.children) {
    case 'arrow-left':
      return <ArrowLeft className={iconClasses} />;
    case 'check':
      return <Check className={iconClasses} />;
    case 'check-circle':
      return <CheckCircle className={iconClasses} />;
    case 'dollar-sign':
      return <Dollar className={iconClasses} />;
    case 'filter':
      return <Filter className={iconClasses} />;
    case 'home':
      return <Home className={iconClasses} />;
    case 'info':
      return <Info className={iconClasses} />;
    case 'logout':
      return <Logout className={iconClasses} />;
    case 'map-pin':
      return <MapPin className={iconClasses} />;
    case 'menu':
      return <Menu className={iconClasses} />;
    case 'nav':
      return <Nav className={iconClasses} />;
    case 'smartphone':
      return <Smartphone className={iconClasses} />;
    case 'plus':
      return <Plus className={iconClasses} />;
    case 'refresh':
      return <Refresh className={iconClasses} />;
    case 'search':
      return <Search className={iconClasses} />;
    case 'sliders':
      return <Sliders className={iconClasses} />;
    case 'thumbs-down':
      return <ThumbsDown className={iconClasses} />;
    case 'thumbs-up':
      return <ThumbsUp className={iconClasses} />;
    case 'user':
      return <User className={iconClasses} />;
    case 'x':
      return <X className={iconClasses} />;
    default:
      return null;
  }
};

export default Rf;
