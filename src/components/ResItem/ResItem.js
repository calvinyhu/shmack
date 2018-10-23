import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import styles from './ResItem.module.scss';
import * as resPageActions from 'store/actions/resPageActions';
import * as userActions from 'store/actions/userActions';
import Button from 'components/UI/Button/Button';
import Rf from '../UI/Icon/Rf/Rf';

const mapStateToProps = state => ({
  votes: state.user.votes
});

const mapDispatchToProps = {
  onPostRestaurantVote: resPageActions.postRestaurantVote,
  onPostUserVote: userActions.postUserVote
};

const DELAY = 500;

class ResItem extends PureComponent {
  upTimer = null;
  downTimer = null;

  handleVoteUp = () => {
    if (this.upTimer || this.downTimer) return;
    this.props.onPostRestaurantVote(this.props.id, this.props.name, true);
    this.props.onPostUserVote(this.props.id, this.props.name, true);
    this.upTimer = setTimeout(() => (this.upTimer = null), DELAY);
  };

  handleVoteDown = () => {
    if (this.upTimer || this.downTimer) return;
    this.props.onPostRestaurantVote(this.props.id, this.props.name, false);
    this.props.onPostUserVote(this.props.id, this.props.name, false);
    this.downTimer = setTimeout(() => (this.downTimer = null), DELAY);
  };

  render() {
    let isVotedUp = false;
    if (this.props.votes && this.props.votes.likes.includes(this.props.name))
      isVotedUp = true;

    let isVotedDown = false;
    if (this.props.votes && this.props.votes.dislikes.includes(this.props.name))
      isVotedDown = true;

    return (
      <li>
        <p>{this.props.name}</p>
        <div className={styles.Vote}>
          <p>{this.props.likes}</p>
          <div className={styles.Thumb}>
            <Button clear circle click={this.handleVoteUp}>
              <Rf darkMain={isVotedUp}>thumbs-up</Rf>
            </Button>
          </div>
          <p>{this.props.dislikes}</p>
          <div className={styles.Thumb}>
            <Button clear circle click={this.handleVoteDown}>
              <Rf darkMain={isVotedDown}>thumbs-down</Rf>
            </Button>
          </div>
        </div>
      </li>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResItem);
