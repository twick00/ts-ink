import { EOL } from 'os'
import { spawn } from 'node-pty'
import ProcessEnv = NodeJS.ProcessEnv
import fs from 'fs'

export default (fixture: string, { env }: { env?: any } = {}) => {
  return new Promise<string>((resolve, reject) => {
    const term = spawn(
      'yarn',
      ['--silent', 'ts-node', `${__dirname}/../fixtures/${fixture}`],
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
