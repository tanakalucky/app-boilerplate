import { useAuth } from "@clerk/clerk-react";
import { useActionState } from "react";

import { Button } from "@/shared/ui/Button";
import { Field, FieldError } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";

import { useTodoMutation } from "../../lib/use-todo-mutation";

interface FormState {
  error?: string;
}

export const AddTodo = () => {
  const { userId } = useAuth();
  if (!userId) return;

  const { addTodo } = useTodoMutation();

  const [state, action, isPending] = useActionState<FormState, FormData>(async (_, formData) => {
    const content = formData.get("content") as string;
    if (!content) return { error: "TODOを入力してください" };

    try {
      await addTodo({ content: content.trim(), userId });
    } catch (error) {
      console.error("TODOの追加に失敗しました", error);
      return { error: "TODOの追加に失敗しました" };
    }

    return {};
  }, {});

  return (
    <form action={action} className="flex min-w-full items-end gap-4 pr-4 sm:max-w-sm">
      <Field className="gap-2">
        <Input name="content" aria-label="TODO" placeholder="TODOを入力" />

        {state.error && <FieldError>{state.error}</FieldError>}
      </Field>

      <Button type="submit" disabled={isPending}>
        追加
      </Button>
    </form>
  );
};
