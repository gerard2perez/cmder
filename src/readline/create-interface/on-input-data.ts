import readline from 'node:readline/promises'
import { ReadStream } from 'node:tty'
export const KEYS = {
  UP: Buffer.from([27, 91, 65]),
  DOWN: Buffer.from([27, 91, 66]),
  RIGHT: Buffer.from([27, 91, 67]),
  LEFT: Buffer.from([27, 91, 68]),
  CANCEL: Buffer.from([27]),
  SIGINT: Buffer.from([3]),
}

export enum OnDataEvents {
  up_down = 'up_down',
  left_right = 'left_right',
  cancel = 'cancel',
  prompt = 'prompt',
}

export const onData = ({ input, rl }: { input: ReadStream; rl: readline.Interface }, e: Buffer) => {
  if (e.equals(KEYS.UP)) {
    input.emit(OnDataEvents.up_down, -1)
  } else if (e.equals(KEYS.DOWN)) {
    input.emit(OnDataEvents.up_down, 1)
  } else if (e.equals(KEYS.LEFT)) {
    input.emit(OnDataEvents.left_right, -1)
  } else if (e.equals(KEYS.RIGHT)) {
    input.emit(OnDataEvents.left_right, 1)
  } else if ([KEYS.CANCEL, KEYS.SIGINT].some((k) => e.equals(k))) {
    input.emit(OnDataEvents.cancel)
  } else {
    // console.log(e)
  }
  input.emit(OnDataEvents.prompt, rl.line.length > 0)
}
