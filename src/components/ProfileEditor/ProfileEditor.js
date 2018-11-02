import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './ProfileEditor.module.scss';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Rf from '../UI/Icon/Rf/Rf';

const profileEditor = props => {
  profileEditor.propTypes = {
    isEditingProfile: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired
  };

  let loader = null;
  if (props.isSaving) {
    loader = (
      <div className={styles.LoaderContainer}>
        <div className={styles.Loader} />
      </div>
    );
  }

  const profileEditorClasses = classnames({
    [styles.ProfileEditor]: true,
    [styles.OpenProfileEditor]: props.isEditingProfile
  });

  return (
    <div className={profileEditorClasses}>
      <form>
        <Input
          small
          margin
          floatText
          required
          line
          type="text"
          name="firstName"
          placeholder="First Name"
          value={props.firstName}
          change={props.handleInputChange}
        />
        <Input
          small
          margin
          floatText
          required
          line
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={props.lastName}
          change={props.handleInputChange}
        />
        <Input
          small
          margin
          floatText
          required
          line
          type="text"
          name="email"
          placeholder="Email"
          value={props.email}
          change={props.handleInputChange}
        />
      </form>
      <div className={styles.FormButtons}>
        <div className={styles.FormButton}>
          <Button clear circle click={props.handleSave}>
            <Rf>check</Rf>
          </Button>
        </div>
        <div className={styles.FormButton}>
          <Button clear circle click={props.handleCancel}>
            <Rf>x</Rf>
          </Button>
        </div>
      </div>
      {loader}
    </div>
  );
};

export default profileEditor;
