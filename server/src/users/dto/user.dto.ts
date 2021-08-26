import { SettingsDto } from "./settings.dto";
import { PhotoDto } from "../../common/dto/photo.dto";
interface department  extends Document{
  id: string;
  name: string;
} 
export class UserDto {
  constructor(object: any) {
    this.name = object.name;
    this.surname = object.surname;
    this.email = object.email;
    this.roles = object.roles;
    this.phone = object.phone;
    this.birthdaydate = object.birthdaydate;
    this.settings = new SettingsDto(object.settings);
    this.photos = { 
      profilePic : new PhotoDto(object.photos.profilePic),
      gallery: []
    }
    if(object.photos && object.photos.gallery) {
      object.photos.gallery.forEach(photo => {
        this.photos.gallery.push(new PhotoDto(photo));
      });
    };
    this.approved = object.approved;
    this.isAllowedForApproval = object.isAllowedForApproval;
    this.emp_id = object.emp_id;
    this.departments = object.departments;
    
  };
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly roles: string;
  readonly phone: string;
  readonly birthdaydate: Date;
  readonly approved: boolean;
  readonly isAllowedForApproval: boolean;
  readonly emp_id: string;
  settings: SettingsDto
  photos: {
    profilePic: PhotoDto;
    gallery: PhotoDto[];
  };
  readonly departments: any;
  
}