import express, { IRouter } from 'express';
import NoteValidator from '../validators/note.validator';
import NoteController from '../controllers/note.controller';
import { userAuth } from '../middlewares/auth.middleware';
import { cache } from '../middlewares/cache.middleware';

class NoteRoutes {
  private NoteController = new NoteController();
  private router = express.Router();
  private NoteValidator = new NoteValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {

    // route to create a note
    this.router.post(
      '',
      userAuth(),
      this.NoteValidator.userData,
      this.NoteController.createNote  
    );

    // route to read all notes
    this.router.get(
      '',
      userAuth(),
      cache,
      this.NoteController.readNotes
    );

    // route to read a note
    this.router.get(
      '/:id',
      userAuth(),
      this.NoteValidator.id,
      this.NoteController.readNote
    );

    // route to update a note
    this.router.put(
      '/:id',
      userAuth(),
      this.NoteValidator.data,
      this.NoteController.updateNote
    );

    // route to delete notes permanently from trash
    this.router.delete(
      '/:id',
      userAuth(),
      this.NoteValidator.id,
      this.NoteController.deletePermanently
    );

    // route to archive a note
    this.router.put(
      '/:id/archive',
      userAuth(),
      this.NoteValidator.id,
      this.NoteController.archive
    );
    
    // route to trash a note
    this.router.put(
      '/:id/trash',
      userAuth(),
      this.NoteValidator.id,
      this.NoteController.trash
    );

    // route to view trashBin
    this.router.get(
      '/trash/trashbin',
      userAuth(),
      this.NoteController.trashBin
    );

    // route to view all archives
    this.router.get(
      '/archive/archives',
      userAuth(),
      this.NoteController.archives
    );
  };

  public getRoutes = (): IRouter => 
    this.router;
}

export default NoteRoutes;