import BEM from '../../../utils/BEM.js'
const b = BEM('SrcViewer')

export const SrcViewer = (initValue, onChange) => {
  const rootElement = document.createElement('div')
  rootElement.className = b()
  rootElement.innerHTML = [
    `<textarea id="input" class="${b('input')}">${initValue}</textarea>`,
    `<div id="highlighter" class="${b('input-highlighter')}"/>`,
  ].join('')

  const inputEl = rootElement.querySelector('#input')
  const highlightEl = rootElement.querySelector('#highlighter')

  const updateHighlighter = (htmlString) => (highlightEl.innerHTML = htmlString)
  inputEl.addEventListener('input', (ev) => {
    const { value } = ev.target
    onChange(value)
  })

  setTimeout(() => onChange(initValue), 0)

  return {
    rootElement,
    updateHighlighter,
  }
}
