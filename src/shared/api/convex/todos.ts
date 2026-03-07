import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getTodos = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getTodo = query({
  args: {
    todoId: v.id("todos"),
  },
  handler: async (ctx, { todoId }) => {
    return await ctx.db.get("todos", todoId);
  },
});

export const addTodo = mutation({
  args: {
    userId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { userId, content }) => {
    await ctx.db.insert("todos", {
      userId,
      content,
    });
  },
});

export const deleteTodo = mutation({
  args: {
    todoId: v.id("todos"),
  },
  handler: async (ctx, { todoId }) => {
    await ctx.db.delete("todos", todoId);
  },
});

export const updateTodo = mutation({
  args: {
    todoId: v.id("todos"),
    content: v.string(),
  },
  handler: async (ctx, { todoId, content }) => {
    await ctx.db.patch("todos", todoId, {
      content,
    });
  },
});
