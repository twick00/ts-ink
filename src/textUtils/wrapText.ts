import wrapAnsi from 'wrap-ansi'
import cliTruncate from 'cli-truncate'

export default (text: string, maxWidth: number, { textWrap }: { textWrap?: string } = {}) => {
  if (textWrap === 'wrap') {
    return wrapAnsi(text, maxWidth, {
      trim: false,
      hard: true
    })
  }

  if (String(textWrap).startsWith('truncate')) {
    let position: 'end' | 'middle' | 'start'

    if (textWrap === 'truncate' || textWrap === 'truncate-end') {
      position = 'end'
    }

    if (textWrap === 'truncate-middle') {
      position = 'middle'
    }

    if (textWrap === 'truncate-start') {
      position = 'start'
    }

    return cliTruncate(text, maxWidth, { position: position })
  }

  return text
}
