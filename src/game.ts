import { Application } from './engine/Application'
import { Log } from './engine/lib/Logger'
import { load as loadWebFonts } from 'webfontloader'
import * as PIXI from 'pixi.js'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
PIXI.settings.FILTER_RESOLUTION = window.devicePixelRatio

const app = Application.get({
  logLevel: Log.INFO,
  antialias: false,
  autoDensity: true,
  resolution: devicePixelRatio,
  forceCanvas: true,
})

const stagesLoaded = Promise.all([import('./stages/SplashScreen'), import('./stages/HomeScreen')]).then(
  ([splash, home]) => {
    app.$router.setRoutes({
      splash: splash.SplashScreen,
      home: home.HomeScreen,
    })
  },
)

loadWebFonts({
  google: {
    families: ['Ubuntu'],
  },
  custom: {
    families: ['Volter'],
    urls: ['resources/fonts/Volter/Volter.css'],
  },
  active() {
    stagesLoaded.then(() => app.$router.replace('splash'))
  },
})
