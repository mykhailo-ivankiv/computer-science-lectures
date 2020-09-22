export const JsonViewer = (initJSON) => {
  const rootElement = document.createElement('div')

  const update = (json) => (rootElement.innerHTML = JSON.stringify(json, null, '  '))

  update(initJSON)

  return {
    rootElement,
    update,
  }
}
