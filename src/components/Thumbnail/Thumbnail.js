import React from 'react';

import classes from './Thumbnail.css';

const thumbnail = props => {
  return (
    <div className={classes.Thumbnail} onClick={props.click}>
      <div className={classes.ThumbnailImgContainer}>
        <img src={props.img} alt="Thumbnail" />
      </div>
      <div className={classes.ThumbnailInfo}>{props.children}</div>
    </div>
  );
};

export default thumbnail;
