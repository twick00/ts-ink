import { execSync } from 'child_process'
import { memoize } from 'lodash'


export default memoize(() => execSync("yarn --version").toString())
