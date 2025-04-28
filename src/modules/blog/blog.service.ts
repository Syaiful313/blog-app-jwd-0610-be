import { injectable } from "tsyringe";
import { Prisma } from "../../generated/prisma";
import { ApiError } from "../../utils/api-error";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBlogDTO } from "./dto/create-blog.dto";
import { GetBlogsDTO } from "./dto/get-blogs.dto";
import { generateSlug } from "../../utils/generateSlug";

@injectable()
export class BlogService {
  private prisma: PrismaService;
  private cloudinaryService: CloudinaryService;

  constructor(
    PrismaClient: PrismaService,
    CloudinaryService: CloudinaryService
  ) {
    this.prisma = PrismaClient;
    this.cloudinaryService = CloudinaryService;
  }

  getBlogs = async (query: GetBlogsDTO) => {
    const { page, take, sortBy, sortOrder, search } = query;

    const whereClause: Prisma.BlogWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereClause.title = {
        contains: search,
        mode: "insensitive",
      };
    }
    const blogs = await this.prisma.blog.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * take,
      take,
      include: { user: { omit: { password: true } } },
    });

    const count = await this.prisma.blog.count({
      where: whereClause,
    });

    return {
      data: blogs,
      meta: {
        page,
        take,
        total: count,
      },
    };
  };

  getBlogBySlug = async (slug: string) => {
    const blog = await this.prisma.blog.findFirst({
      where: { slug, deletedAt: null },
      include: { user: { omit: { password: true } } },
    });

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    return blog;
  };

  createBlog = async (
    body: CreateBlogDTO,
    thumbnail: Express.Multer.File,
    authUserId: number
  ) => {
    const { title } = body;

    const blog = await this.prisma.blog.findFirst({
      where: { title },
    });

    if (blog) {
      throw new ApiError(400, "Blog already exists");
    }

    const slug = generateSlug(title);

    const { secure_url } = await this.cloudinaryService.upload(thumbnail);

    return await this.prisma.blog.create({
      data: {
        ...body,
        thumbnail: secure_url,
        userId: authUserId,
        slug,
      },
    });
  };

  deleteBlog = async (id: number, authUserId: number) => {
    const blog = await this.prisma.blog.findFirst({
      where: { id },
    });

    if (!blog) {
      throw new ApiError(404, "Invalid blog id");
    }

    if (blog.userId !== authUserId) {
      throw new ApiError(400, "forbidden");
    }

    await this.prisma.blog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: "deleted success" };
  };
}
