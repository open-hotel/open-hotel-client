interface SheetFile {
  [type: string]: 'sheet.json'
}

interface Sheet {
  [module: string]: {
    [subModule: string]: string[] | SheetFile
  }
}

const sheet: Sheet = {
  human: {
    head: ['1'],
    body: ['1'],
    left_hand: ['1'],
    right_hand: ['1'],
    hair: ['1', '2321'],
  },
}

for (const modKey in sheet) {
  const mod = sheet[modKey]
  for (const subModKey in mod) {
    const files = mod[subModKey] as string[]
    const to: SheetFile = (mod[subModKey] = {})
    files.forEach(file => (to[file] = 'sheet.json'))
  }
}

export default sheet
