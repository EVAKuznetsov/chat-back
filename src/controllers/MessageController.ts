import { Response } from 'express'

import { MessageModel } from '../models'

class MessageController {
  index(req: any, res: Response) {
    const dialog_id = req.params.dialog_id
    console.log(req.user)
    MessageModel.find({ dialog: dialog_id })
      .populate(['dialog', 'user'])
      .exec()
      .then((messages) => {
        res.json(messages)
      })
      .catch(() => {
        res.sendStatus(404)
      })
  }

  create(req: any, res: Response) {
    const { text, dialog_id: dialog, user_id: user } = req.body
    const message = new MessageModel({ text, dialog, user })
    message
      .save()
      .then((obj) => {
        res.json({ success: true, message: 'message created', obj })
      })
      .catch((err) => {
        res.json({ success: false, err })
      })
  }

  delete(req: any, res: Response) {
    MessageModel.findByIdAndRemove(req.params.id)
      .exec()
      .then(() => {
        res.json({ saccess: true, message: 'message removed' })
      })
      .catch((err) => {
        res.json({ success: false, err })
      })
  }
}

export default MessageController
