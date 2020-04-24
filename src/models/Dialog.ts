import { model, Document, Schema } from 'mongoose'

export interface IDialog extends Document {
  author: Schema.Types.ObjectId;
  partner: Schema.Types.ObjectId;
  lastMessage?: string;
  createdAt?: Date;
}

const DialogSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    partner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    lastMessage: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
)
const DialogModel = model<IDialog>('Dialog', DialogSchema)

export default DialogModel
