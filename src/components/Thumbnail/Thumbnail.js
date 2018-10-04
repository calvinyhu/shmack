import React from 'react';
import Reveal from 'react-reveal/Reveal';

import classes from './Thumbnail.css';

const thumbnail = props => {
  return (
    <Reveal effect={classes.BlockSlideFadeIn}>
      <div className={classes.Thumbnail} onClick={props.click}>
        <div className={classes.ThumbnailImgContainer}>
          <img src={props.img} alt="Thumbnail" />
        </div>
        <div className={classes.ThumbnailInfo}>{props.children}</div>
      </div>
    </Reveal>
  );
};

export default thumbnail;
