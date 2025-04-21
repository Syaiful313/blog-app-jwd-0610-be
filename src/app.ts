import cors from "cors";
import xpress, { Express, json } from "express";
import "reflect-metadata";
import { container } from "tsyringe";
import { PORT } from "./config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { SampleRouter } from "./modules/sample/sample.router";
import { AuthRouter } from "./modules/auth/auth.router";

export class App {
  public app: Express;

  constructor() {
    this.app = xpress();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure() {
    this.app.use(json());
    this.app.use(cors());
  }

  private routes() {
    const sampleRouter = container.resolve(SampleRouter);
    const authRouter = container.resolve(AuthRouter);

    this.app.use("/samples", sampleRouter.getRouter());
    this.app.use("/auth", authRouter.getRouter());
  }

  private handleError() {
    this.app.use(errorMiddleware);
  }

  public start() {
    this.app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}
