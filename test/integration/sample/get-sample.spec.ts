import { App } from "../../../src/app";
import { PrismaService } from "../../../src/modules/prisma/prisma.service";
import request from "supertest";

describe("GET /samples/:id", () => {
  const { app } = new App();
  const prisma = new PrismaService();

  it("should display sample", async () => {
    const mockSample = [{ name: "test 1" }];

    await prisma.sample.createMany({
      data: mockSample,
    });

    const response = await request(app).get("/samples/1");

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.name).toBeDefined();
  });

  it("should return 404 not found if the sample with the given id is not exists", async () => {
    const nonExistentSampleId = 9999999;

    const response = await request(app).get(`/samples/${nonExistentSampleId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Sample not found");
  });
});
