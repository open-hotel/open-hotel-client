const fs = require('fs')
const path = require('path')

const filesPath = path.join(__dirname, './assets')

const files = fs.readdirSync(filesPath)

console.log('⚙️ Renaming files and removing that anoying id!')

for (const filename of files) {
  if (filename === '.gitkeep') {
    continue
  }
  const newFilename = filename.replace(/^\d+_/g, '')
  fs.renameSync(path.join(filesPath, filename), path.join(filesPath, newFilename))
  console.log('renamed', filename, 'to', newFilename)
}

console.log('Done!')
