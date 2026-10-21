/* eslint-disable @typescript-eslint/no-explicit-any */
import { isTTYSupported } from '../terminal/istty'
export enum LogSymbols {
  /** 'ℹ' : 'i' */
  info = <any>(isTTYSupported ? 'ℹ' : 'i'),
  /** '✔' : '√' */
  success = <any>(isTTYSupported ? '✔' : '√'),
  /** '⚠' : '!!' */
  warning = <any>(isTTYSupported ? '⚠' : '!!'),
  /** '✖' : '×' */
  error = <any>(isTTYSupported ? '✖' : '×'),
  updated = <any>(isTTYSupported ? '✐' : '√'),
  deleted = <any>(isTTYSupported ? '🗑' : 'x'),
}
