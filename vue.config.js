module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/_variables.scss";
        `,
      },
    },
  },
  chainWebpack: config => {
    config.externals({
      'pixi.js': 'PIXI',
    })
  },
}
