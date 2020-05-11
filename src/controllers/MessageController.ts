import { Request, Response } from 'express'
import { Server } from 'socket.io'
import errorHandler from '../libs/errorHandler'

import { MessageModel, DialogModel } from '../models'

class MessageController {
  io: Server
  constructor(io: Server) {
    this.io = io
  }
  index = async (req: any, res: Response) => {
    const dialog_id = req.query.dialog_id || ''
    const userId = req.user.id
    try {
      //обновим статус сообщений собеседника на прочитанные
      await MessageModel.update(
        { dialog: dialog_id, user: { $ne: userId } },
        { $set: { readed: true } },
        { multi: true }
      )
      const messages = await MessageModel.find({ dialog: dialog_id })
        .populate(['dialog', 'user'])
        .exec()

      res.json(messages)
    } catch (error) {
      errorHandler(res, error)
    }
  }

  create = (req: any, res: Response) => {
    const { text, dialog_id: dialog } = req.body
    const user = req.user.id ? req.user.id : ''
    const message = new MessageModel({ text, dialog, user })
    message
      .save()
      .then((obj: any) => {
        obj.populate(['dialog', 'user'], (err: any, message: any) => {
          if (err) return errorHandler(res, err)
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
          this.io.emit('SERVER:MESSAGE_CREATED', message)
          this.io.emit('SERVER:LAST_MESSAGE_CHANGED', message)
          res.json({ status: 'success', message })
        })
      })
      .catch((err) => {
        res.status(500).json({ status: 'error', err })
      })
  }

  delete = async (req: any, res: Response) => {
    const messageId = req.params.id
    const userId = req.user.id
    try {
      const message: any = await MessageModel.findOneAndRemove({
        _id: messageId,
        user: userId,
      })
      console.log(message)
      if (!message)
        return res
          .status(404)
          .json({ status: 'error', message: 'сообщения нет в базе' })

      const lastMessageOnThisDialog: any = await MessageModel.findOne({
        dialog: message.dialog._id,
      })
        .sort({ createdAt: -1 })
        .populate(['dialog', 'user'])
        .exec()
      const thisDialog = await DialogModel.findByIdAndUpdate(
        message.dialog._id,
        {
          lastMessage: lastMessageOnThisDialog
            ? lastMessageOnThisDialog._id
            : null,
        }
      ).exec()
      if (thisDialog) {
        this.io.emit('SERVER:MESSAGE_REMOVED', message)
        this.io.emit('SERVER:LAST_MESSAGE_CHANGED', lastMessageOnThisDialog)
        res.json({ status: 'success', message: 'message removed' })
      }
    } catch (err) {
      errorHandler(res, err)
    }
  }
}

export default MessageController
