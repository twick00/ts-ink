import sliceAnsi from 'slice-ansi'
import stringLength from 'string-length'

export default class Output {
  private readonly width: number
  private readonly height: number
  private readonly writes: Array<{
    x: number
    y: number
    text: string
    transformers: any[]
  }>
  constructor({ width, height }: { width: number; height: number }) {
    this.width = width
    this.height = height
    this.writes = []
    // Initialize output array with a specific set of rows, so that margin/padding at the bottom is preserved
  }

  write(
    x: number,
    y: number,
    text: string | undefined,
    { transformers }: { transformers: any[] }
  ) {
    if (!text) {
      return
    }

    this.writes.push({ x, y, text, transformers })
  }

  get() {
    const output: string[] = []

    for (let y = 0; y < this.height; y++) {
      output.push(' '.repeat(this.width))
    }

    for (const write of this.writes) {
      const { x, y, text, transformers } = write
      const lines = text.split('\n')
      let offsetY = 0

      for (let line of lines) {
        const currentLine = output[y + offsetY]

        // Line can be missing if `text` is taller than height of pre-initialized `this.output`
        if (!currentLine) {
          continue
        }

        const length = stringLength(line)

        for (const transformer of transformers) {
          line = transformer(line)
        }
        output[y + offsetY] =
          sliceAnsi(currentLine, 0, x) +
          line +
          sliceAnsi(currentLine, x + length)

        offsetY++
      }
    }

    const generatedOutput = output.map(line => line.trimRight()).join('\n')

    return {
      output: generatedOutput,
      height: output.length
    }
  }
}
