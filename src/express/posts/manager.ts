import { DocumentNotFoundError } from "../../utils/errors";
import { IMongoPost, IPost } from "./interface";
import { PostModel } from "./model";

export class PostManager {
    static getAllPosts = async (): Promise<IMongoPost[]> => {
        return PostModel.find().lean().exec();
    };

    static getPostById = async (id: string): Promise<IMongoPost> => {
        return PostModel.findById(id).orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static getPostsBySenderId = async (senderId: string): Promise<IMongoPost[]> => {
        return PostModel.find({ senderId: senderId }).orFail(new DocumentNotFoundError(senderId)).lean().exec();
    };

    static createPost = async (post: IPost): Promise<IMongoPost> => {
        return PostModel.create(post);
    };

    static updatePostById = async (id: string, update: Partial<IPost>): Promise<IMongoPost> => {
        return PostModel.findByIdAndUpdate(id, update, { new: true }).orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static deletePostById = async (id: string): Promise<string> => {
        await PostModel.findByIdAndDelete(id).orFail(new DocumentNotFoundError(id)).lean().exec();

        return `Post ${id} deleted succesfully`;
    };

}