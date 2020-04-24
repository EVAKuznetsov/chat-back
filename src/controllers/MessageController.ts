import express from 'express'

import { MessageModel } from '../models'

class MessageController {
  index(req: express.Request, res: express.Response) {
    const dialog_id = req.params.dialog_id
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

  create(req: express.Request, res: express.Response) {
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

  delete(req: express.Request, res: express.Response) {
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
