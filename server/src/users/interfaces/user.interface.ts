import { Document } from 'mongoose';
import { Photo } from '../../common/interfaces/photo.interface';
interface department  extends Document{
  id: string;
  name: string;
} 
export interface User extends Document{
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdaydate: Date;
  password: string;
  roles: string[];
  ttgF: string[]; 
  approved : boolean;
  isAllowedForApproval : boolean,
  emp_id : string,  
  auth: {
    email : {
      valid : boolean,
    },
    facebook: {
      userid: string
    },
    gmail: {
      userid: string
    }
  },
  settings: {
  },
  photos: {
    profilePic: Photo;
    gallery: Photo[];
  }, 
  departments : department[]

  
}