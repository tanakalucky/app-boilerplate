import { UserButton } from "@clerk/clerk-react";

export const Header = () => {
  return (
    <header className="flex w-full items-center justify-between bg-accent px-4 py-2">
      <h1 className="text-xl font-bold">Todoアプリ</h1>

      <UserButton />
    </header>
  );
};
