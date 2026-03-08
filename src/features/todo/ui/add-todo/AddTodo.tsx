import { useAuth } from "@clerk/react";
import { Plus } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/shared/ui/Button";
import { Field, FieldError } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";

import { useTodoMutation } from "../../lib/use-todo-mutation";
import { FormState } from "../../model/form-state";

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
    <form action={action} className="w-full rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex items-end gap-1.5">
        <Field className="flex-1 gap-1.5">
          <Input name="content" aria-label="TODO" placeholder="TODOを入力" />

          {state.error && <FieldError>{state.error}</FieldError>}
        </Field>

        <Button type="submit" disabled={isPending} size="icon" aria-label="追加">
          <Plus />
        </Button>
      </div>
    </form>
  );
};
