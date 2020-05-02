import { Response } from 'express'
import { Server } from 'socket.io'
import errorHandler from '../libs/errorHandler'

import { MessageModel, DialogModel } from '../models'

class MessageController {
  io: Server
  constructor(io: Server) {
    this.io = io
  }
  index = (req: any, res: Response) => {
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

  create = (req: any, res: Response) => {
    const { text, dialog_id: dialog } = req.body
    const message = new MessageModel({ text, dialog, user: req.user.id })
    message
      .save()
      .then((obj: any) => {
        obj.populate(['dialog', 'user'], (err: any, message: any) => {
          if (err) return errorHandler(res, err)
          console.log(message.dialog._id)
          DialogModel.findByIdAndUpdate(
            message.dialog._id,
            {
              lastMessage: message._id,
            },
            { upsert: true }
          )
            .exec()
            .then((data: any) => console.log(data))
            .catch((err) => errorHandler(res, err))
          this.io.emit('NEW:MESSAGE', message)
          res.json({ status: 'success', message: 'message created', obj })
        })
      })
      .catch((err) => {
        res.status(500).json({ status: 'error', err })
      })
  }

  delete = (req: any, res: Response) => {
    MessageModel.findByIdAndRemove(req.params.id)
      .exec()
      .then(() => {
        res.json({ status: 'success', message: 'message removed' })
      })
      .catch((err) => {
        res.json({ status: 'error', err })
      })
  }
}

export default MessageController
