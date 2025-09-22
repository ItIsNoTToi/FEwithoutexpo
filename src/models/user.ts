import UserDetail from "./userdetail";

// models/user.ts
export default interface User {
  _id: string;
  username: string;
  email?: string;
  Phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  UserDetail?: UserDetail; // populate kèm UserDetail
}
