import { PropTypes } from 'react';

const baseStyles = {
  padding: '1em',
  border: 'dashed 2px #acacac',
  display: 'inline-block'
};

const basePropTypes = {
  className: PropTypes.string,
  pluginIndex: PropTypes.number,
  getMarkdown: PropTypes.func,
  isPreviewing: PropTypes.bool
};

export {
  baseStyles,
  basePropTypes
};
