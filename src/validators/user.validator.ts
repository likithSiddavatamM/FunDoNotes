import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

class UserValidator {
  public regUser = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      firstName: Joi.string()
        .min(2)
        .required(),
      
      lastName: Joi.string()
        .min(2)
        .required(),
      
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/)
        .message('Email must be a valid format ending with .com!'),
      
      password: Joi.string()
        .min(10)
        .required()
        .messages({ 'string.min': 'Password must be at least 10 characters long!' })
    });
    const { error } = schema.validate(req.body);
    if (error) next(error);
    
    next();
  };

  public logUser = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/)
        .message('Email must be a valid format ending with .com!'),
      
      password: Joi.string()
        .min(10)
        .required()
        .messages({ 'string.min': 'Password must be at least 10 characters long!' })
    });

    const { error } = schema.validate(req.body);
    if (error) 
      res.status(400).json({Error:error.message});
    else
      next();
  };

  public id = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
        id: Joi.string().required()
    });

    const { error } = schema.validate(req.body);

    if (error) 
      res.status(400).json({Error:error.message});
    else
      next();
  };

  public email = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
        email: Joi.string().required().email()
    });

    const { error } = schema.validate(req.body);

    if (error) 
      res.status(400).json({Error:error.message});
    else
      next();
  };

  public resetPassword = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      password: Joi.string()
      .min(10) 
      .required()
      .messages({ 'string.min': 'Password must be at least 10 characters long!' })
    });

    const { error } = schema.validate(req.body);
    if (error) 
      res.status(400).json({Error:error.message});
    else
      next();
  }
}

export default UserValidator;