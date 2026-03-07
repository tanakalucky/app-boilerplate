import { useActionState, useState } from "react";

import { Id } from "@/shared/api";
import { Button } from "@/shared/ui/Button";
import { FieldError } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { Item, ItemActions, ItemContent, ItemDescription } from "@/shared/ui/Item";

import { useTodoMutation } from "../../lib/use-todo-mutation";
import { Todo } from "../../model/todo";

// FIXME: 共通化するべき
interface FormState {
  error?: string;
}

export const TodoItem = ({ todo }: { todo: Todo }) => {
  const [isEditing, setIsEditing] = useState(false);

  const { editTodo, deleteTodo } = useTodoMutation();

  const [state, action, isPending] = useActionState<FormState, FormData>(async (_, formData) => {
    const intent = formData.get("intent") as string;

    if (intent === "delete") {
      try {
        await deleteTodo({
          todoId: todo.id as Id<"todos">,
        });
      } catch {
        return {
          error: "削除に失敗しました",
        };
      }
    }

    if (intent === "update") {
      try {
        await editTodo({
          todoId: todo.id as Id<"todos">,
          content: formData.get("content") as string,
        });

        setIsEditing(false);
      } catch {
        return {
          error: "保存に失敗しました",
        };
      }
    }

    return {};
  }, {});

  return (
    <form action={action}>
      <Item key={todo.id} className="flex flex-row items-start">
        <ItemContent>
          {isEditing ? (
            <Input name="content" defaultValue={todo.content} />
          ) : (
            <ItemDescription>{todo.content}</ItemDescription>
          )}

          {state.error && <FieldError>{state.error}</FieldError>}
        </ItemContent>

        <ItemActions>
          {isEditing ? (
            <>
              <Button type="button" onClick={() => setIsEditing(false)} disabled={isPending}>
                キャンセル
              </Button>

              <Button type="submit" name="intent" value="update" disabled={isPending}>
                保存
              </Button>
            </>
          ) : (
            <>
              <Button type="button" onClick={() => setIsEditing(true)} disabled={isPending}>
                編集
              </Button>
              <Button
                type="submit"
                name="intent"
                value="delete"
                disabled={isPending}
                className="bg-destructive"
              >
                削除
              </Button>
            </>
          )}
        </ItemActions>
      </Item>
    </form>
  );
};
