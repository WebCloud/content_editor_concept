import { PropTypes } from 'react';

const baseStyles = {
  padding: '1em',
  border: 'dashed 2px #acacac',
  display: 'inline-block'
};

const basePropTypes = {
  className: PropTypes.string,
  pluginIndex: PropTypes.number,
  getData: PropTypes.func,
  isPreviewing: PropTypes.bool
};

const baseStateVariables = {
  editMode: false,
  pluginData: {}
};

export {
  baseStyles,
  basePropTypes,
  baseStateVariables
};
