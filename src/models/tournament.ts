import User from "./user";

export interface Tournament {
  _id: string;
  name: string;
  thumbnailUrl?: string;
  description: string;
  startDate: string;   // ISO string từ API
  endDate: string;     // ISO string từ API
  participants: User[];
  winner?: User;       // có thể chưa có người thắng
  createdAt: string;
  updatedAt: string;
}
