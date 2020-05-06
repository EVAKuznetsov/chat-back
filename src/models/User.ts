import mongoose from 'mongoose'
import validator from 'validator'
import HashPassword from '../libs/hashPassword'
import {differenceInMinutes} from 'date-fns'

export interface IUser extends mongoose.Document {
  email: string;
  avatar?: string;
  fullName: string;
  password: string;
  confirmed: boolean;
  confirm_hash?: string;
  last_seen: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: 'Email is required',
      validate: [validator.isEmail, 'invalid email'],
      unique: true,
    },
    fullName: { type: String, required: 'Full name is required' },
    password: { type: String, required: 'Password is required' },
    confirmed: { type: String, default: false },
    avatar: String,
    confirm_hash: String,
    last_seen: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
)
UserSchema.virtual('isOnline').get(function (this:IUser) {
  return differenceInMinutes(new Date(),this.last_seen)<5 
})
UserSchema.set('toJSON',{
  virtuals:true
})
UserSchema.pre('save', async function (next) {
  const user: any = this
  if (!user.isModified) return next()
  user.password = await HashPassword.generate(user.password)
  user.confirm_hash = await HashPassword.generate(new Date().toString())
  next()
})
const UserModel = mongoose.model<IUser>('User', UserSchema)
export default UserModel
