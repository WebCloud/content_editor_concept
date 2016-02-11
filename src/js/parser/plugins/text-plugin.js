import PluginFactory from './plugin-factory';

const style = `
<style>
  .text-plugin {
    padding: 1em;
    border: dashed 2px #acacac;
  }
</style>`;

const markup = '<div class="text-plugin">Here will be some text</div>';
// const pluginEvents = [{ eventName: 'click', eventHander: ()=> console.log('called') }];

export default new PluginFactory({ name: 'text', markup, style });
