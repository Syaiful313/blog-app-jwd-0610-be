import { Router } from "express";
import { injectable } from "tsyringe";
import { JWT_SECRET_KEY } from "../../config";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { UploaderMiddleware } from "../../middlewares/uplouder.middleware";
import { validateBody } from "../../middlewares/validation.middleware";
import { BlogController } from "./blog.controller";
import { CreateBlogDTO } from "./dto/create-blog.dto";

@injectable()
export class BlogRouter {
  private router: Router;
  private blogController: BlogController;
  private jwtMiddleware: JwtMiddleware;
  private uplouderMiddleware: UploaderMiddleware;

  constructor(
    BlogController: BlogController,
    JwtMiddleware: JwtMiddleware,
    UploaderMiddleware: UploaderMiddleware
  ) {
    this.router = Router();
    this.blogController = BlogController;
    this.jwtMiddleware = JwtMiddleware;
    this.uplouderMiddleware = UploaderMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.blogController.getBlogs);
    this.router.get("/:slug", this.blogController.getBlogBySlug);
    this.router.post(
      "/",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.uplouderMiddleware
        .upload(2)
        .fields([{ name: "thumbnail", maxCount: 1 }]),
      this.uplouderMiddleware.fileFilter([
        "image/png",
        "image/jpeg",
        "image/avif",
      ]),
      validateBody(CreateBlogDTO),
      this.blogController.createBlog
    );
  };

  getRouter() {
    return this.router;
  }
}
