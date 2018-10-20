import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './ResPage.module.scss';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import { MAT_ICONS } from '../../utilities/styles';
import {
  createGooglePlacePhotoQuery,
  convertPrice
} from '../../utilities/google';
import * as actions from '../../store/actions/resPageActions';
import ResItem from '../ResItem/ResItem';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import { auth } from '../../utilities/firebase';
import poweredByGoogle from '../../assets/images/poweredByGoogle.png';

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
    if (event) event.preventDefault();
    if (this.state.newItem) {
      this.props.onPostItem(id, this.state.newItem);
      this.setState({ newItem: '' });
    } else this.props.onPostItemFail('The item name is required.');
  };

  convertRating = rating => {
    if (rating > 5) rating = 5;
    if (rating < 0) rating = 0;

    let stars = [];
    let filled;
    for (filled = 0; filled < rating - 1; filled++) {
      stars.push(
        <div key={filled} className={MAT_ICONS}>
          star
        </div>
      );
    }

    let remainder = rating - filled;
    remainder = remainder.toFixed(1);
    if (remainder >= 0.8) {
      stars.push(
        <div key={remainder} className={MAT_ICONS}>
          star
        </div>
      );
    } else if (remainder >= 0.3) {
      stars.push(
        <div key={remainder} className={MAT_ICONS}>
          star_half
        </div>
      );
    }

    for (let empty = stars.length; empty < 5; empty++) {
      stars.push(
        <div key={empty} className={MAT_ICONS}>
          star_border
        </div>
      );
    }

    return (
      <div className={styles.RatingContainer}>
        <p>{rating ? rating.toFixed(1) : null}</p>
        {rating ? stars : null}
      </div>
    );
  };

  renderPageContent = () => {
    if (this.props.restaurant) {
      const res = this.props.restaurant;
      const id = res.place_id;
      const imgSrc = createGooglePlacePhotoQuery(
        res.photos[0].photo_reference,
        res.photos[0].width
      );
      const name = res.name;
      const price = convertPrice(res.price_level);
      const rating = this.convertRating(res.rating);
      let open = null;
      let isResOpen = null;
      if (res.opening_hours) {
        open = res.opening_hours.open_now ? 'Open' : 'Closed';
        isResOpen = res.opening_hours.open_now
          ? styles.ResIsOpen
          : styles.ResIsClosed;
      }
      const address = res.vicinity;
      const phone = '';

      const items = this.renderItems();
      let addItem = null;
      if (!this.props.isGettingItems) {
        addItem = (
          <form className={styles.AddItem} onSubmit={this.getSubmitHandler(id)}>
            <div className={styles.AddItemInputContainer}>
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
            <div className={styles.AddItemSubmitButton}>
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
            <p className={styles.AddItemMessage}>{this.props.resPageError}</p>
          </Aux>
        );
      }

      return (
        <main>
          <div className={styles.ImgContainer}>
            <div className={styles.BackButton}>
              <Button translucent circle click={this.props.close}>
                <div className={MAT_ICONS}>arrow_back</div>
              </Button>
            </div>
            <img src={imgSrc} alt="restaurant" />
          </div>
          <div className={styles.Info}>
            <div className={styles.Details}>
              <div className={styles.TitleOpenClosed}>
                <h5>{name}</h5>
                <p className={isResOpen}>{open}</p>
              </div>
              <div className={styles.PriceRating}>
                {price}
                {rating}
              </div>
              <div className={styles.Address}>
                <p>{address}</p>
              </div>
              <div className={styles.Phone}>
                <p>{phone}</p>
              </div>
              <div className={styles.Attribution}>
                <img src={poweredByGoogle} alt="powered by Google" />
              </div>
            </div>
            <div className={styles.Popular}>
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
        <div className={styles.LoaderContainer}>
          <div className={styles.Loader}>Searching...</div>
        </div>
      );
    } else
      items = (
        <p>No foods yet! But help us grow by adding your recommendations!</p>
      );

    return items;
  };

  render() {
    let resPageClasses = styles.ResPage;
    if (this.props.isOpen) resPageClasses += ' ' + styles.OpenResPage;
    const pageContent = this.renderPageContent();
    return <div className={resPageClasses}>{pageContent}</div>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResPage);
