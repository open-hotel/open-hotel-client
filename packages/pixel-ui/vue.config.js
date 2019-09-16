module.exports = {
  configureWebpack: config => {
    config.module.rules.forEach(v => {
      if (v.use) {
        let idx = v.use.findIndex(w => w.loader === 'thread-loader')
        if (idx !== -1) v.use.splice(idx, 1)
      }
    })
  },
  chainWebpack: config => {
    config.module.rule('ts').uses.delete('cache-loader')
    config.module.rule('tsx').uses.delete('cache-loader')
    config.module
      .rule('ts')
      .use('ts-loader')
      .loader('ts-loader')
      .tap(opts => {
        opts.transpileOnly = false
        opts.happyPackMode = false
        return opts
      })
  }
}
