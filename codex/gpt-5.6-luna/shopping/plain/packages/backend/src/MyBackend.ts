import { WebSocketAdaptor } from "@nestia/core";
import type { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { MyConfiguration } from "./MyConfiguration";
import { MyModule } from "./MyModule";
import { ShoppingProvider } from "./providers/ShoppingProvider";

/** Owns the lifecycle of the generated Nest application. */
export class MyBackend {
  private application_?: INestApplication;
  private closing_?: Promise<void>;
  private deliveryTimer_?: NodeJS.Timeout;

  /** Creates and starts the HTTP application once. */
  public async open(): Promise<void> {
    this.application_ = await NestFactory.create(await MyModule.mount(), {
      logger: false,
    });
    await WebSocketAdaptor.upgrade(this.application_);
    this.application_.enableCors();
    await this.application_.listen(MyConfiguration.API_PORT(), "0.0.0.0");
    this.deliveryTimer_ = setInterval(() => {
      void ShoppingProvider.autoDeliverExpired().catch(() => undefined);
    }, 60_000);
    if (process.send) process.send("ready");
  }

  /** Closes the active application and coalesces concurrent close requests. */
  public async close(): Promise<void> {
    if (this.closing_ !== undefined) return this.closing_;
    if (this.application_ === undefined) return;

    const application: INestApplication = this.application_;
    delete this.application_;
    if (this.deliveryTimer_ !== undefined) clearInterval(this.deliveryTimer_);
    delete this.deliveryTimer_;
    this.closing_ = application.close();
    try {
      await this.closing_;
    } finally {
      delete this.closing_;
    }
  }
}
