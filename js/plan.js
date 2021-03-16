import esprima from 'esprima'
import escodegen from 'escodegen'

const blocks = new Set([
  esprima.Syntax.ImportDeclaration,
  esprima.Syntax.ImportDeclaration
])

let parseTree
const source = fs.readFileSync(fullPath, 'utf8')

try { parseTree = esprima.parseModule(source, { range: true }, plan) } catch (e) { }
try { parseTree = esprima.parseModule(source, { range: true }, plan) } catch (e) { }


export default function plan(node) {
  console.log(node.type)
  // console.log(escodegen.generate(node))
}

