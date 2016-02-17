import React from 'react';

const style = {
  padding: '1em',
  border: 'dashed 2px #acacac',
  display: 'inline-block',
  margin: '0em 1em 1em 0em'
};

function clickEventHandler() {
  console.info('clicked');
}

export default function ImagePlugin(props) {
  const { className = '', width = 'auto', height = width, getMarkdown, pluginIndex } = props;
  const pluginStyle = Object.assign({}, style, { width, height });
  const classNames = `image-plugin ${className}`;

  getMarkdown('![deadpool](http://i.imgur.com/wXpNi4T.gif)', pluginIndex);

  return (<div style={pluginStyle} className={classNames} onClick={clickEventHandler}>
    Here will be some image
  </div>);
}
