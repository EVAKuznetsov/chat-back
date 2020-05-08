import { Request, Response } from 'express'
import { Server } from 'socket.io'
import { DialogModel, MessageModel } from '../models'
import errorHandler from '../libs/errorHandler'

class DialogController {
  io: Server
  constructor(io: Server) {
    this.io = io
  }
  index = (req: any, res: Response) => {
    const userId: string = req.user ? req.user.id : ''
    DialogModel.find()
      .or([{ author: userId }, { partner: userId }])
      .populate([
        'author',
        'partner',
        { path: 'lastMessage', populate: { path: 'user' } },
      ])
      .exec()
      .then((dialog) => {
        res.json(dialog)
      })
      .catch((err) => {
        errorHandler(res, err)
      })
  }
  create = async (req: any, res: Response) => {
    const author: string = req.user ? req.user.id : ''
    const { partner, text } = req.body
    const isDialog = await DialogModel.findOne().or([
      { author: author, partner: partner },
      { author: partner, partner: author },
    ])
    if (author === partner)
      return res.status(403).json({
        status: 'error',
        message:
          'Нельзя создавать диалоги с самим собой. Найди друзей наконец!',
      })
    if (isDialog)
      return res
        .status(403)
        .json({ status: 'error', message: 'Такой диалог уже создан.' })

    const dialog = new DialogModel({ author, partner })
    dialog
      .save()
      .then((dialogObj) => {
        const message = new MessageModel({
          text,
          user: author,
          dialog: dialogObj._id,
        })
        message.save().then((messageObj) => {
          dialogObj.lastMessage = message._id
          dialogObj.save().then(() => {
            res.json({ dialog: dialogObj, message: messageObj })
            this.io.emit('SERVER:DIALOG_CREATED')
          })
        })
      })
      .catch((err) => {
        res.json({ status: 'error', err })
      })
  }
  delete(req: Request, res: Response) {
    DialogModel.findOneAndRemove({ _id: req.params.id })
      .exec()
      .then((obj) => {
        res.json({ status: 'true', message: 'dialog removed' })
      })
      .catch((err) => {
        res.json({ status: 'error', err })
      })
  }
}

export default DialogController
