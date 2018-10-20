import React from 'react';
import Fade from 'react-reveal/Fade';

import styles from './Thumbnail.module.scss';

const thumbnail = props => {
  return (
    <Fade>
      <div className={styles.Thumbnail} onClick={props.click}>
        <div className={styles.ThumbnailImgContainer}>
          <img src={props.img} alt="Thumbnail" />
        </div>
        <div className={styles.ThumbnailInfo}>{props.children}</div>
      </div>
    </Fade>
  );
};

export default thumbnail;
