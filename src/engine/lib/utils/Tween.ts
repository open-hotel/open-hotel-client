import { Application } from "pixi.js";

export const Curves = {
    // no easing, no acceleration
    linear: (t:number) => t,
    // accelerating from zero velocity
    easeInQuad: (t:number) => t*t,
    // decelerating to zero velocity
    easeOutQuad: (t:number) => t*(2-t),
    // acceleration until halfway, then deceleration
    easeInOutQuad: (t:number) => t<.5 ? 2*t*t : -1+(4-2*t)*t,
    // accelerating from zero velocity 
    easeInCubic: (t:number) => t*t*t,
    // decelerating to zero velocity 
    easeOutCubic: (t:number) => (--t)*t*t+1,
    // acceleration until halfway, then deceleration 
    easeInOutCubic: (t:number) => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
    // accelerating from zero velocity 
    easeInQuart: (t:number) => t*t*t*t,
    // decelerating to zero velocity 
    easeOutQuart: (t:number) => 1-(--t)*t*t*t,
    // acceleration until halfway, then deceleration
    easeInOutQuart: (t:number) => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
    // accelerating from zero velocity
    easeInQuint: (t:number) => t*t*t*t*t,
    // decelerating to zero velocity
    easeOutQuint: (t:number) => 1+(--t)*t*t*t*t,
    // acceleration until halfway, then deceleration 
    easeInOutQuint: (t:number) => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
}


export function createTween ({
	start = 0,
	end = 1,
	duration = 1000,
	curve = Curves.linear
} = {}): Function {
	return (app: Application, callback: Function) => {
        let startTime:number,
        currentValue: number,
        progress: number;

		const firstFrame = (time: number) => {
			startTime    = time
			currentValue = start
			progress     = 0
			animate(time)
		}

        function animate (now:number) {
            const elapsed = now - startTime

			if (elapsed >= duration) {
                app.ticker.remove(animate)
                return currentValue < end && callback(end, progress, duration);
            }

			progress = elapsed / duration
			const value = start + (end - start) * curve(progress)

			callback(value, progress, elapsed)
        }
        
        app.ticker.addOnce(firstFrame).add(animate)		
	}
}