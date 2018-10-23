import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import styles from './ResItem.module.scss';
import * as actions from 'store/actions/resPageActions';
import Button from 'components/UI/Button/Button';
import Rf from '../UI/Icon/Rf/Rf';

const mapStateToProps = state => ({
  votes: state.user.votes
});

const mapDispatchToProps = {
  onPostVote: actions.postVote
};

class ResItem extends PureComponent {
  voteUpHandlers = {};
  getVoteUpHandler = (id, name) => {
    if (!this.voteUpHandlers[name])
      this.voteUpHandlers[name] = () => this.props.onPostVote(id, name, true);
    return this.voteUpHandlers[name];
  };

  voteDownHandlers = {};
  getVoteDownHandler = (id, name) => {
    if (!this.voteDownHandlers[name]) {
      this.voteDownHandlers[name] = () =>
        this.props.onPostVote(id, name, false);
    }
    return this.voteDownHandlers[name];
  };

  render() {
    return (
      <li>
        <p>{this.props.name}</p>
        <div className={styles.Vote}>
          <p>{this.props.likes}</p>
          <div className={styles.Thumb}>
            <Button
              clear
              circle
              click={this.getVoteUpHandler(this.props.id, this.props.name)}
            >
              <Rf
                darkMain={
                  this.props.votes
                    ? this.props.votes.likes.includes(this.props.name)
                    : false
                }
              >
                thumbs-up
              </Rf>
            </Button>
          </div>
          <p>{this.props.dislikes}</p>
          <div className={styles.Thumb}>
            <Button
              clear
              circle
              click={this.getVoteDownHandler(this.props.id, this.props.name)}
            >
              <Rf
                darkMain={
                  this.props.votes
                    ? this.props.votes.dislikes.includes(this.props.name)
                    : false
                }
              >
                thumbs-down
              </Rf>
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
