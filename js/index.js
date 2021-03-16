import fs from 'fs'
import path from 'path'
import plan from './plan.js'
import esprima from 'esprima'

const excludeExts = new Set(['.json', '.md'])
const excludeDirs = new Set(['node_modules', '.git', 'assets', 'dist'])
const excludeFile = new Set(['bundle.js', 'bundle.js.map', '.gitignore'])

function walk(dir, files = {}) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)

    if (fs.lstatSync(fullPath).isDirectory() && !excludeDirs.has(file))
      walk(fullPath, files)

    else if (
      fs.lstatSync(fullPath).isFile()
      && !excludeExts.has((file.match(/\..+/g) || []).pop())
      && !excludeFile.has(file)
    ) {
      let parseTree
      const source = fs.readFileSync(fullPath, 'utf8')

      try { parseTree = esprima.parseModule(source, { range: true }) } catch (e) { }
      try { parseTree = esprima.parseModule(source, { range: true }) } catch (e) { }

      files[fullPath] = parseTree
    }
  }

  return files
}

const files = walk('/Users/trumanpurnell/Workspace/labs/chess')

plan(files['/Users/trumanpurnell/Workspace/labs/chess/model/index.js'])