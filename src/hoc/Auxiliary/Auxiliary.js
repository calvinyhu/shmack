import PropTypes from 'prop-types';

// @auxiliary allows adjacent JSX to be next to each other.
const aux = props => props.children;

aux.propTypes = {
  children: PropTypes.array
};

export default aux;
