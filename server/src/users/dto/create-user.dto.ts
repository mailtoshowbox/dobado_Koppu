export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  password: string;
  approved : boolean;
  isAllowedForApproval : boolean;
  emp_id : string;
}