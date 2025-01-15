import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const checkPassword = this.usersService.checkPassword(
                pass,
                user.password,
            );
            if (checkPassword == true) {
                return user;
            }
        }
        return null;
    }
}
