import { expect, test } from "@playwright/test";

test.describe("TODOアプリ", () => {
  // TODOを全て削除する
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    const list = page.getByRole("list");

    await list.waitFor();

    const items = await list.getByRole("listitem").all();

    for (const item of items) {
      await item.waitFor();

      const deleteButton = item.getByRole("button", { name: /削除/i });
      await deleteButton.click();
    }
  });

  test("TODOの追加、編集、削除ができる", async ({ page }) => {
    // Arrange
    const list = page.getByRole("list");

    await list.waitFor();

    await page.getByLabel("TODO").fill("新しいTODO");

    // Act
    await page.getByRole("button", { name: /追加/i }).click();

    // Assert
    const items = page.getByRole("listitem");
    const newItem = items.last();
    await expect(newItem).toContainText("新しいTODO");

    // Arrange
    await newItem.getByRole("button", { name: /編集/i }).click();
    await newItem.getByRole("textbox").fill("編集後のTODO");
    await newItem.getByRole("button", { name: /保存/i }).click();

    // Assert
    await expect(newItem).toContainText("編集後のTODO");

    // Arrange
    await newItem.getByRole("button", { name: /削除/i }).click();

    // Assert
    await expect(newItem).not.toBeVisible();
  });
});
