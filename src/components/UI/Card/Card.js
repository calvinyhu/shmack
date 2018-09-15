import React, { Component } from 'react';

import classes from './Card.css';
import { SOURCE } from '../../../containers/Restaurants/Restaurants';
import { createGooglePlacePhotoQuery } from '../../../utilities/google';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';
import Fab from '../Fab/Fab';
import Input from '../Input/Input';
import { MAT_ICONS } from '../../../utilities/styles';

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
      let classNames = classes.RestaurantCard;

      if (this.props.isOpen) classNames += ' ' + classes.RestaurantCardOpen;
      else classNames += ' ' + classes.RestaurantCardClose;

      if (this.props.isTurned) classNames += ' ' + classes.RestaurantCardTurn;

      let details = this.props.children;
      let img = null;
      let title = null;
      let address1 = null;
      let address2 = null;
      let address3 = null;
      let phone = null;

      if (details) {
        title = details.name;

        if (this.props.cardSrc === SOURCE.YELP) {
          img = details.image_url;
          address1 = details.location.display_address[0];
          address2 = details.location.display_address[1];
          address3 = details.location.display_address[2];
          phone = details.display_phone;
        }

        if (this.props.cardSrc === SOURCE.GOOGLE) {
          if (details.photos) {
            img = createGooglePlacePhotoQuery(
              details.photos[0].photo_reference,
              details.photos[0].width
            );
          }
          address1 = details.vicinity;
        }
      }

      let front = (
        <div className={classes.RestaurantCardFront}>
          <Fab mini top right clear isOpen click={this.props.click}>
            flip
          </Fab>
          <div className={classes.ImgContainer}>
            <img src={img} alt="restaurant" />
          </div>
          <div className={classes.DetailsContainer}>
            <div className={classes.Details}>
              <div className={classes.Headline}>
                <div className={classes.Title}>{title}</div>
              </div>
              <div className={classes.Location}>
                <div>{address1}</div>
                <div>{address2}</div>
                <div>{address3}</div>
              </div>
              <div className={classes.Phone}>{phone}</div>
            </div>
          </div>
        </div>
      );

      let items = [];
      for (let i = 0; i < 20; i++) items.push(<div key={i}>Item {i}</div>);

      let inputClasses = classes.InputContainer;
      if (this.state.isAddingItem) inputClasses += ' ' + classes.ShowInput;

      let back = (
        <div className={classes.RestaurantCardBack}>
          <Fab mini top right clear isOpen click={this.props.click}>
            flip
          </Fab>
          <div className={classes.PopularItemsContainer}>
            <div className={classes.PopularItems}>
              <div className={classes.Title}>What's Good?</div>
              <div className={classes.Items}>{items}</div>
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
