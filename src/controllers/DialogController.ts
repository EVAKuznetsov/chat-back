import { Request, Response } from 'express'
import { Server } from 'socket.io'
import { DialogModel, MessageModel } from '../models'

class DialogController {
  io: Server
  constructor(io: Server) {
    this.io = io
  }
  index(req: any, res: Response) {
    const userId: string = req.user ? req.user.id : ''
    console.log(req.user)
    DialogModel.find()
      .or([{ author: userId }, { partner: userId }])
      .populate(['author', 'partner', 'lastMessage'])
      .exec()
      .then((dialog) => {
        if (dialog.length > 0) {
          res.json(dialog)
        } else {
          res.send('empty')
        }
      })
      .catch((err) => {
        res.sendStatus(404)
      })
  }
  create(req: any, res: Response) {
    const author: string = req.user ? req.user.id : ''
    const { partner, text } = req.body
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
          res.json({ dialog: dialogObj, message: messageObj })
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
