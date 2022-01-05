interface ErrorBody {
  [key: string]: string[]
}

export class AlreadyExistsError extends Error {
  statusCode: number
  data: ErrorBody

  constructor(field: string, message: string) {
    super('Invalid Request')
    this.name = 'AlreadyExistsError'
    this.statusCode = 400
    this.data = { [field]: [message] }
  }
}
