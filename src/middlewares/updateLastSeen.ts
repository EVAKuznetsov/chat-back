import express from 'express'
import { UserModel } from '../models'

const updateLastSeen = (
  req: any,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.user) {
    UserModel.findByIdAndUpdate(
      req.user.id,
      { last_seen: new Date() },
      { new: true }
    )
      .exec()
      .then((obj) => console.info(obj?.last_seen))
      .catch((err) => {
        res.json({ success: false, err })
      })
  }
  next()
}
export default updateLastSeen
