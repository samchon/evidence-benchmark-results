import * as api from "@benchmark/shopping-api";
import { DynamicExecutor } from "@nestia/e2e";

import { MyGlobal } from "../../src/MyGlobal";
import { MyConfiguration } from "../../src/MyConfiguration";
import { MySetupWizard } from "../../src/setup/MySetupWizard";

/** Runs dynamically discovered backend feature tests against a live server. */
export namespace TestAutomation {
  let administratorConnection: api.IConnection | undefined;

  /** Returns the connection created by the controlled bootstrap boundary. */
  export function adminConnection(): api.IConnection {
    if (administratorConnection === undefined)
      throw new Error("The controlled administrator bootstrap has not run.");
    return administratorConnection;
  }

  /** Backend lifecycle operations used by the dynamic test runner. */
  export interface IProps<T> {
    /** Starts the backend under test. */
    open(): Promise<T>;

    /** Stops the backend under test. */
    close(backend: T): Promise<void>;
  }

  /** Executes every exported feature test against the running backend. */
  export async function execute<T>(
    props: IProps<T>,
  ): Promise<DynamicExecutor.IReport> {
    const backend = await props.open();
    try {
      MyGlobal.testing = true;
      const bootstrap: api.IConnection = {
        host: `http://127.0.0.1:${MyConfiguration.API_PORT()}`,
      };
      let administrator: api.IShoppingAuthorized;
      const provisionedEmail = await MySetupWizard.administratorEmail();
      if (provisionedEmail === null) {
        administrator = await api.functional.shopping.auth.customer.join.customerJoin(
          bootstrap,
          {
            email: `bootstrap.${Date.now()}@example.com`,
            password: "bootstrap123",
          },
        );
        await MySetupWizard.provisionAdministrator(
          administrator.actor.type,
          administrator.actor.id,
        );
      } else {
        administrator = await api.functional.shopping.auth.customer.login.customerLogin(
          bootstrap,
          { email: provisionedEmail, password: "bootstrap123" },
        );
      }
      administratorConnection = {
        host: bootstrap.host,
        headers: { Authorization: `Bearer ${administrator.token.access}` },
      };
      MyGlobal.testing = false;
      return await DynamicExecutor.validate({
        prefix: "test",
        location: `${__dirname}/../features`,
        parameters: () => [
          {
            host: `http://127.0.0.1:${MyConfiguration.API_PORT()}`,
          } satisfies api.IConnection,
        ],
        simultaneous: 1,
        extension: __filename.split(".").pop() ?? "ts",
      });
    } finally {
      await props.close(backend);
    }
  }
}
