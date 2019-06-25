import * as PIXI from 'pixi.js'

const isoPoint = (x, y, z = 0) => ({
    x: (x - y),
    y: ((y + x) / 2) - z
})

//Create a Pixi Application
let app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

function colorShade (color, light = 0) {
    color = color.toString(16)

    let R = Math.max(Math.min(255, parseInt(color.substring(0, 2), 16) + light), 0).toString(16)
    let G = Math.max(Math.min(255, parseInt(color.substring(2, 4), 16) + light), 0).toString(16)
    let B = Math.max(Math.min(255, parseInt(color.substring(4, 6), 16) + light), 0).toString(16)

    R = R.length < 2 ? '0' + R : R
    G = G.length < 2 ? '0' + G : G
    B = B.length < 2 ? '0' + B : B

    return parseInt([R, G, B].join(''), 16)
}

function createCube(x, y, z = 0, w = 50, h = 25, d = 25, color = 0x888888, opacity = 1) {
    x += w;
    z -= h;

    const faces = [
        [
            isoPoint(x, y, z),
            isoPoint(x + w, y, z),
            isoPoint(x + w, y + h, z),
            isoPoint(x, y + h, z),
        ],
        [
            isoPoint(x, y, z + d),
            isoPoint(x + w, y, z + d),
            isoPoint(x + w, y + h, z + d),
            isoPoint(x, y + h, z + d),
        ],
        [
            isoPoint(x, y + h, z + d),
            isoPoint(x + w, y + h, z + d),
            isoPoint(x + w, y + h, z),
            isoPoint(x, y + h, z),
        ],
        [
            isoPoint(x + w, y, z + d),
            isoPoint(x + w, y, z),
            isoPoint(x + w, y + h, z),
            isoPoint(x + w, y + h, z + d),
        ],
    ]
    
    let face;
    let f = 0;
    
    while (face = faces.shift()) {
        const g = new PIXI.Graphics()
        
        
        if (f == 1) {
            g.beginFill(colorShade(color, 0), opacity)
            g.lineStyle(2, colorShade(color, -8))
        }
        if (f == 2) g.beginFill(colorShade(color, -70), opacity)
        if (f == 3) g.beginFill(colorShade(color, -30), opacity)

        let p = face.shift()

        g.moveTo(p.x, p.y)
        
        while (p = face.shift()) {
            g.lineTo(p.x, p.y)
        }

        g.closePath()
        f++
        app.stage.addChild(g)
    }

}

const map = `
11111111111
11111111111
11100002111
11100003111
11100002111
11111111111
11111111111
11111111111
`

function parseMap(str) {
    return str.replace(/[\D\n]|^\n|\n$/, '').split('\n').reduce((acc, linha, y) => {
        const blocks = linha.split('').map((z, x) => ({ x, y, z: parseInt(z) }))
        return acc.concat(blocks)
    }, [])
}

let size = 40;
let zHeight = 20;

parseMap(map).forEach(block => {
    if (block.z > 0) {
        createCube(size * block.x, size * block.y, zHeight * block.z, size, size, 6, 0x969662)
    }
})
