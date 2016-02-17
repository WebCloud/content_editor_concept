import './styles/main.scss';
import 'babel-polyfill';
import { Parser } from './js/parser';
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
  React.createElement(
    ContentEditor,
    { previewHandler: Parser.previewHandler },
    Parser.getChildrenNodes({ template: template.replace(/\n|(\s{1,}(?=<))/g, ''), style })
  ),
  document.querySelector('.editor')
);
