import { AstExplorer } from './components/AstExplorer/AstExplorer.js'
import cssParser from '../parsers/css-parser.js'

const init = () => {
  const src = localStorage.getItem('src') || ''

  const { rootElement } = AstExplorer(src, cssParser, (value) => {
    localStorage.setItem('src', value)
  })

  document.body.append(rootElement)
}

init()
