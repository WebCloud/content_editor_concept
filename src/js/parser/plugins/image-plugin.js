import React from 'react';

const style = {
  padding: '1em',
  border: 'dashed 2px #acacac'
};

function clickEventHandler() {
  console.info('clicked');
}

export default function ImagePlugin({ className = '', width = 'auto', height = width }) {
  const pluginStyle = Object.assign({}, style, { width, height });
  const classNames = `image-plugin ${className}`;

  return (<div style={pluginStyle} className={classNames} onClick={clickEventHandler}>
    Here will be some image
  </div>);
}
