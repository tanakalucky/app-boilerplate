import path from "node:path";
import { fileURLToPath } from "url";

import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";

setup.describe.configure({ mode: "serial" });

setup("global setup", async () => {
  await clerkSetup();
});

// 認証ファイルのパス
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, "./.auth/user.json");

setup("認証してストレージに状態を保存", async ({ page }) => {
  await page.goto("/");

  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_CLERK_USER_USERNAME!,
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    },
  });

  await page.goto("/");
  const appTitle = page.getByRole("heading", { name: /Todoアプリ/i });
  await appTitle.waitFor();

  // 認証状態を保存
  await page.context().storageState({ path: authFile });
});
