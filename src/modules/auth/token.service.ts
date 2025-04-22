import { sign, SignOptions } from "jsonwebtoken";

export class TokenService {
  generateToken(payload: object, secretKey: string, options: SignOptions) {
    return sign(payload, secretKey, options);
  }
}
