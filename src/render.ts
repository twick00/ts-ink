import { isFunction } from 'lodash'
import process from 'process'
import { Options } from './shared'
import instances from './instances'
import Instance, { RenderInstance } from './instance'
import { WriteStream } from 'tty'

export const render = (node, options?: any) => {
  // Stream was passed instead of `options` object
  if (typeof options.write === 'function') {
    options = {
      stdout: options,
      stdin: process.stdin
    };
  }

  options = {
    stdout: process.stdout,
    stdin: process.stdin,
    debug: false,
    exitOnCtrlC: true,
    experimental: false,
    ...options
  };

  let instance;
  if (instances.has(options.stdout)) {
    instance = instances.get(options.stdout);
  } else {
    instance = new Instance(options);
    instances.set(options.stdout, instance);
  }

  instance.render(node);

  return {
    rerender: instance.render,
    unmount: () => instance.unmount(),
    waitUntilExit: instance.waitUntilExit,
    cleanup: () => instances.delete(options.stdout)
  };
};
