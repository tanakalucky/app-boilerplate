import { useAuth } from "@clerk/clerk-react";

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

      <div className="flex min-h-0 w-[50%] flex-1 flex-col gap-4">
        <AddTodo />

        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto" role="list">
            {todos?.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
