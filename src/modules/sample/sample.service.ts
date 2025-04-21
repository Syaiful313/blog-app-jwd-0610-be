import { injectable } from "tsyringe";
import { Sample } from "../../generated/prisma";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSampleDto } from "./dto/create-sample.dto";
import { UpdateSampleDto } from "./dto/update-sample.dto";

@injectable()
export class SampleService {
  private prisma: PrismaService;

  constructor(PrismaClient: PrismaService) {
    this.prisma = PrismaClient;
  }

  private async findSampleOrThrow(id: number) {
    const sample = await this.prisma.sample.findFirst({
      where: { id },
    });

    if (!sample) {
      throw new ApiError(404, "Sample not found");
    }

    return sample;
  }

  getSamples = async () => {
    const sample = await this.prisma.sample.findMany();
    return sample;
  };
  getSample = async (id: number) => {
    return await this.findSampleOrThrow(id);
  };
  createSample = async (body: CreateSampleDto) => {
    return await this.prisma.sample.create({
      data: body,
    });
  };
  updateSample = async (id: number, body: Partial<UpdateSampleDto>) => {
    await this.findSampleOrThrow(id);

    return await this.prisma.sample.update({
      where: { id },
      data: body,
    });
  };
  deleteSample = async (id: number) => {
    await this.findSampleOrThrow(id);

    await this.prisma.sample.delete({
      where: { id },
    });

    return { message: "Sample deleted" };
  };
}
