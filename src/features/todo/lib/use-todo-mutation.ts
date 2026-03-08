import { useMutation } from "convex/react";

import { convexApi } from "@/shared/api";

export const useTodoMutation = () => {
  const addTodo = useMutation(convexApi.todos.addTodo);

  const editTodo = useMutation(convexApi.todos.updateTodo);

  const deleteTodo = useMutation(convexApi.todos.deleteTodo);

  return { addTodo, editTodo, deleteTodo };
};
