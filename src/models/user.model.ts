import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userCreation = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/.test(v),
        message: props => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 10,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>('User', userCreation);