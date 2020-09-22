export const generateHTMLFromAst = (astNode, prefix = '') => {
  const node = `${prefix}<span>${astNode.type}</span>`
  const newPrefix = prefix === '' ? '\n    ' : `${prefix}    `
  const children = astNode.nodes
    ? astNode.nodes?.map((astNode) => generateHTMLFromAst(astNode, newPrefix)).join('')
    : ''

  return `${node}${children}`
}

export const AstTreeViewer = (ast) => {
  const rootElement = document.createElement('div')
  const update = (ast) => (rootElement.innerHTML = generateHTMLFromAst(ast))

  update(ast)
  return { rootElement, update }
}
