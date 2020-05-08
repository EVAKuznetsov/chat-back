import { model, Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  text: string;
  dialog: Schema.Types.ObjectId;
  readed: boolean;
  attachments: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  createdAt?: Date;
}

const MessageSchema = new Schema(
  {
    text: { type: String, required: true },
    dialog: { type: Schema.Types.ObjectId, required: true, ref: 'Dialog' },
    readed: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attachments: { type: Schema.Types.ObjectId, ref: 'UploadFile' },
  },
  { timestamps: true }
)

const MessageModel = model<IMessage>('Message', MessageSchema)

export default MessageModel
