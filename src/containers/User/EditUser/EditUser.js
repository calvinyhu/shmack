import React from 'react';

import styles from './EditUser.module.scss';
import { FIELDS } from '../../../utilities/database';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';

const EditUser = props => {
  let inputs = null;

  if (props.values) {
    inputs = (
      <Aux>
        <Input
          wide
          onOppAdj
          type="text"
          name={FIELDS.FIRST_NAME}
          placeholder="First Name"
          value={props.values[FIELDS.FIRST_NAME]}
          change={props.change}
        />
        <Input
          wide
          onOppAdj
          type="text"
          name={FIELDS.LAST_NAME}
          placeholder="Last Name"
          value={props.values[FIELDS.LAST_NAME]}
          change={props.change}
        />
        <Input
          wide
          onOppAdj
          type="text"
          name={FIELDS.LOCATION}
          placeholder="Location"
          value={props.values[FIELDS.LOCATION]}
          change={props.change}
        />
      </Aux>
    );
  }

  return (
    <div className={styles.UserInfo}>
      <form onSubmit={props.submit}>
        {inputs}
        <Button wide>Save</Button>
        {props.children}
      </form>
      <Button link click={props.back}>
        Back to profile
      </Button>
    </div>
  );
};

export default EditUser;
