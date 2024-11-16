/* eslint-disable @typescript-eslint/no-explicit-any */
import NoteService from '../services/note.service';
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import NoteValidator from '../validators/note.validator'; 

class NoteController {
  public a = new NoteValidator();
  public NoteService = new NoteService();

  // Create a note
  public createNote = async (req: Request, res: Response): Promise<any> => {
    try {
      const createdData = await this.NoteService.createNote(req.body)
      res.status(HttpStatus.CREATED)
         .json({
           code: HttpStatus.CREATED,
           data: createdData
         });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST)
         .json({
           code: HttpStatus.BAD_REQUEST,
           message: `${error.message}`
         });
    }
  };

  // Read/Fetch a note
  public readNote = async (req: Request, res: Response): Promise<any> => {
    try {
      const fetchedNote = await this.NoteService.findNote(req)
      res.status(HttpStatus.OK)
         .json({
           code: HttpStatus.OK,
           data: fetchedNote
         });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST)
         .json({
           code: HttpStatus.BAD_REQUEST,
           message: `${error.message}`
         });
    }
  };

  // Read/Fetch all notes
  public readNotes = async (req: Request, res: Response): Promise<any> => {
    try {
      const fetchedNotes = await this.NoteService.findNotes(req.body.createdBy)
      res.status(HttpStatus.OK)
         .json({
           code: HttpStatus.OK,
           data: fetchedNotes
         });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST)
         .json({
           code: HttpStatus.BAD_REQUEST,
           message: `${error.message}`
         });
    }
  };

  // Update a note
  public updateNote = async (req: Request, res: Response): Promise<any> => {
    try {
      const Status = await this.NoteService.updateNote(req)
      res.status(HttpStatus.OK)
         .json({
           code: HttpStatus.OK,
           status: Status
         });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST)
         .json({
           code: HttpStatus.BAD_REQUEST,
           message: `${error.message}`
         });
    }
  };

  // Move note to trash
  public trash = async (req: Request, res: Response): Promise<any> => {
    try {
      const Status = await this.NoteService.trash(req)
      res.status(HttpStatus.OK)
         .json({
           code: HttpStatus.OK,
           status: Status
         });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST)
         .json({
           code: HttpStatus.BAD_REQUEST,
           message: `${error.message}`
         });
    }
  };

  // Permanently delete notes
  public deletePermanently = async (req: Request, res: Response): Promise<any> => {
    const delRecords = (await this.NoteService.deletePermanently(req)).deletedCount
    try {
      res.status(HttpStatus.OK)
         .json({
           code: HttpStatus.OK,
           RecordsDeleted: delRecords 
         });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST)
         .json({
           code: HttpStatus.BAD_REQUEST,
           message: `${error.message}`
         });
    }
  };

  // View trash
  public trashBin = async (req: Request, res: Response): Promise<any> => {
    try {
      const trashData = await this.NoteService.trashBin(req.body.createdBy)
      res.status(HttpStatus.OK)
         .json({
           code: HttpStatus.OK,
           data: trashData
         });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST)
         .json({
           code: HttpStatus.BAD_REQUEST,
           message: `${error.message}`
         });
    }
  };

  // Archive note
  public archive = async (req: Request, res: Response): Promise<any> => {
    try {
      const Status = await this.NoteService.archive(req)
      res.status(HttpStatus.OK)
         .json({
           code: HttpStatus.OK,
           status: Status
         });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST)
         .json({
           code: HttpStatus.BAD_REQUEST,
           message: `${error.message}`
         });
    }
  };

  // View all archived notes
  public archives = async (req: Request, res: Response): Promise<any> => {
    try {
      const archiveData = await this.NoteService.archives(req.body.createdBy);
      res.status(HttpStatus.OK)
         .json({
           code: HttpStatus.OK,
           data: archiveData
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

export default NoteController;