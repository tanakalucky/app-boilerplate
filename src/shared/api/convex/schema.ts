import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    userId: v.string(),
    content: v.string(),
  }).index("by_user", ["userId"]),
});
