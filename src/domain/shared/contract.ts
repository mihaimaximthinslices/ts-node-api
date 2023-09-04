export type Contract<T> = {
  [K in keyof T]: T[K] extends (args: infer Args) => infer Result
    ? Args extends undefined
      ? () => Result | Promise<Result>
      : (args: Args) => Result | Promise<Result>
    : never
}
