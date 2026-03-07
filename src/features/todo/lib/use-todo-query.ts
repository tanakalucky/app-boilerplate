import { useQuery } from "convex/react";

import { convexApi } from "@/shared/api";

import { Todo } from "../model/todo";

export const useTodoQuery = (
  userId: string,
): {
  todos: Todo[] | undefined;
  isLoading: boolean;
} => {
  const todos = useQuery(convexApi.todos.getTodos, { userId });

  const isLoading = todos === undefined;

  const todoItems = todos
    ? todos.map((t) => {
        return {
          id: t._id,
          content: t.content,
        };
      })
    : undefined;

  return {
    todos: todoItems,
    isLoading,
  };
};
