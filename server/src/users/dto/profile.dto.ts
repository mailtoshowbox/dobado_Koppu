export class ProfileDto {
  constructor(object: any) {
    this.email = object.email;
    this.name = object.name;
    this.surname = object.surname;    
    this.birthdaydate = object.birthdaydate;
    this.phone = object.phone;
    this.profilepicture = object.profilepicture;
    this.roles = object.roles;
    this.isAllowedForApproval = object.isAllowedForApproval;
    this.emp_id = object.emp_id;
    this._id = object._id;
    this.departments = object.departments;
  };
  readonly _id: string;
  readonly roles: string;
  readonly departments: any;
  readonly isAllowedForApproval: boolean;
  readonly emp_id: string;

  readonly email: string;
  readonly name: string;
  readonly surname: string;
  readonly birthdaydate: Date;
  readonly phone: string;
  readonly profilepicture: string;
  
}