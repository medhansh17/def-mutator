export class HealthService {
  public getHealth(): string {
    return "HEALTH OK";
  }
}

export const healthService = new HealthService();
