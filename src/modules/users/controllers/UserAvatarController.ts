import { Request, Response } from 'express';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import { instanceToInstance } from 'class-transformer';
export default class UsersAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    if (!req.file) {
      return res.status(400).json('é necessario informar um file');
    }
    const updateAvatar = new UpdateUserAvatarService();

    const user = updateAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    return res.json(instanceToInstance(user));
  }
}
