import mongoose from 'mongoose'
import validator from 'validator'
import HashPassword from '../libs/hashPassword'

export interface IUser extends mongoose.Document {
  email: string;
  avatar?: string;
  fullname: string;
  password: string;
  confirmed: boolean;
  confirm_hash?: string;
  last_seen?: Date;
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
    fullname: { type: String, required: 'Full name is required' },
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
UserSchema.pre('save', function (next) {
  const user: any = this
  if (!user.isModified) return next()
  user.password = HashPassword.generate(user.password)
  next()
})
const UserModel = mongoose.model<IUser>('User', UserSchema)
export default UserModel
