interface ErrorBody {
  [key: string]: string[]
}

export class ValidationError extends Error {
  statusCode: number
  data: ErrorBody

  constructor(data: ErrorBody) {
    super('Invalid Request')
    this.name = 'ValidationError'
    this.statusCode = 400
    this.data = data
  }
}
