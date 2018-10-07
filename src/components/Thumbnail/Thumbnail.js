import React from 'react';
import Fade from 'react-reveal/Fade';

import classes from './Thumbnail.css';

const thumbnail = props => {
  return (
    <Fade>
      <div className={classes.Thumbnail} onClick={props.click}>
        <div className={classes.ThumbnailImgContainer}>
          <img src={props.img} alt="Thumbnail" />
        </div>
        <div className={classes.ThumbnailInfo}>{props.children}</div>
      </div>
    </Fade>
  );
};

export default thumbnail;
