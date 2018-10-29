import React from 'react';
import Fade from 'react-reveal/Fade';
import PropTypes from 'prop-types';

import styles from './Thumbnail.module.scss';
import Fa from 'components/UI/Icon/Fa/Fa';
import Rf from 'components/UI/Icon/Rf/Rf';
import { convertPrice, convertRating } from 'utilities/google';

const thumbnail = props => {
  thumbnail.propTypes = {
    click: PropTypes.func.isRequired,
    img: PropTypes.string.isRequired,
    price: PropTypes.number,
    name: PropTypes.string,
    rating: PropTypes.number
  };

  const getPrice = price => {
    return (
      <div className={styles.PriceLevel}>
        {convertPrice(price).map((sign, index) => (
          <Rf key={index} sm white>
            {sign}
          </Rf>
        ))}
      </div>
    );
  };

  const getStars = rating => {
    const stars = convertRating(rating).map((star, index) => (
      <Fa key={index}>{star}</Fa>
    ));

    return (
      <div className={styles.RatingContainer}>
        <p>{rating ? rating.toFixed(1) : null}</p>
        <div className={styles.Stars}>{rating ? stars : null}</div>
      </div>
    );
  };

  return (
    <Fade>
      <div className={styles.Thumbnail} onClick={props.click}>
        <div className={styles.ThumbnailImgContainer}>
          <img src={props.img} alt="Thumbnail" />
        </div>
        <div className={styles.ThumbnailInfo}>
          {getPrice(props.price)}
          <h6>{props.name}</h6>
          {props.rating ? getStars(props.rating) : null}
        </div>
      </div>
    </Fade>
  );
};

export default thumbnail;
