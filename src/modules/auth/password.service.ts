import argon2 from "argon2";

export class PasswordService {
  hassPassword = async (password: string) => {
    return await argon2.hash(password);
  };
}
