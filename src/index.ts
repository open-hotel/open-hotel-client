import { Application } from "./engine/Application";
import { SplashScreen } from './stages/SplashScreen';
import { Log } from "./engine/lib/Logger";
import { HomeScreen } from "./stages/HomeScreen";
import * as WebFont from "webfontloader";
import { PathFinder } from "./Pathfinder";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const app = Application.get({
    logLevel: Log.INFO,
    antialias: false,
    autoDensity: true,
    resolution: devicePixelRatio,
    forceCanvas: true
})

app.$router.setRoutes({
    splash: SplashScreen,
    home  : HomeScreen
})

WebFont.load({
    google: {
        families: ['Ubuntu'],
    },
    custom: {
        families: ['Volter'],
        urls: ['resources/fonts/Volter/Volter.css']
    },
    active() {
        app.$router.replace('splash')
    }
});