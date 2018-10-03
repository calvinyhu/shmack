import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './ResPage.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import { MAT_ICONS } from '../../utilities/styles';
import { SOURCE } from '../../containers/Restaurants/Restaurants';
import {
  createGooglePlacePhotoQuery,
  convertPrice
} from '../../utilities/google';
import * as actions from '../../store/actions/resPageActions';
import ResItem from '../ResItem/ResItem';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import { auth } from '../../utilities/firebase';

const mapStateToProps = state => {
  return {
    isGettingItems: state.resPage.isGettingItems,
    items: state.resPage.items,
    resPageError: state.resPage.resPageError,
    userPlaces: state.user.userPlaces
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPostItem: (id, item) => dispatch(actions.postItem(id, item)),
    onPostVote: (id, name, likes, dislikes) =>
      dispatch(actions.postVote(id, name, likes, dislikes)),
    onPostItemFail: error => dispatch(actions.postItemFail(error))
  };
};

class ResPage extends Component {
  submitHandlers = {};

  state = {
    items: null,
    newItem: ''
  };

  handleInputChange = event => this.setState({ newItem: event.target.value });

  getSubmitHandler = id => {
    if (!this.submitHandlers[id])
      this.submitHandlers[id] = event => this.handleSubmit(event, id);
    return this.submitHandlers[id];
  };

  handleSubmit = (event, id) => {
    event.preventDefault();
    if (this.state.newItem) {
      this.props.onPostItem(id, this.state.newItem);
      this.setState({ newItem: '' });
    } else this.props.onPostItemFail('The item name is required.');
  };

  renderPageContent = () => {
    if (this.props.restaurant) {
      const res = this.props.restaurant;
      let id, imgSrc, name, price, rating, open, isResOpen;
      let address1, address2, address3, phone;

      if (this.props.src === SOURCE.YELP) {
        id = res.id;
        imgSrc = res.image_url;
        name = res.name;
        price = res.price;
        rating = res.rating;
        // open = !res.is_closed ? 'Open' : 'Closed';
        isResOpen = !res.is_closed ? classes.ResIsOpen : classes.ResIsClosed;
        address1 = res.location.display_address[0];
        address2 = res.location.display_address[1];
        address3 = res.location.display_address[2];
        phone = res.display_phone;
      } else {
        id = res.place_id;
        imgSrc = createGooglePlacePhotoQuery(
          res.photos[0].photo_reference,
          res.photos[0].width
        );
        name = res.name;
        price = convertPrice(res.price_level);
        rating = res.rating;
        open = res.opening_hours.open_now ? 'Open' : 'Closed';
        isResOpen = res.opening_hours.open_now
          ? classes.ResIsOpen
          : classes.ResIsClosed;
        address1 = res.vicinity;
        address2 = null;
        address3 = null;
        phone = '';
      }

      const items = this.renderItems();
      let addItem = null;
      if (!this.props.isGettingItems) {
        addItem = (
          <form
            className={classes.AddItem}
            onSubmit={this.getSubmitHandler(id)}
          >
            <div className={classes.AddItemInputContainer}>
              <Input
                small
                line
                type={'text'}
                name={'item'}
                placeholder={'New Item'}
                value={this.state.newItem}
                change={this.handleInputChange}
              />
            </div>
            <div className={classes.AddItemSubmitButton}>
              <Button circle clear click={this.getSubmitHandler(id)}>
                <div className={MAT_ICONS}>add</div>
              </Button>
            </div>
          </form>
        );
      }

      let popular = <p>Sign in to get access to popular menu items!</p>;
      if (auth.currentUser) {
        popular = (
          <Aux>
            <ul>{items}</ul>
            {addItem}
            <p className={classes.AddItemMessage}>{this.props.resPageError}</p>
          </Aux>
        );
      }

      return (
        <main>
          <div className={classes.ImgContainer}>
            <div className={classes.BackButton}>
              <Button translucent circle click={this.props.close}>
                <div className={MAT_ICONS}>arrow_back</div>
              </Button>
            </div>
            <img src={imgSrc} alt="restaurant" />
          </div>
          <div className={classes.Info}>
            <div className={classes.Details}>
              <div className={classes.RO}>
                <h5>{name}</h5>
                <p className={isResOpen}>{open}</p>
              </div>
              <div className={classes.PR}>
                <p>{price}</p>
                <p>{rating}</p>
              </div>
              <p>{address1}</p>
              <p>{address2}</p>
              <p>{address3}</p>
              <p>{phone}</p>
            </div>
            <div className={classes.Popular}>
              <h6>What's Good?</h6>
              {popular}
            </div>
          </div>
        </main>
      );
    }

    return null;
  };

  renderItems = () => {
    let items = null;

    let userPlaceRes = null;

    if (this.props.userPlaces)
      userPlaceRes = this.props.userPlaces[this.props.id];

    if (this.props.items) {
      items = [];
      const names = Object.keys(this.props.items);
      names.forEach(name => {
        let userPlacesName = null;
        if (userPlaceRes) userPlacesName = userPlaceRes[name];

        let votedUp = false;
        let votedDown = false;

        if (userPlacesName) {
          votedUp = userPlacesName.votedUp;
          votedDown = userPlacesName.votedDown;
        }

        items.push(
          <ResItem
            key={name}
            name={name}
            id={this.props.id}
            votedUp={votedUp}
            votedDown={votedDown}
          />
        );
      });
    } else if (this.props.isGettingItems) {
      items = (
        <div className={classes.LoaderContainer}>
          <div className={classes.Loader}>Searching...</div>
        </div>
      );
    } else
      items = (
        <p>No foods yet! But help us grow by adding your recommendations!</p>
      );

    return items;
  };

  render() {
    let resPageClasses = classes.ResPage;
    if (this.props.isOpen) resPageClasses += ' ' + classes.OpenResPage;
    const pageContent = this.renderPageContent();
    return <div className={resPageClasses}>{pageContent}</div>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResPage);
