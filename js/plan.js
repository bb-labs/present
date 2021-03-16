import esprima from 'esprima'

const leaves = new Set([
  esprima.Syntax.ImportDeclaration
])

export default function plan(tree) {
  if (!tree || !tree['declaration'] || !tree['body'])
    return

  console.log(tree)
  console.log('------------------------------')

  if (tree['declaration'])
    plan(tree['declaration'])

  if (!(Symbol.iterator in Object(tree['body'])))
    plan(tree['body'])

  for (const element of tree['body'] || []) {
    if (!leaves.has(element.type))
      plan(element)
  }
}