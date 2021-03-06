import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import { AlreadyExistsError, NotFoundError, ValidationError } from '~/errors'

export const errorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    err instanceof ValidationError ||
    err instanceof AlreadyExistsError ||
    err instanceof NotFoundError
  ) {
    res.status(err.statusCode)
    res.statusMessage = err.message
    res.send(err.data)
    return
  }

  res.status(500)
  res.statusMessage = 'Server Error'
  res.send(err.toString())
}
