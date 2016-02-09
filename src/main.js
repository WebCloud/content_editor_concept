import './styles/main.scss';
import 'babel-polyfill';
import { Parser } from './js/parser';

const template = `
<div>
{content.image}
{content.text}
</div>
`;

document.querySelector('.editor').innerHTML = Parser.parse(template);
