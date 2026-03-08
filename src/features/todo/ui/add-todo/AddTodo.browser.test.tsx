import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

import { useTodoMutation } from "../../lib/use-todo-mutation";
import { AddTodo } from "./AddTodo";

vi.mock("@clerk/react", () => ({
  useAuth: vi.fn().mockReturnValue({ userId: "user123" }),
}));

vi.mock("../../lib/use-todo-mutation", () => ({
  useTodoMutation: vi.fn().mockReturnValue({ addTodo: vi.fn() }),
}));

const mockUseTodoMutation = vi.mocked(useTodoMutation);

describe("AddTodo", async () => {
  it("追加ボタン押下でTodoが追加されること", async () => {
    // Arrange
    const mockAddTodo = vi.fn().mockResolvedValue({});

    mockUseTodoMutation.mockReturnValue({
      addTodo: mockAddTodo as unknown as ReturnType<typeof useTodoMutation>["addTodo"],
      deleteTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["deleteTodo"],
      editTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["editTodo"],
    });

    const screen = await render(<AddTodo />);

    const addButton = screen.getByRole("button", { name: "追加" });

    const input = screen.getByLabelText("TODO");
    await input.fill("アプリを作る");

    // Act
    await userEvent.click(addButton);

    // Assert
    expect(mockAddTodo).toHaveBeenCalledWith({
      content: "アプリを作る",
      userId: "user123",
    });
  });

  it("入力内容が空の場合はエラーが表示され、追加されないこと", async () => {
    // Arrange
    const mockAddTodo = vi.fn().mockResolvedValue({});

    mockUseTodoMutation.mockReturnValue({
      addTodo: mockAddTodo as unknown as ReturnType<typeof useTodoMutation>["addTodo"],
      deleteTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["deleteTodo"],
      editTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["editTodo"],
    });

    const screen = await render(<AddTodo />);

    const addButton = screen.getByRole("button", { name: "追加" });

    const input = screen.getByLabelText("TODO");
    await input.fill("");

    // Act
    await userEvent.click(addButton);

    // Assert
    await expect.element(screen.getByRole("alert")).toHaveTextContent("TODOを入力してください");

    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it("TODO追加エラー時にエラーが表示され、追加されないこと", async () => {
    // Arrange
    const mockAddTodo = vi.fn().mockRejectedValue(new Error("TODO追加エラー"));

    mockUseTodoMutation.mockReturnValue({
      addTodo: mockAddTodo as unknown as ReturnType<typeof useTodoMutation>["addTodo"],
      deleteTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["deleteTodo"],
      editTodo: vi.fn() as unknown as ReturnType<typeof useTodoMutation>["editTodo"],
    });

    const screen = await render(<AddTodo />);

    const addButton = screen.getByRole("button", { name: "追加" });

    const input = screen.getByLabelText("TODO");
    await input.fill("アプリを作る");

    // Act
    await userEvent.click(addButton);

    // Assert
    expect(mockAddTodo).toHaveBeenCalled();

    await expect.element(screen.getByRole("alert")).toHaveTextContent("TODOの追加に失敗しました");
  });
});
