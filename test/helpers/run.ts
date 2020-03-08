import { spawn } from 'node-pty'

export default (fixture: string, { env }: { env?: any } = {}) => {
  return new Promise<string>((resolve, reject) => {
    const term = spawn(
      'yarn',
      ['ts-node', `${__dirname}/../fixtures/${fixture}`],
      {
        name: 'xterm-color',
        cols: 100,
        cwd: __dirname,
        env: {
          ...process.env,
          ...env
        }
      }
    )

    let output = ''
    term.onData(data => {
      output += data
    })

    term.onExit(({ exitCode }) => {
      if (exitCode === 0) {
        resolve(output)
        return
      }
      const outputText = `Process exited with a non-zero code: ${output}`
      reject(new Error(outputText))
    })
  })
}
