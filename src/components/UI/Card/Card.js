import React, { Component } from 'react';

import styles from './Card.module.scss';
import { SOURCE } from '../../../containers/Restaurants/Restaurants';
import { createGooglePlacePhotoQuery } from '../../../utilities/google';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';
import Fab from '../Fab/Fab';
import Input from '../Input/Input';

class Card extends Component {
  state = {
    isAddingItem: false
  };

  toggleAddItemHandler = () => {
    console.log('Toggling add item');
    this.setState(prevState => {
      return { isAddingItem: !prevState.isAddingItem };
    });
  };

  render() {
    let card = null;

    if (this.props.restaurant) {
      let classNames = styles.RestaurantCard;

      if (this.props.isOpen) classNames += ' ' + styles.RestaurantCardOpen;
      else classNames += ' ' + styles.RestaurantCardClose;

      if (this.props.isTurned) classNames += ' ' + styles.RestaurantCardTurn;

      let details = this.props.children;
      let img = null;
      let title = null;
      let address1 = null;
      let address2 = null;
      let address3 = null;
      let phone = null;

      if (details) {
        title = details.name;

        if (details.photos) {
          img = createGooglePlacePhotoQuery(
            details.photos[0].photo_reference,
            details.photos[0].width
          );
        }
        address1 = details.vicinity;
      }

      let front = (
        <div className={styles.RestaurantCardFront}>
          <Fab mini top right clear isOpen click={this.props.click}>
            flip
          </Fab>
          <div className={styles.ImgContainer}>
            <img src={img} alt="restaurant" />
          </div>
          <div className={styles.DetailsContainer}>
            <div className={styles.Details}>
              <div className={styles.Headline}>
                <div className={styles.Title}>{title}</div>
              </div>
              <div className={styles.Location}>
                <div>{address1}</div>
                <div>{address2}</div>
                <div>{address3}</div>
              </div>
              <div className={styles.Phone}>{phone}</div>
            </div>
          </div>
        </div>
      );

      let items = [];
      for (let i = 0; i < 20; i++) items.push(<div key={i}>Item {i}</div>);

      let inputClasses = styles.InputContainer;
      if (this.state.isAddingItem) inputClasses += ' ' + styles.ShowInput;

      let back = (
        <div className={styles.RestaurantCardBack}>
          <Fab mini top right clear isOpen click={this.props.click}>
            flip
          </Fab>
          <div className={styles.PopularItemsContainer}>
            <div className={styles.PopularItems}>
              <div className={styles.Title}>What's Good?</div>
              <div className={styles.Items}>{items}</div>
            </div>
            <Fab mini bottom right isOpen click={this.toggleAddItemHandler}>
              add
            </Fab>
            <div className={inputClasses}>
              <Input wide thin />
            </div>
          </div>
        </div>
      );

      card = (
        <Aux>
          <div className={classNames}>
            {front}
            {back}
          </div>
          <Backdrop isOpen={this.props.isOpen} click={this.props.close} />
        </Aux>
      );
    }

    return card;
  }
}

export default Card;
