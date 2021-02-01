import { SettingsDto } from "./settings.dto";
import { PhotoDto } from "../../common/dto/photo.dto";
import { UserDto } from "../dto/user.dto";

export class UsersDto {
  constructor(object: any) {
     this.users = object.users;
  };
 
  users: UserDto[];
}

