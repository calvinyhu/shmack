import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import classes from './ResItem.css';
import * as actions from '../../store/actions/resPageActions';
import Button from '../UI/Button/Button';
import { MAT_ICONS } from '../../utilities/styles';

const mapStateToProps = state => {
  return {
    items: state.resPage.items
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPostVote: (id, name, likes, dislikes, direction, value) =>
      dispatch(actions.postVote(id, name, likes, dislikes, direction, value))
  };
};

class ResItem extends PureComponent {
  voteUpHandlers = {};
  voteDownHandlers = {};

  // TODO: Send a request to vote to firebase and let firebase have a single function to manage up votes and down votes
  getVoteUpHandler = (id, name, likes, dislikes) => {
    if (!this.voteUpHandlers[name]) {
      this.voteUpHandlers[name] = () => {
        const likeValue = !this.props.votedUp || this.props.votedDown ? 1 : -1;
        const dislikeValue = this.props.votedDown ? -1 : 0;
        this.props.onPostVote(
          id,
          name,
          likes + likeValue,
          dislikes + dislikeValue,
          'up',
          !this.props.votedUp
        );
      };
    }
    return this.voteUpHandlers[name];
  };

  getVoteDownHandler = (id, name, likes, dislikes) => {
    if (!this.voteDownHandlers[name]) {
      this.voteDownHandlers[name] = () => {
        const likeVaue = this.props.votedUp ? -1 : 0;
        const dislikeValue =
          !this.props.votedDown || this.props.votedUp ? 1 : -1;
        this.props.onPostVote(
          id,
          name,
          likes + likeVaue,
          dislikes + dislikeValue,
          'down',
          !this.props.votedDown
        );
      };
    }
    return this.voteDownHandlers[name];
  };

  render() {
    return (
      <li>
        <p>{this.props.name}</p>
        <div className={classes.Vote}>
          <p>{this.props.items[this.props.name].likes}</p>
          <Button
            clear
            click={this.getVoteUpHandler(
              this.props.id,
              this.props.name,
              this.props.items[this.props.name].likes,
              this.props.items[this.props.name].dislikes
            )}
          >
            <div className={MAT_ICONS}>thumb_up_alt</div>
          </Button>
          <p>{this.props.items[this.props.name].dislikes}</p>
          <Button
            clear
            click={this.getVoteDownHandler(
              this.props.id,
              this.props.name,
              this.props.items[this.props.name].likes,
              this.props.items[this.props.name].dislikes
            )}
          >
            <div className={MAT_ICONS}>thumb_down_alt</div>
          </Button>
        </div>
      </li>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResItem);
