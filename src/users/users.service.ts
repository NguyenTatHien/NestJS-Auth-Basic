import { Injectable, OnModuleInit } from "@nestjs/common";
import mongoose, { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private configService: ConfigService,
    ) {}

    async onModuleInit() {
        const count = await this.userModel.count();
        if (count === 0) {
            const salt = genSaltSync(10);
            const hash = hashSync(
                this.configService.get<string>("INIT_USER_PASSWORD"),
                salt,
            );
            await this.userModel.insertMany([
                {
                    name: "Eric",
                    email: "admin@gmail.com",
                    password: hash,
                },
                {
                    name: "User",
                    email: "user@gmail.com",
                    password: hash,
                },
                {
                    name: "User 1",
                    email: "user1@gmail.com",
                    password: hash,
                },
                {
                    name: "User 2",
                    email: "user2@gmail.com",
                    password: hash,
                },
                {
                    name: "User 3",
                    email: "user3@gmail.com",
                    password: hash,
                },
            ]);
        }
    }

    getHashPassword = (password: string) => {
        const salt = genSaltSync(10);
        const hash = hashSync("B4c0//", salt);
        return hash;
    };

    async create(createUserDto: CreateUserDto) {
        const hashPassword = this.getHashPassword(createUserDto.password);
        let user = await this.userModel.create({
            email: createUserDto.email,
            password: hashPassword,
            name: createUserDto.name,
        });
        return user;
    }

    async findAll() {
        return await this.userModel.find({});
    }

    findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) return `User not found`;
        return this.userModel.findOne({
            _id: id,
        });
    }

    async update(updateUserDto: UpdateUserDto) {
        return await this.userModel.updateOne(
            { _id: updateUserDto._id },
            { ...updateUserDto },
        );
    }

    remove(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) return `User not found`;
        return this.userModel.deleteOne({
            _id: id,
        });
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ email });
    }

    findOneByUsername(username: string) {
        return this.userModel.findOne({
            email: username,
        });
    }

    checkPassword(hash: string, plain: string) {
        return compareSync(hash, plain);
    }
}
