interface ErrorBody {
  [key: string]: string[]
}

export class NotFoundError extends Error {
  statusCode: number
  data: ErrorBody

  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = 404
    this.data = { error: [message] }
  }
}
