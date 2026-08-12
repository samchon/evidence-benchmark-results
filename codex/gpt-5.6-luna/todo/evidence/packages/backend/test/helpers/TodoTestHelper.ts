import * as api from "@benchmark/todo-api";

/** Shared authenticated fixtures for the public backend feature tests. */
export namespace TodoTestHelper {
  /** Credentials and an authenticated connection owned by one fresh account. */
  export interface IFixture {
    connection: api.IConnection;
    email: string;
    password: string;
    token: api.ITodoUser.IAuthorized;
  }

  /** Registers a fresh account and returns its bearer-authenticated connection. */
  export async function authorize(
    connection: api.IConnection,
  ): Promise<IFixture> {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const email = `todo-${suffix}@example.com`;
    const password = "correct-horse-battery-staple";
    const token = await api.functional.todo.auth.user.join_operation.join(
      { host: connection.host },
      { email, password, displayName: "Test User" },
    );
    return {
      connection: {
        host: connection.host,
        headers: { Authorization: `Bearer ${token.token.access}` },
      },
      email,
      password,
      token,
    };
  }

  /** Creates one fresh Todo for a fixture. */
  export async function createTodo(
    fixture: IFixture,
  ): Promise<api.ITodoTodo> {
    return api.functional.todo.user.todo.create_operation.create(
      fixture.connection,
      { title: "Test Todo", description: "Initial description" },
    );
  }
}
