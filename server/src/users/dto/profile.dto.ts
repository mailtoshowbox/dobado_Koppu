export class ProfileDto {
  constructor(object: any) {
    this.email = object.email;
    this.name = object.name;
    this.surname = object.surname;    
    this.birthdaydate = object.birthdaydate;
    this.phone = object.phone;
    this.profilepicture = object.profilepicture;
    this.roles = object.roles;
    this._id = object._id;
    

  };
  readonly _id: string;
  readonly roles: string;

  readonly email: string;
  readonly name: string;
  readonly surname: string;
  readonly birthdaydate: Date;
  readonly phone: string;
  readonly profilepicture: string;
}