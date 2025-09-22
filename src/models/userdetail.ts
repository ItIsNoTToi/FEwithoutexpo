// models/userdetail.ts
import User from "./user";

export default interface UserDetail {
  user: string | User; // có thể là ObjectId hoặc object populate
  avatar?: string;     // chỉ cần string url
  level?: "beginner" | "intermediate" | "advanced";
  FirstName?: string;
  LastName?: string;
  Gender?: "Male" | "Female" | "Other";
  Address?: string;
  DateOfBirth?: Date;
  ProfilePicture?: {
    url?: string;
    uploadedAt?: Date;
  }[];
  Awards?: {
    AwardName: string;
    AwardDate?: Date;
    Description?: string;
  }[];
  bio?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
