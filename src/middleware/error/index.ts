import { Request, Response, NextFunction } from 'express'

import { GenericAPIError } from '@/util/classes'

// Init
import Debug from 'debug'
const debug = Debug(`Server:middleware Error Handler`)

export default (
  err: Error | GenericAPIError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { message, stack } = err
  const { messageArray, status = 500 } = err as GenericAPIError

  debug(stack)

  res.status(status).json({
    error: {
      code: status,
      message,
      errors: messageArray,

      // Only send stack if we are in development
      stack: process.env.NODE_ENV === 'development' ? stack : undefined,
    },
  })
}
