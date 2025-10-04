/**
 * Translation function - same logic as own-react
 * @param {string} s - String with translations in format [en]English text[/en][ru]Русский текст[/ru]
 * @param {string} lang - Language code (en, ru)
 * @returns {string}
 */
export const translate = (s, lang) => {
  if (!s || s[0] !== '[') {
    return s
  }

  const langMap = new Map()

  let offset = 0
  while (offset < s.length) {
    if (s[offset] !== '[' || s[offset + 3] !== ']') {
      return s
    }

    const currentLang = s.slice(offset + 1, offset + 3)

    let endIndex = s.indexOf(`[`, offset + 4)
    while (
      !(s[endIndex + 1] === '/' && s.slice(endIndex + 2, endIndex + 4) === currentLang && s[endIndex + 4] === ']') &&
      typeof s[endIndex] !== 'undefined'
    ) {
      endIndex = s.indexOf(`[`, endIndex + 1)
    }

    if (typeof s[endIndex] === 'undefined') {
      return s
    }

    langMap.set(currentLang.toLowerCase(), s.slice(offset + 4, endIndex))

    offset = endIndex + 5
  }

  return langMap.get(lang.toLowerCase()) || langMap.get('en') || langMap.get(s.slice(1, 3).toLowerCase())
}
