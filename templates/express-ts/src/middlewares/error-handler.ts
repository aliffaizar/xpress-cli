import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../libs/errors/custom-error'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serializeErrors())
  }

  res.status(500).json({ message: 'Something went wrong' })
}
