const ELEMENT_SEPARATOR = '__'
const MODIFIER_SEPARATOR = '--'

const getBEMPAth = (b, e, m) => {
  const base = e !== '' ? [b, e].join(ELEMENT_SEPARATOR) : b

  return `${base} ${m.reduce((str, m) => `${str} ${base}${MODIFIER_SEPARATOR}${m}`, '')}`
}

const b = (b) => (elementName, modifiers = []) => {
  modifiers = typeof elementName === 'string' ? modifiers : elementName || []

  return getBEMPAth(
    b,
    typeof elementName === 'string' ? elementName : '',
    Array.isArray(modifiers)
      ? modifiers.filter(Boolean)
      : Object.entries(modifiers)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key),
  )
}

export default b
