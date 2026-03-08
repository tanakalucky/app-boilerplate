import { UserButton } from "@clerk/react";
import { ListTodo } from "lucide-react";

export const Header = () => {
  return (
    <header className="flex w-full items-center justify-between border-b border-border bg-linear-to-r from-primary/10 via-accent to-primary/5 px-6 py-4 shadow-sm">
      <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
        <ListTodo className="size-5" />
        Todoアプリ
      </h1>

      <UserButton />
    </header>
  );
};
