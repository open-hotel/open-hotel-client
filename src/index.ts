import { Application } from "./engine/Application";
import { SplashScreen } from './stages/SplashScreen';
import { Log } from "./engine/lib/Logger";
import { HomeScreen } from "./stages/HomeScreen";
import { Container } from "pixi.js";

const app = Application.get({
    logLevel: Log.ALL,
    logContext: ['navigation', 'scene']
})

app.$router.setRoutes({
    splash: SplashScreen,
    home  : HomeScreen
}, 'splash')