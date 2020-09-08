# Contributing to Open Hotel

We really appreciate the effort from those who are willing to contribute to this project.
The objective of this guideline is to provide a clear explanation of how the project works
and how you can help us on making it better.

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
  * [How the project is divided](#how-the-project-is-divided)

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Writing Tests](#writing-tests)

* [Development Environment](#development-environment)
* [New assets](#new-assets)
* [Links](#links)

### How the project is divided

Open Hotel is divided in 3 main repositories:

#### [Pixel UI](https://github.com/open-hotel/pixel-ui)

Pixel is our front-end UI component lib. Here we code window components, buttons, and all sorts of
immersive UI. We do it by using [Vue.js](https://vuejs.org/) in [lib build target](https://cli.vuejs.org/guide/build-targets.html).

#### [Open Hotel Client](https://github.com/open-hotel/open-hotel-client)

This is the client repository. It is responsible for handling sprites and game logic
using [PIXI.js](https://www.pixijs.com/), showing UI up with [Pixel UI](https://github.com/open-hotel/pixel-ui)
and [Vue.js](https://vuejs.org/).

It is also here where we store all [Texture Packer](https://www.codeandweb.com/texturepacker) projects.
We use Texture Packer to manage all the [sprite images](https://techterms.com/definition/sprite) and bundle them together
into [spritesheets](https://www.codeandweb.com/what-is-a-sprite-sheet), so we can load the correct images when needed.

#### [Orion Emulator](https://github.com/open-hotel/orion-emulator)

Orion is responsible for handling back-end stuff.
We have to make sure that users see the same things happening on the screen, and that is Orions task.

### Reporting Bugs

If you checked something that you think is not expected behaviour,
please [open an issue](https://github.com/open-hotel/open-hotel-client/issues/new).
This way you can help us to track down what works and what does not.

### Writing Tests

The project uses [Jest](https://jestjs.io/) for unit tests. To assure that everything works
just fine, it is important to test functionalities. If there is something that you noticed that is not tested,
please [open an issue](https://github.com/open-hotel/open-hotel-client/issues/new) and write a test!

### Development Environment

If you want to run all projects at once, you can check out our [docker kit](https://github.com/open-hotel/docker-kit).

We highly recommend using [yarn](https://yarnpkg.com/lang/en/) to install dependencies.
Just install yarn and run:
```bash
# to install dependencies
yarn
```

You can check out our [npm scripts](https://docs.npmjs.com/misc/scripts) in the [package.json](https://github.com/open-hotel/open-hotel-client/blob/master/package.json)
file. These are:

#### yarn dev
It starts an application server in development mode with [vue-cli](https://cli.vuejs.org/).
You can access it on the browser.

#### yarn build
Builds the application in production mode.

#### yarn test
Runs jest to run all test suites. It's useful when you want to check if
tests are passing just once.

#### testW
Runs jest and waits for file changes. It's useful when developing tests.

### renameAssets
Renames all assets under [](commands/renameAssets/assets) folder, removing the first digit of a file named by the convention
[someId]_[filename]. It basically removes [someId] and renames the file to just [filename].
It is specially useful when handling (new assets)[#new-assets]

## New assets
If you want to implement a new mobi or sprite that is in Habbo but not here yet, you can find
textures [at this link](https://mega.nz/#F!npY2zKbA!Hb44FoY2dwtvuEOYK-YYuA) and decompile it [here](https://pdfrecover.herokuapp.com/swfdecompiler/).

### Decompiling swf files
Before decompiling files, if you want to extract textures, do not forget to check the <b>Image</b>
checkbox on the [decompiler](pdfrecover.herokuapp.com/swfdecompiler) website. This way you can
throw away all the flash code and get only the sprite images.

### Naming conventions
On human sprites, there is a file / sprite naming convention you should know to handle the sprites.

That is <b>
(lib          _size  _action   _type  _id   _direction   _frame)
hh_human_body _h     _std      _hd    _2    _0           _0
</b>

For example, one of the hair sprites is called:

hair_F_backbun_h_std_hrb_2321_0_0.png

Where <b>hair_F_backbun_h</b> is the `object prefix`, <b>spk</b> (speak) is the `action`, <b>hrb</b> (hatless)
is the `layer name`, <b>2321</b> is the `type`, <b>0</b> is the `direction` and <b>0</b> is the animation frame.

#### Direction
Directions can vary from 0 to 7, revolving clock-wise.

For example:
<pre>
#### Direction 0
. * .
. | .
. | .

#### Direction 1
. . *
. / .
/ . .

#### Direction 2
. . .
— — *
. . .

#### Direction 3
\ . .
. \ .
. . *

#### Direction 4
. | .
. | .
. * .

#### Direction 5
. .
. / .
* . .

#### Direction 6
. . .
* — —
. . .

#### Direction 7
* . .
. \ .
. . \
</pre>

#### Animation Frame
Non-animated sprites contain only the animation frame 0.

## Links
[Follow our Facebook Page](https://www.facebook.com/openhabbohotel/)
This guideline is based on [Atom contribution guide](https://github.com/atom/atom/blob/master/CONTRIBUTING.md).
