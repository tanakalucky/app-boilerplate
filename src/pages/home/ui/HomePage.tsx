import { useAuth } from "@clerk/react";
import { ListTodo } from "lucide-react";

import { AddTodo, TodoItem } from "@/features/todo";
import { useTodoQuery } from "@/features/todo/lib/use-todo-query";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Header } from "@/widgets/header";

export function HomePage() {
  const userId = useAuth().userId!;

  const { todos, isLoading } = useTodoQuery(userId);

  return (
    <div className="flex size-full flex-col items-center gap-4">
      <Header />

      <div className="flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-6 px-4 sm:px-6">
        <AddTodo />

        {isLoading ? (
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-4 py-3">
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="size-8 rounded-md" />
                  <Skeleton className="size-8 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-border bg-card shadow-sm">
            {todos && todos.length > 0 ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h2 className="text-sm font-medium text-foreground">タスク一覧</h2>
                  <span className="text-xs text-muted-foreground">{todos.length}件</span>
                </div>

                <div
                  className="flex min-h-0 flex-1 flex-col divide-y divide-border overflow-y-auto"
                  role="list"
                >
                  {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-12" role="list">
                <ListTodo className="size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">タスクがありません</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
