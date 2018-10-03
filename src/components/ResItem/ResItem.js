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
