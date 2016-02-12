import './styles/main.scss';
import 'babel-polyfill';
import { Parser } from './js/parser';
import React from 'react';
import { render } from 'react-dom';

const template = `
<div>
{content.image {className: 'some-class-other', width: '10em'}}
{content.text}
</div>
`;

render(
  React.createElement('div', null, Parser.getChildrenNodes(template)),
  document.querySelector('.editor')
);
