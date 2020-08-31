'use strict'

function importAll (plugin: PluginArray, context: any) {
  context.keys().forEach((key: string) => {
    const id: string = key.split('./').join('').split('.svg').join('')
    const href:string = context(key).default.id
    plugin[id] = `<svg width="100%" height="100%"><use xlink:href="#${href}"></use></svg>`
  })
}

export default (context: any, inject: any) => {
  if (context) {
    const $svg: any = {}
    importAll($svg, require.context('!!svg-sprite-loader!../assets/svg', true, /\.*$/))
    inject('svg', $svg)
  }
}
