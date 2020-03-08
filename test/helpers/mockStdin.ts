import EventEmitter from 'events'

export class MockStdin extends EventEmitter.EventEmitter {
  setEncoding: () => void
  setRawMode: (isEnabled?: boolean) => void
  isTTY: boolean
  resume: Function
  pause: Function
  constructor(
    public options: {
      setRawMode: (isEnabled?: boolean) => void
      isTTY: boolean
      resume: Function
      pause: Function
      setEncoding: () => void
    }
  ) {
    super()
    this.setEncoding = options.setEncoding
    this.setRawMode = options.setRawMode
    this.isTTY = options.isTTY
    this.resume = options.resume
    this.pause = options.pause
  }
}
