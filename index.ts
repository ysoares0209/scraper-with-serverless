import { Context, Handler } from "aws-lambda";
import { Browser, Page, LaunchOptions } from "puppeteer";
import { PuppeteerExtra } from "puppeteer-extra";

interface Event {
  website: string;
}

export const handler: Handler = async (event: Event, context: Context): Promise<any> => {
  try {
    console.log("event:", event);
    console.log("context:", context);
    const website = event.website;

    const puppeteer: PuppeteerExtra = require("puppeteer-extra");
    const stealthPlugin = require("puppeteer-extra-plugin-stealth");
    puppeteer.use(stealthPlugin());
    console.log("Loaded puppeteer & plugins");

    const chromePath =
      ".cache/puppeteer/chrome-headless-shell/linux-132.0.6834.83/chrome-headless-shell-linux64/chrome-headless-shell";
    const launchOptions: LaunchOptions = context.functionName
      ? {
          headless: true,
          executablePath: chromePath,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--single-process",
            "--incognito",
            "--disable-client-side-phishing-detection",
            "--disable-software-rasterizer",
          ],
        }
      : {
          headless: false,
          executablePath: puppeteer.executablePath(),
        };

    console.log("Loaded launch options");
    const browser: Browser = await puppeteer.launch(launchOptions);
    const page: Page = await browser.newPage();
    console.log("Opened browser & page");
    await page.goto(website, { timeout: 30000, waitUntil: "networkidle2" });
    console.log("Navigated to website");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(await page.content());
    await browser.close();
  } catch (e) {
    console.log("Error in Lambda Handler:", e);
    return e;
  }
};
