export class Ref<T> {
  constructor(public value: T) {}
}
export function ref<T = unknown>(n: T) {
  return new Ref(n)
}
export function isRef(value: unknown): value is Ref<unknown> {
  return value instanceof Ref
}
