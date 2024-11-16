import express, { IRouter } from 'express';
import userController from '../controllers/user.controller';
import userValidator from '../validators/user.validator';
import {userAuth} from '../middlewares/auth.middleware';
  class UserRoutes {
    private UserController = new userController();
    private router = express.Router();
    private UserValidator = new userValidator();

    constructor() {
      this.routes();
    }

    private routes = () => {

      //route to create a new user
      this.router.post(
        '',
        this.UserValidator.regUser,
        this.UserController.regUser
      );

      //route to login
      this.router.post(
        '/login',
        this.UserValidator.logUser,
        this.UserController.logUser
      );

      //route to forgot password
      this.router.post(
        '/forgotpassword',
        this.UserValidator.email,
        this.UserController.forgotPassword
      )

      //route to reset password
      this.router.post(
        '/resetpassword',
        this.UserValidator.resetPassword,
        userAuth(`forgot`),
        this.UserController.resetPassword
      )
    };
    
    public getRoutes = (): IRouter => 
      this.router;
  }

export default UserRoutes;
