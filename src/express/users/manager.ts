import bcrypt from "bcrypt";
import { DocumentNotFoundError } from "../../utils/errors";
import { logger } from "../../utils/logger";
import { IMongoUser, IUser } from "./interface";
import { UserModel } from "./model";
import config from "../../config";

export class UserManager {
    static getAllUsers = async (): Promise<IMongoUser[]> => {
        return UserModel.find().lean().exec();
    };

    static getUserById = async (id: string): Promise<IMongoUser> => {
        return UserModel.findById(id).orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static createUser = async (user: IUser): Promise<IMongoUser | null> => {
        try {
            const salt = await bcrypt.genSalt(config.auth.saltRounds);
            const encryptedPassword = await bcrypt.hash(user.password, salt);

            return UserModel.create({
                ...user,
                password: encryptedPassword,
            });
        } catch (error) {
            logger.error("Error on create user: ", error);
            return null;
        }
    };

    static updateUserById = async (id: string, updateData: Partial<IUser>): Promise<IMongoUser | null> => {
        try {
            const userToUpdate = updateData;

            if (updateData.password) {
                const salt = await bcrypt.genSalt(config.auth.saltRounds);
                const encryptedPassword = await bcrypt.hash(updateData.password, salt);

                userToUpdate.password = encryptedPassword;
            }

            return UserModel.findByIdAndUpdate(id, userToUpdate, { new: true })
                .orFail(new DocumentNotFoundError(id))
                .lean()
                .exec();
        } catch (error) {
            logger.error("Error on updating user: ", error);
            return null;
        }
    };

    static deleteUserById = async (id: string): Promise<string> => {
        await UserModel.findByIdAndDelete(id).orFail(new DocumentNotFoundError(id)).lean().exec();

        return `User ${id} deleted succesfully`;
    };
}
