import { IUserClient } from "@/interfaces/IUserClient";

export function mapUserToClient(user: any): IUserClient {
  return {
    id: user._id || user.id,  
    name: user.name,
    email: user.email,
    profileImg: user.profileImg,
    phone: user.phone,
    birthDate: user.birthDate,
  };
}
