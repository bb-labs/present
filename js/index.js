import fs from 'fs'
import path from 'path'

const excludeExts = new Set(['.json', '.md'])
const excludeDirs = new Set(['node_modules', '.git', 'assets', 'dist'])
const excludeFile = new Set(['bundle.js', 'bundle.js.map', '.gitignore'])

export default function walk(tree) {
  const files = []

  if (fs.lstatSync(tree).isFile()) {
    files.push(tree)

    return files
  }

  for (const file of fs.readdirSync(tree)) {
    if (!excludeDirs.has(file)
      && !excludeExts.has((file.match(/\..+/g) || []).pop())
      && !excludeFile.has(file))
      files.push(...walk(path.join(tree, file)))
  }

  return files
}

console.log(walk('/Users/trumanpurnell/Workspace/labs/chess'))
