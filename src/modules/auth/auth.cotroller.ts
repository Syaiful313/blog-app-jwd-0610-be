import { injectable } from "tsyringe";
import { AuthService } from "./auth.service";
import { NextFunction, Request, Response } from "express";

@injectable()
export class AuthController {
  private authService: AuthService;

  constructor(AuthService: AuthService) {
    this.authService = AuthService;
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const result = await this.authService.register(body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const result = await this.authService.login(body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const result = await this.authService.forgotPassword(body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
