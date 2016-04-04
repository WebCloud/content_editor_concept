import './styles/main.scss';
import 'babel-polyfill';
import ContentEditor from './js/content-editor';
import React from 'react';
import { render } from 'react-dom';
import { store } from './js/store';
import { http } from './js/store/adapters';


const contentStore = store(http);

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
  {content.image {className: 'some-class-other', width: '100%', height: '11em'}}
  {content.image {className: 'some-class-other', width: '10em'}}
  {content.text {headingLevel: 'h4', className: 'a-text'}}
  {content.md {className: 'markdown-editor', width: '100%'}}
</div>
`;

function saveData(data) {
  window.console.info(data);
}

const props = {
  template,
  componentsStyle: style,
  onSave: saveData,
  store: contentStore
};

render(
  <ContentEditor { ...props } />,
  document.querySelector('.editor')
);
