/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to authenticate if user has a valid Authorization token
 * Authorization: Bearer <token>
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export const userAuth = async (req: Request,res: Response, next: NextFunction): Promise<any> => {
  try {
    const bearerToken = req.header('Authorization')?.split(' ')[1];
      if(!bearerToken)
        {throw {code: HttpStatus.BAD_REQUEST,  message: 'Authorization token is required'};}
      try{
        req.body.fEmail=await jwt.verify(bearerToken, process.env.FORGOTPASSWORD_SECRET_KEY); }
      catch(error){
         const data : any = await jwt.verify(bearerToken, process.env.SECRET_KEY);
         [req.body.email ,req.body.createdBy] = [data.email, data._id]    
      }
      next(); } 
  catch (error) {
    res.json({Error : `${error}`})}
};