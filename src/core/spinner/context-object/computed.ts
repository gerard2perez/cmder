export class computed_<T> {
  constructor(public value: T) {}
}
export function computed<T = unknown>(n: T) {
  return new computed_(n)
}
