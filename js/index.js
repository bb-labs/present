import fs from 'fs'
import path from 'path'
import esprima from 'esprima'
import escodegen from 'escodegen'

export default class Presentation {
  constructor({ repo, excludeDirs, excludeExts, excludeFile }) {
    this.plan = {}

    this.excludeDirs = new Set(excludeDirs)
    this.excludeExts = new Set(excludeExts)
    this.excludeFile = new Set(excludeFile)

    this.walk(repo).forEach(path => {
      const source = fs.readFileSync(path, 'utf8')

      this.plan[path] = { imports: {}, exports: {}, classes: {}, functions: {} }

      try { esprima.parseModule(source, { range: true }, this.createPlan.bind(this, path)) } catch (e) { }
      try { esprima.parseScript(source, { range: true }, this.createPlan.bind(this, path)) } catch (e) { }

    }, this)
  }

  createPlan(path, node) {
    switch (node.type) {
      case esprima.Syntax.ImportDeclaration:
        return this.plan[path].imports[node.source.value] = escodegen.generate(node)

      case esprima.Syntax.MethodDefinition:
        return this.plan[path].functions[node.key.name] = escodegen.generate(node)

      case esprima.Syntax.ClassDeclaration:
        return this.plan[path].classes[node.id.name] = escodegen.generate(node)

      case esprima.Syntax.ExportDefaultDeclaration:
        return this.plan[path].exports.default = escodegen.generate(node)
    }
  }

  walk(tree) {
    const files = []

    if (fs.lstatSync(tree).isFile()) {
      files.push(tree)

      return files
    }

    for (const file of fs.readdirSync(tree)) {
      if (!this.excludeDirs.has(file)
        && !this.excludeExts.has((file.match(/\..+/g) || []).pop())
        && !this.excludeFile.has(file))
        files.push(...this.walk(path.join(tree, file)))
    }

    return files
  }
}

new Presentation({
  repo: '/Users/trumanpurnell/Workspace/labs/chess/view/components/App.jsx',
  excludeExts: ['.json', '.md'],
  excludeDirs: ['node_modules', '.git', 'assets', 'dist'],
  excludeFile: ['bundle.js', 'bundle.js.map', '.gitignore'],
})