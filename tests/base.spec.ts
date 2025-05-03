import { test } from "@playwright/test";
import v8toIstanbul from "v8-to-istanbul";
import MCR from "monocart-coverage-reports";

const URL = "http://localhost:4173/";

import fs from "fs";
// import v8toIstanbul from "v8-to-istanbul";

// function convertToIstanbulFormat(coverage) {
//   return coverage.map((entry) => ({
//     url: entry.url,
//     ranges: entry.ranges,
//     text: entry.text,
//   }));
// }

test.describe("tests", () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([
      page.coverage.startJSCoverage({
        resetOnNavigation: false,
      }),
      page.coverage.startCSSCoverage({
        resetOnNavigation: false,
      }),
    ]);
    await page.goto(URL);
  });

  test("cho s ebalom", async ({ page }) => {
    // await page.getByText("Сделать дз по матану").click();
    await page.waitForTimeout(1000);

    const [jsCoverage, cssCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
      page.coverage.stopCSSCoverage(),
    ]);

    // const alo = JSON.stringify(jsCoverage);
    // console.log('alo', alo);

    // const mem = JSON.parse(alo.replace(".scss", ".css"));

    // const mem = jsCoverage.map((el) => {
    //   el.url = el.url.replace("scss", "css");
    //   return el;
    // });

    // console.log(cssCoverage);

    const coverageData = [...jsCoverage, ...cssCoverage];

    const coverageReport = MCR({
      name: "My Coverage Report",
      outputDir: "./coverage-reports",
      reports: [["v8"]],
    });
    coverageReport.cleanCache();
    await coverageReport.add(coverageData);
    await coverageReport.generate();

    // for (const entry of jsCoverage) {
    //   const converter = v8toIstanbul('', 0, { source: entry.source });
    //   await converter.load();
    //   converter.applyCoverage(entry.functions);
    //   fs.writeFileSync('./coverage-reports/alo.json', JSON.stringify(converter.toIstanbul()));
    // }

    fs.writeFileSync(
      "./coverage-reports/coverage-report.json",
      JSON.stringify(coverageData)
    );

    // for (const entry of jsCoverage) {
    //   const converter = v8toIstanbul("", 0, {
    //     source: entry.url.replace("http://localhost:4173", "./dist"),
    //   });
    //   await converter.load();
    //   converter.applyCoverage(entry.functions);
    //   console.log(JSON.stringify(converter.toIstanbul()));
    // }

    // let res = "";

    // for (const entry of coverageData) {
    //   const converter = v8toIstanbul("", 0, { source: entry.source });
    //   await converter.load();
    //   converter.applyCoverage(entry.functions);
    //   res += JSON.stringify(converter.toIstanbul());
    // }

    // fs.writeFileSync("css-coverage.json", JSON.stringify(res));

    // await page.getByText("Покормить себя").click();

    // await expect(page).toHaveScreenshot("all_tasks_checked.png");

    // await page.getByText("Активные").click();
    // await expect(page).toHaveScreenshot("all_tasks_checked_active.png");

    // await page.getByText("Завершенные").click();
    // await expect(page).toHaveScreenshot("all_tasks_checked_completed.png");
  });

  // test("All tasks unchecked", async ({ page }) => {
  //   await page.getByText("Покормить кошку").click();
  //   await page.getByText("Покормить собаку").click();

  //   await expect(page).toHaveScreenshot("all_tasks_unchecked.png");

  //   await page.getByText("Активные").click();
  //   await expect(page).toHaveScreenshot("all_tasks_unchecked_active.png");

  //   await page.getByText("Завершенные").click();
  //   await expect(page).toHaveScreenshot("all_tasks_unchecked_completed.png");
  // });

  // test("All tasks deleted", async ({ page }) => {
  //   await page.getByText("×").first().click();
  //   await page.getByText("×").first().click();
  //   await page.getByText("×").first().click();
  //   await page.getByText("×").first().click();

  //   await expect(page).toHaveScreenshot("all_tasks_deleted.png");

  //   await page.getByText("Активные").click();
  //   await expect(page).toHaveScreenshot("all_tasks_deleted_active.png");

  //   await page.getByText("Завершенные").click();
  //   await expect(page).toHaveScreenshot("all_tasks_deleted_completed.png");
  // });

  // test("New long task check", async ({ page }) => {
  //   await page
  //     .getByPlaceholder("Введите тудушку...")
  //     .fill(
  //       "Надо бы сделать вообще очень много чего, но я так устал, что делать ничего и не хочется, может просто кошку с собакой покормить?"
  //     );

  //   await page.getByText("Добавить").click();
  //   await expect(page).toHaveScreenshot("new_long_task.png");

  //   await page.getByText("Активные").click();
  //   await expect(page).toHaveScreenshot("new_long_task_active.png");

  //   await page.getByText("Завершенные").click();
  //   await expect(page).toHaveScreenshot("new_long_task_completed.png");
  // });

  // test("New short task check", async ({ page }) => {
  //   await page.getByPlaceholder("Введите тудушку...").fill("Встать с кровати");

  //   await page.getByText("Добавить").click();
  //   await expect(page).toHaveScreenshot("new_short_task.png");

  //   await page.getByText("Активные").click();
  //   await expect(page).toHaveScreenshot("new_short_task_active.png");

  //   await page.getByText("Завершенные").click();
  //   await expect(page).toHaveScreenshot("new_short_task_completed.png");
  // });
});
