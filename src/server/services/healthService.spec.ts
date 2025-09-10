import { HealthService, healthService } from "./healthService";

describe("HealthService", () => {
  let service: HealthService;

  beforeEach(() => {
    service = new HealthService();
  });

  it("should return HEALTH OK when checking health", () => {
    const result = service.getHealth();
    expect(result).toBe("HEALTH OK");
  });

  it("should work with service instance", () => {
    const result = healthService.getHealth();
    expect(result).toBe("HEALTH OK");
  });
});
