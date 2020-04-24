import express from 'express'

import { DialogModel, MessageModel } from '../models'

class DialogController {
  index(req: express.Request, res: express.Response) {
    const userId: string = '5ea198b3c4629c52ae93a4d9'
    DialogModel.find()
      .or([{ author: userId }, { partner: userId }])
      .populate(['author', 'partner'])
      .exec()
      .then((dialog) => {
        if (dialog.length > 0) {
          res.json(dialog)
        } else {
          res.send('epty')
        }
      })
      .catch((err) => {
        res.sendStatus(404)
      })
  }
  create(req: express.Request, res: express.Response) {
    const { author, partner, text } = req.body
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
        res.json({ success: false, err })
      })
  }
  delete(req: express.Request, res: express.Response) {
    DialogModel.findOneAndRemove({ _id: req.params.id })
      .exec()
      .then((obj) => {
        res.json({ saccess: true, message: 'dialog removed' })
      })
      .catch((err) => {
        res.json({ success: false, err })
      })
  }
}

export default DialogController
