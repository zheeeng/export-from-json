export interface Entry<V = any> extends Array<string | V> {
  0: string,
  1: V,
  length: 2,
}
