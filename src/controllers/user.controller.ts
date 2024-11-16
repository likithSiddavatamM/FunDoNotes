/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';
import { Request, Response } from 'express';

class UserController {
  public UserService = new userService();

  // Register a user
  public regUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const data = await this.UserService.newUser(req.body);
      if (data) {
        res.status(HttpStatus.CREATED)
           .json({
             code: HttpStatus.CREATED,
             message: `User with name ${data.firstName} ${data.lastName} is been created successfully, you can login using ${data.email}`
           });
      } 
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST)
         .json({
           code: HttpStatus.BAD_REQUEST,
           message: `${error.message}`
         });
    }
  };

  // LogIn user
  public logUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const data = await this.UserService.logging(req.body);
      if (typeof(data) == "object") {
        res.status(200)
           .json({
             code: HttpStatus.OK,
             message: `You are now loggedIn as ${data.firstName} ${data.lastName}, using ${data.email}`,
             accessToken: `${data.AccessToken}`
           });
      } 
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST)
         .json({
           code: HttpStatus.BAD_REQUEST,
           message: `${error.message}`
         });
    }
  };

  // Forgot User password
  public forgotPassword = async (req: Request, res: Response): Promise<any> => {
    try {
      let data = await this.UserService.forgotPassword(req.body.email);
      res.status(HttpStatus.OK)
         .json({
           code: data.response,
           message: `Reset link sent successfully to : ${data.envelope.to}`
         });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST)
         .json({
           code: HttpStatus.BAD_REQUEST,
           message: `${error.message}`
         });
    }
  };

  // Reset User password
  public resetPassword = async (req: Request, res: Response): Promise<any> => {
    try {
      await this.UserService.resetPassword(req.body);
      res.status(HttpStatus.OK)
         .json({
           code: HttpStatus.OK,
           data: `Password updated successfully for ${req.body.fEmail}, you can login through your updated password`
         });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST)
         .json({
           code: HttpStatus.BAD_REQUEST,
           message: `${error.message}`
         });
    }
  };
}

export default UserController;