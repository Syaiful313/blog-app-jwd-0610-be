import { Context, createMockContext, MockContext } from "../../../test/context";
import { SampleService } from "./sample.service";

describe("SampleService", () => {
  let mockCtx: MockContext;
  let ctx: Context;
  let sampleService: SampleService;

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    sampleService = new SampleService(ctx.prisma);
  });

  describe("getSamples", () => {
    it("should return samples", async () => {
      const mockSamples = [
        { id: 1, name: "test 1", createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: "test 2", createdAt: new Date(), updatedAt: new Date() },
        { id: 3, name: "test 3", createdAt: new Date(), updatedAt: new Date() },
      ];

      mockCtx.prisma.sample.findMany.mockResolvedValue(mockSamples);

      const result = await sampleService.getSamples();

      expect(result).toEqual(mockSamples);
    });
  });

  describe("getSample", () => {
    it("should return sample", async () => {
      const mockSample = {
        id: 1,
        name: "test 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCtx.prisma.sample.findFirst.mockResolvedValue(mockSample);

      const result = await sampleService.getSample(mockSample.id);

      expect(result).toEqual(mockSample);
    });

    it("should throw error if sample not found", async () => {
      const mockSample = -1;

      mockCtx.prisma.sample.findFirst.mockResolvedValue(null);

      await expect(sampleService.getSample(mockSample)).rejects.toThrow(
        "Sample not found"
      );
    });
  });

  describe("createSample", () => {
    it("should create sample", async () => {
      const mockSample = {
        id: 1,
        name: "test 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCtx.prisma.sample.create.mockResolvedValue(mockSample);

      const result = await sampleService.createSample(mockSample);

      expect(result).toEqual({
        id: 1,
        name: "test 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });
});
