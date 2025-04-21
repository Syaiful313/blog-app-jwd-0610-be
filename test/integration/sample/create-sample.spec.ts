import request from "supertest";
import { App } from "../../../src/app";

describe("POST /samples", () => {
  const { app } = new App();
  it("should successfully create sample", async () => {
    const requestBody = {
      name: "Mock sample name",
    };

    const response = await request(app).post("/samples").send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
  });

  it("should return 400 if the request body is invalid", async () => {
    const response = await request(app).post("/samples").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "name must be a string,name should not be empty"
    );
  });
});
