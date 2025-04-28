import { injectable } from "tsyringe";
import { BlogService } from "./blog.service";
import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { GetBlogsDTO } from "./dto/get-blogs.dto";
import { ApiError } from "../../utils/api-error";

@injectable()
export class BlogController {
  private blogService: BlogService;

  constructor(BlogService: BlogService) {
    this.blogService = BlogService;
  }

  getBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = plainToInstance(GetBlogsDTO, req.query);
      const blogs = await this.blogService.getBlogs(query);
      res.status(200).send(blogs);
    } catch (error) {
      next(error);
    }
  };

  getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blog = await this.blogService.getBlogBySlug(req.params.slug);
      res.status(200).send(blog);
    } catch (error) {
      next(error);
    }
  };

  createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const thumbnail = files.thumbnail?.[0];

      if (!thumbnail) {
        throw new ApiError(400, "Thumbnail is required");
      }
      const result = await this.blogService.createBlog(
        req.body,
        thumbnail,
        res.locals.user.id
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
