import mongoose from 'mongoose'
import validator from 'validator'

interface IUser extends mongoose.Document {
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
    last_seen: Date,
  },
  {
    timestamps: true,
  }
)
const UserModel = mongoose.model<IUser>('User', UserSchema)
export default UserModel
