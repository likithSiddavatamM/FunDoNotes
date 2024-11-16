import keepnotes from '../models/note.model';
import { redisClient, deleteKey } from '../middlewares/cache.middleware';
import { Request } from 'express';

class NoteService {

  // Create note
  public createNote = async (reqBody: { title: string; description: string; email: string; createdBy: string }): Promise<object> => {
    const data_id = JSON.parse(JSON.stringify(await keepnotes.create(reqBody)))._id;
    await deleteKey(reqBody.createdBy);
    return keepnotes.findOne({ _id: data_id }, { email: true, title: true, description: true, createdBy: true, _id: false });
  };

  // Find a note
  public findNote = async (req: Request): Promise<Object> => {
    const data = await keepnotes.findOne(
      { createdBy: req.body.createdBy, _id: req.params.id, isArchive: false, isTrash: false },
      { title: true, description: true, createdBy: true, email: true, _id: false }
    );
    if (!data) throw new Error("No such note");
    return data;
  };

  // Find multiple notes
  public findNotes = async (createdBy: string): Promise<Object> => {
    const data = await keepnotes.find(
      { createdBy: createdBy, isArchive: false, isTrash: false },
      { title: true, description: true, createdBy: true, email: true, _id: false }
    );
    if (data.length === 0) throw new Error("No such notes available");
    await redisClient.setEx(createdBy, 1111, JSON.stringify(data));
    return data;
  };

  // Update note
  public updateNote = async (req: Request): Promise<string> => {
    const data = JSON.parse(JSON.stringify(await keepnotes.findOne({ createdBy: req.body.createdBy, _id: req.params.id, isArchive: false, isTrash: false })));
    if (!data) throw new Error("No such notes available");
    await keepnotes.updateOne({ _id: data._id }, { $set: { title: req.body.title || data.title, description: req.body.description || data.description } });
    await deleteKey(req.body.createdBy);
    return "Note Updated Successfully";
  };

  // Trash note
  public trash = async (req: Request): Promise<string> => {
    const myData = JSON.parse(JSON.stringify(await keepnotes.findOne({ createdBy: req.body.createdBy, _id: req.params.id })));
    if (!myData) throw new Error("No such data");
    await keepnotes.updateOne({ _id: myData }, { $set: { isTrash: !myData.isTrash } });
    await deleteKey(req.body.createdBy);
    return !myData.isTrash
      ? `Deleted the Note (id:${myData._id})`
      : `Restored the Note from TrashBin (id:${myData._id})`;
  };

  // Delete notes permanently
  public deletePermanently = async (req: Request): Promise<any> => {
    await deleteKey(req.body.createdBy);
    return await keepnotes.deleteOne({ createdBy: req.body.createdBy, _id: req.params.id, isTrash: true });
  };

  // Trashed notes
  public trashBin = async (createdBy: string): Promise<Object[]> => {
    return await keepnotes.find(
      { createdBy: createdBy, isTrash: true },
      { title: true, description: true, createdBy: true, email: true, _id: false }
    );
  };

  // Archive note
  public archive = async (req: Request): Promise<string> => {
    const myData = JSON.parse(JSON.stringify(await keepnotes.findOne({ createdBy: req.body.createdBy, _id: req.params.id, isTrash: false })));
    if (!myData) throw new Error("No such data");
    await keepnotes.updateOne({ _id: myData }, { $set: { isArchive: !myData.isArchive } });
    await deleteKey(req.body.createdBy);
    return myData.isArchive ? "Restored from Archives" : "Archived";
  };

  // Archived notes
  public archives = async (createdBy: string): Promise<object> => {
    return await keepnotes.find(
      { createdBy: createdBy, isArchive: true, isTrash: false },
      { title: true, description: true, createdBy: true, email: true, _id: false }
    );
  };
}

export default NoteService;