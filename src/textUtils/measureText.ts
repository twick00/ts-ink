import widestLine from 'widest-line'

export default function(text: string): { width: number; height: number } {
  const width = widestLine(text)
  const height = text.split('\n').length as number

  return { width, height }
}
