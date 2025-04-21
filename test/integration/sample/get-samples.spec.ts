import { App } from "../../../src/app";
import { PrismaService } from "../../../src/modules/prisma/prisma.service";
import request from "supertest";

describe("GET /samples", () => {
  const { app } = new App();
  const prisma = new PrismaService();

  it("should display sample", async () => {
    const mockSample = [
      { name: "test 1" },
      { name: "test 2" },
      { name: "test 3" },
      { name: "test 4" },
    ];

    await prisma.sample.createMany({
      data: mockSample,
    });

    const response = await request(app).get("/samples");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
  });
});
