import User from '../models/user.model';
import Transporter from '../utils/user.util'
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { rabbitSend } from '../utils/RabbitMQ';

class UserService {
  //create user for registration
  public newUser = async (body: IUser): Promise<any> => {
    const userData = await User.find({email:body.email})
    if(!userData.length){
      body.password = await bcrypt.hash(body.password, 10);
      const data = await User.create(body);
      rabbitSend("rabbit", "Direct", data);
      return data;
    }
    throw new Error(`User with name is already registered through the email id`);
  };

  //create login
  public logging = async(body: any): Promise<any> => {
    let UserValue = await User.find({email:body.email})
    if(UserValue.length==0)
      throw new Error(`User with email ${body.email} doesn't exist, please go with the registration`);
    const verifyData = await bcrypt.compare(body.password, UserValue[0].password)
    if(!verifyData)
      throw new Error(`You have entered a incorrect password, try again`);
    UserValue[0].AccessToken=jwt.sign({_id: UserValue[0]._id, email:body.email},process.env.AUTH_SECRET_KEY);
    return UserValue[0]
  } 

  //forgot password
  public forgotPassword = async(email: string)=>{
    let UserValue = await User.findOne({email:email})
      if(!UserValue)
        throw new Error(`User with email ${email} doesn't exist, please go with the registration`);
      const sentData = await Transporter.sendMail(await jwt.sign(email, process.env.FORGOTPASSWORD_SECRET_KEY), email)
      return sentData
  }

  //reset password
  public resetPassword = async(body : any)=>{
      if(!body.fEmail)
        throw new Error("Invalid Token");
      await User.updateOne({email:body.fEmail},{$set:{password:(await bcrypt.hash(body.password,9))}})
  }
} 

export default UserService;
