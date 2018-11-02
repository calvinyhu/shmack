import React from 'react';
import PropTypes from 'prop-types';

import styles from './Profile.module.scss';
import Button from '../UI/Button/Button';

const profile = props => {
  profile.propTypes = {
    isEmailVerified: PropTypes.bool.isRequired,
    photoURL: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
    handleToggleEditProfile: PropTypes.func.isRequired,
    onVerifyEmail: PropTypes.func.isRequired
  };

  let verifyEmailButton = null;
  if (!props.isEmailVerified) {
    verifyEmailButton = (
      <div className={styles.VerifyEmailButton}>
        <Button main click={props.onVerifyEmail}>
          Verify Email
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.Profile}>
      <div className={styles.EditProfileButton}>
        <Button main click={props.handleToggleEditProfile}>
          Edit
        </Button>
      </div>
      <div className={styles.ProfilePicture}>
        <img src={props.photoURL} alt="Profile" />
      </div>
      <div className={styles.ProfileInfo}>
        <h3>{props.displayName}</h3>
        <div className={styles.Email}>
          <p>{props.email}</p>
          {verifyEmailButton}
        </div>
      </div>
    </div>
  );
};

export default profile;
