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


For more information read the article [Creating a React Content Editor](https://webcloud.info/blog/2016/04/12/creating-a-react-content-editor/) about this project.

# Usage

```jsx
<ContentEditor template={templateString} onSave={dataReceiverFunction} store={myStore} componentsStyle={styleString} />
```

For more detailed usage refer to [main.js](src/main.js).


# Creating a new plugin

All plugins must use the higher order component [plugin-constructor](src/js/parser/plugins/plugin-constructor.js).

```jsx
// example-plugin.js
import pluginConstructor from './plugin-constructor';

function Example({ text, isPreviewing }) {
  const style = {};
  style.fontStyle = isPreviewing ? 'italic' : 'normal';
  return <h1 style={style}>{text}</h1>;
}

export default pluginConstructor(Example);



// main.js
// ...

const template = `
<div class="outter">
  {content.example {text: 'Something...'}}
</div>
`;

// ...

render(<ContentEditor
  template={templateString}
  onSave={dataReceiverFunction}
  store={myStore}
  componentsStyle={styleString}
/>, document.querySelector('.my-target'));

```

# Important notice

On the [md-plugin](src/js/parser/plugins/md-plugin.js) I am using the [simplemde-markdown-editor](https://github.com/NextStepWebs/simplemde-markdown-editor) as dependency. Of which on the current version in usage (1.10.1) has a problem with Webpack and is crashing due to a problem with one of its internal dependencies. I have submitted a pull request in order to fix it. See https://github.com/NextStepWebs/codemirror-spell-checker/pull/18 on how to fix this runtime error and run the project if you want to test the MDPlugin.