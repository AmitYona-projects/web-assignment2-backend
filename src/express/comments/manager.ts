import { DocumentNotFoundError } from "../../utils/errors";
import { IMongoComment, IComment } from "./interface";
import { CommentModel } from "./model";

export class CommentManager {
  static getAllComments = async (): Promise<IMongoComment[]> => {
    return CommentModel.find().lean().exec();
  };

  static getCommentById = async (id: string): Promise<IMongoComment> => {
    return CommentModel.findById(id)
      .orFail(new DocumentNotFoundError(id))
      .lean()
      .exec();
  };

  static getCommentsByPostId = async (
    postId: string
  ): Promise<IMongoComment[]> => {
    return CommentModel.find({ postId: postId })
      .orFail(new DocumentNotFoundError(postId))
      .lean()
      .exec();
  };

  static createComment = async (comment: IComment): Promise<IMongoComment> => {
    return CommentModel.create(comment);
  };

  static updateCommentById = async (
    id: string,
    update: Partial<IComment>
  ): Promise<IMongoComment> => {
    return CommentModel.findByIdAndUpdate(id, update, { new: true })
      .orFail(new DocumentNotFoundError(id))
      .lean()
      .exec();
  };

  static deleteCommentById = async (id: string): Promise<string> => {
    await CommentModel.findByIdAndDelete(id)
      .orFail(new DocumentNotFoundError(id))
      .lean()
      .exec();

    return `Comment ${id} deleted succesfully`;
  };
}
