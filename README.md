# React content editor concept

![preview image](https://raw.githubusercontent.com/WebCloud/content_editor_comcept/master/public/img/preview.png)

This is a conceptual experiment built with React. It has a [Parser](https://github.com/WebCloud/content_editor_comcept/blob/master/src/js/parser/index.js), for restructuring a template into React code.

The plugins use a higher order component structure in order to encapsulate the common logic into a transparent layer.

There's a basic template structure setup on [main.js](https://github.com/WebCloud/content_editor_comcept/blob/master/src/main.js#L23-L28).

```jsx
<div class="outter">
  {content.image {className: 'some-class-other', width: '100%', height: '11em'}}
  {content.image {className: 'some-class-other', width: '10em'}}
  {content.text {headingLevel: 'h4', className: 'a-text'}}
  {content.md {className: 'markdown-editor', width: '100%'}}
</div>
```

Where one indicates which plugin to be used with the `content.pluginName` object notation/mustache.
