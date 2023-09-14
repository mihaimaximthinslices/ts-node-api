export interface IResponse {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  sendJsonResponse: (status: number, response: any) => void
}
