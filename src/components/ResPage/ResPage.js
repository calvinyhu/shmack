import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './ResPage.module.scss';
import Button from 'components/UI/Button/Button';
import Input from 'components/UI/Input/Input';
import {
  createGooglePlacePhotoQuery,
  convertPrice,
  convertRating
} from 'utilities/google';
import * as resPageActions from 'store/actions/resPageActions';
import ResItem from 'components/ResItem/ResItem';
import Fa from 'components/UI/Icon/Fa/Fa';
import Rf from 'components/UI/Icon/Rf/Rf';
import Aux from 'hoc/Auxiliary/Auxiliary';
import { auth } from 'utilities/firebase';
import poweredByGoogle from 'assets/images/poweredByGoogle.png';

const mapStateToProps = state => ({
  isGettingItems: state.resPage.isGettingItems,
  items: state.resPage.items,
  error: state.resPage.error
});

const mapDispatchToProps = {
  onPostItem: resPageActions.postItem,
  onPostItemFail: resPageActions.postItemFail
};

class ResPage extends Component {
  state = {
    newItem: ''
  };

  handleInputChange = event => this.setState({ newItem: event.target.value });

  handleSubmit = (event, id) => {
    if (event) event.preventDefault();

    let modifiedItem = null;
    if (this.state.newItem) modifiedItem = this.state.newItem.trim();

    if (modifiedItem) {
      this.props.onPostItem(id, modifiedItem.toLowerCase());
      this.setState({ newItem: '' });
    } else this.props.onPostItemFail('The item name is required.');
  };

  submitHandlers = {};
  getSubmitHandler = id => {
    if (!this.submitHandlers[id])
      this.submitHandlers[id] = event => this.handleSubmit(event, id);
    return this.submitHandlers[id];
  };

  getPrice = price => {
    return (
      <div className={styles.PriceLevel}>
        {convertPrice(price).map((sign, index) => (
          <Rf key={index}>{sign}</Rf>
        ))}
      </div>
    );
  };

  getRating = rating => {
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

  renderPageContent = () => {
    if (this.props.restaurant) {
      const res = this.props.restaurant;
      const id = res.place_id;
      const imgSrc = createGooglePlacePhotoQuery(
        res.photos[0].photo_reference,
        res.photos[0].width
      );
      const name = res.name;
      const price = this.getPrice(res.price_level);
      const rating = this.getRating(res.rating);
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
                line
                type={'text'}
                name={'item'}
                placeholder={'New Item'}
                value={this.state.newItem}
                change={this.handleInputChange}
                error={this.props.error}
              />
            </div>
            <div className={styles.AddItemSubmitButton}>
              <Button circle clear click={this.getSubmitHandler(id)}>
                <Rf>plus</Rf>
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
          </Aux>
        );
      }

      return (
        <main>
          <div className={styles.ImgContainer}>
            <div className={styles.BackButton}>
              <Button translucent circle click={this.props.close}>
                <Rf white>arrow-left</Rf>
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
              <h5>What's Good?</h5>
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

    if (this.props.items && Object.keys(this.props.items).length > 0) {
      items = [];
      const names = Object.keys(this.props.items);
      names.forEach(name => {
        items.push(
          <ResItem
            key={name}
            id={this.props.id}
            name={name}
            likes={this.props.items[name].likes}
            dislikes={this.props.items[name].dislikes}
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
