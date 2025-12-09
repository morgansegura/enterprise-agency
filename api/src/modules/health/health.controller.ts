import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from "@nestjs/terminus";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Check if memory usage is below 150MB
      () => this.memory.checkHeap("memory_heap", 150 * 1024 * 1024),
    ]);
  }

  @Get("ready")
  ready() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
