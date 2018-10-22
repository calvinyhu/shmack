import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import styles from './ResItem.module.scss';
import * as actions from 'store/actions/resPageActions';
import Button from 'components/UI/Button/Button';
import { MAT_ICONS } from 'utilities/styles';
import Fa from '../UI/Icon/Fa';

const mapStateToProps = state => {
  return {
    items: state.resPage.items
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPostVote: (id, name, isUp) => dispatch(actions.postVote(id, name, isUp))
  };
};

class ResItem extends PureComponent {
  voteUpHandlers = {};
  voteDownHandlers = {};

  getVoteUpHandler = (id, name) => {
    if (!this.voteUpHandlers[name])
      this.voteUpHandlers[name] = () => this.props.onPostVote(id, name, true);
    return this.voteUpHandlers[name];
  };

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
          <p>{this.props.items[this.props.name].likes}</p>
          <div className={styles.Thumb}>
            <Button
              clear
              circle
              click={this.getVoteUpHandler(
                this.props.id,
                this.props.name,
                this.props.items[this.props.name].likes,
                this.props.items[this.props.name].dislikes
              )}
            >
              <Fa>far fa-thumbs-up</Fa>
            </Button>
          </div>
          <p>{this.props.items[this.props.name].dislikes}</p>
          <div className={styles.Thumb}>
            <Button
              clear
              circle
              click={this.getVoteDownHandler(
                this.props.id,
                this.props.name,
                this.props.items[this.props.name].likes,
                this.props.items[this.props.name].dislikes
              )}
            >
              <Fa>far fa-thumbs-down</Fa>
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
