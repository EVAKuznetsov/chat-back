import { Response } from 'express'

const errorHandler = (res: Response, err: any) => {
  res.status(500).json({
    success: false,
    message: err.message ? err.message : err,
  })
}
export default errorHandler
