import React from 'react';
import Fade from 'react-reveal/Fade';

import styles from './NearBy.module.scss';
import Thumbnail from 'components/Thumbnail/Thumbnail';
import Button from 'components/UI/Button/Button';
import Fa from 'components/UI/Icon/Fa/Fa';
import Rf from 'components/UI/Icon/Rf/Rf';
import {
  createGooglePlacePhotoQuery,
  convertPrice,
  convertRating
} from 'utilities/google';

const NearBy = props => {
  const getPrice = price => {
    return (
      <div className={styles.PriceLevel}>
        {convertPrice(price).map((sign, index) => (
          <Fa key={index}>{sign}</Fa>
        ))}
      </div>
    );
  };

  const getStars = rating => {
    const stars = convertRating(rating).map((star, index) => (
      <Fa key={index}>{star}</Fa>
    ));

    return <div className={styles.Stars}>{rating ? stars : null}</div>;
  };

  const renderNearByThumbnails = () => {
    let nearByThumbnails = [];
    if (props.nearByRestaurants) {
      props.nearByRestaurants.forEach(res => {
        if (res.photos) {
          const photo = res.photos[0];
          const imgUrl = createGooglePlacePhotoQuery(
            photo.photo_reference,
            photo.width
          );
          nearByThumbnails.push(
            <div key={res.place_id} className={styles.NearByRestaurant}>
              <Thumbnail
                click={props.getRestaurantClickHandler(res.place_id, res)}
                img={imgUrl}
              >
                <h6>{getPrice(res.price_level)}</h6>
                <h6>{res.name}</h6>
                <h6>{res.rating ? getStars(res.rating) : null}</h6>
              </Thumbnail>
            </div>
          );
        }
      });
    }
    return nearByThumbnails;
  };

  let nearByRestaurants = null;
  if (!props.isLoading && !props.error) {
    nearByRestaurants = renderNearByThumbnails();
    if (nearByRestaurants.length === 0) {
      nearByRestaurants = (
        <div className={styles.NearByMessage}>
          <p>
            There are no restaurants near your current location. Try again or
            manually search.
          </p>
        </div>
      );
    }
  }

  return (
    <div className={styles.NearByContainer}>
      <Fade>
        <div className={styles.NearBy}>
          <div className={styles.NearByHeader}>
            <h5>Near You</h5>
            <div className={styles.NearByRefresh}>
              <Button clear circle small click={props.handleRefresh}>
                <Rf>refresh</Rf>
              </Button>
            </div>
          </div>
          {nearByRestaurants}
        </div>
      </Fade>
    </div>
  );
};

export default NearBy;
