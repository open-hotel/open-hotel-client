# Pixel UI

Pixel UI is a Vue.js based lib that implements Habbo UI components.
It is being designed for [Open Hotel](https://github.com/open-hotel/open-hotel-client).

Check out the [demo](https://pixel-ui.netlify.com/#/).

It is still an on-going project, so contributions are more than welcomed!

## Install

```bash
yarn add @open-hotel/pixel
# or
npm install @open-hotel/pixel
```

## Usage

You can install all the UI components

```js
import { PixelUI } from '@open-hotel/pixel'
import Vue from 'vue'

Vue.use(PixelUI)
```

Or use them separetely

```js
// MyComponent.vue
import { Button as PxBtn } from '@open-hotel/pixel'

export default {
  components: {
    PxBtn
  }
}
```
