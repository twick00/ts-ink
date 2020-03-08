import { spawn } from 'node-pty'
import yarnVersion from './yarnVersion'

export default (fixture: string, { env }: { env?: any } = {}) => {
  const command = yarnVersion().startsWith('2')
    ? { cmd: 'yarn', opts: [] }
    : { cmd: 'yarn', opts: ['--silent'] }

  return new Promise<string>((resolve, reject) => {
    const term = spawn(
      command.cmd,
      [...command.opts, 'ts-node', `${__dirname}/../fixtures/${fixture}`],
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
