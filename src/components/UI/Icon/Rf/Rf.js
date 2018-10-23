import React from 'react';
import ArrowLeft from 'react-feather/dist/icons/arrow-left';
import Dollar from 'react-feather/dist/icons/dollar-sign';
import Filter from 'react-feather/dist/icons/filter';
import Home from 'react-feather/dist/icons/home';
import Info from 'react-feather/dist/icons/info';
import Logout from 'react-feather/dist/icons/log-out';
import Menu from 'react-feather/dist/icons/menu';
import Nav from 'react-feather/dist/icons/navigation';
import Phone from 'react-feather/dist/icons/smartphone';
import Plus from 'react-feather/dist/icons/plus';
import Refresh from 'react-feather/dist/icons/refresh-cw';
import Search from 'react-feather/dist/icons/search';
import Sliders from 'react-feather/dist/icons/sliders';
import ThumbsDown from 'react-feather/dist/icons/thumbs-down';
import ThumbsUp from 'react-feather/dist/icons/thumbs-up';

import styles from './Rf.module.scss';

const Rf = props => {
  let iconClasses = styles.Icon;

  if (props.white) iconClasses += ' ' + styles.White;
  if (props.darkMain) iconClasses += ' ' + styles.DarkMain;

  switch (props.children) {
    case 'arrow-left':
      return <ArrowLeft className={iconClasses} />;
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
    case 'menu':
      return <Menu className={iconClasses} />;
    case 'nav':
      return <Nav className={iconClasses} />;
    case 'phone':
      return <Phone className={iconClasses} />;
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
    default:
      return null;
  }
};

export default Rf;
