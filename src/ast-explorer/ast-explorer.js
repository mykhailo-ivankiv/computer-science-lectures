import cssParser from '../css-parser.js'

const init = (initValue, onData) => {
  const inputEl = document.querySelector('.AST-explorer__input')
  const highlightEl = document.querySelector('.AST-explorer__input-highlighter')
  const result = document.querySelector('.AST-explorer__result')

  const setValue = (str) => {
    highlightEl.innerHTML = str
    result.innerHTML = JSON.stringify(cssParser(str), null, "  ")

    onData(str)
  }

  inputEl.value = initValue
  setValue(initValue)

  inputEl.addEventListener('input', (ev) => {
    setValue(ev.target.value)
  })
}

export default init(localStorage.getItem('src'), (value) => {
  localStorage.setItem('src', value)
})
