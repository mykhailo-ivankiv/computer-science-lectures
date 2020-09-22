import { SrcViewer } from '../SrcViewer/SrcViewer.js'
import { JsonViewer } from '../JsonViewer/JsonViewer.js'
import BEM from '../../../utils/BEM.js'
import { splitBy, identity, reduce, last, init } from '../../../utils/utils.js'
import { subtractInterval } from '../../../utils/intervals.js'
const b = BEM('AST-explorer')

const highlightSrc = (src, props) => {
  const brakes = props.flatMap(({ source: { start, end } }) => [start, end])
  const parts = splitBy(brakes, src)

  return parts
    .map((part, i) =>
      i % 2 === 1 ? `<span style="${props[(i - 1) / 2]?.style}">${part}</span>` : `<span>${part}</span>`,
    )
    .join('')
}

const getHighlightsFromAst = (astNode) => {
  // prettier-ignore
  const style = astNode.type === 'decl' ? 'color: hsl(204,  70%, 53%);'
              : astNode.type === 'rule' ? 'background: hsl(192,  15%, 94%);'
              :  ""

  const childrenNodes = (astNode.nodes
    ? astNode.nodes?.flatMap((astNode) => getHighlightsFromAst(astNode))
    : []
  ).map((node) => ({ ...node, style: `${style}; ${node.style}` }))

  const intervalsForSubtract = childrenNodes.map(({ source }) => source)

  const sources = reduce(
    (acc, intervalForSubtraction) => {
      const interval = last(acc)
      const result = init(acc)

      return [...result, ...subtractInterval(interval, intervalForSubtraction)]
    },
    [astNode.source],
    intervalsForSubtract,
  )

  const nodes = sources.map((source) => ({ source, style }))

  return [...nodes, ...childrenNodes].filter(identity).sort((A, B) => A.source.start - B.source.start)
}

export const AstExplorer = (initSrc, parser, onData) => {
  const rootElement = document.createElement('div')
  rootElement.innerHTML = `
<div class="${b()}">
    <div class="${b('input-placeholder')}"></div>
    <div class="${b('result', ['json'])} "></div>
</div>`

  const initAst = parser(initSrc)

  const jsonViewer = JsonViewer(initAst)
  const srcViewer = SrcViewer(initSrc, (src) => {
    const ast = parser(src)
    jsonViewer.update(ast)

    const highlights = getHighlightsFromAst(ast)

    srcViewer.updateHighlighter(highlightSrc(src, highlights))
    onData(src)
  })

  rootElement.querySelector('.AST-explorer__input-placeholder').append(srcViewer.rootElement)
  rootElement.querySelector('.AST-explorer__result.AST-explorer__result--json').append(jsonViewer.rootElement)

  return { rootElement }
}
