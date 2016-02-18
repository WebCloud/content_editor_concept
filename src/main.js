import './styles/main.scss';
import 'babel-polyfill';
import ContentEditor from './js/content-editor';
import React from 'react';
import { render } from 'react-dom';

const style = `
div.outter {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
}
`;

const template = `
<div class="outter">
  {content.image {className: 'some-class-other', width: '10em'}}
  {content.text {headingLevel: 'h4', className: 'a-text'}}
</div>
`;

render(
  <ContentEditor template={ template } componentsStyle={ style } />,
  document.querySelector('.editor')
);
