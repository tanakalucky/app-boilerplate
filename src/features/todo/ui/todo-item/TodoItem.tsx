import { Check, Pencil, Trash2, X } from "lucide-react";
import { useActionState, useState } from "react";

import { Id } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import { FieldError } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { Item, ItemActions, ItemContent, ItemDescription } from "@/shared/ui/Item";

import { useTodoMutation } from "../../lib/use-todo-mutation";
import { FormState } from "../../model/form-state";
import { Todo } from "../../model/todo";

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
      <Item
        key={todo.id}
        className={cn(
          "group/todo-item flex flex-row rounded-none transition-colors hover:bg-muted/50",
          isEditing && "bg-muted/30",
          state.error ? "items-start" : "items-center",
        )}
        role="listitem"
      >
        <ItemContent>
          {isEditing ? (
            <Input name="content" defaultValue={todo.content} />
          ) : (
            <ItemDescription>{todo.content}</ItemDescription>
          )}

          {state.error && <FieldError>{state.error}</FieldError>}
        </ItemContent>

        <ItemActions className="md:opacity-0 md:group-hover/todo-item:opacity-100 md:focus-within:opacity-100">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
                aria-label="キャンセル"
              >
                <X />
              </Button>

              <Button
                type="submit"
                variant="ghost"
                size="icon-sm"
                name="intent"
                value="update"
                disabled={isPending}
                aria-label="保存"
              >
                <Check />
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsEditing(true)}
                disabled={isPending}
                aria-label="編集"
              >
                <Pencil />
              </Button>
              <Button
                type="submit"
                variant="ghost"
                size="icon-sm"
                name="intent"
                value="delete"
                disabled={isPending}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="削除"
              >
                <Trash2 />
              </Button>
            </>
          )}
        </ItemActions>
      </Item>
    </form>
  );
};
