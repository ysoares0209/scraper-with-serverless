import { Callback, Context, Handler } from "aws-lambda";
import { Browser, Page, LaunchOptions } from "puppeteer";
import { PuppeteerExtra } from "puppeteer-extra";

interface Event {}

export const handler: Handler = async (
  event: Event,
  context: Context,
  callback: Callback
): Promise<any> => {
  try {
    console.log("event:", event);
    const puppeteer: PuppeteerExtra = require("puppeteer-extra");
    const stealthPlugin = require("puppeteer-extra-plugin-stealth");
    puppeteer.use(stealthPlugin());

    const launchOptions: LaunchOptions = context.functionName
      ? {
          headless: true,
          executablePath: puppeteer.executablePath(),
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
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

    const browser: Browser = await puppeteer.launch(launchOptions);
    const page: Page = await browser.newPage();
    await page.goto("https://www.example.com");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(await page.content());
    await browser.close();
  } catch (e) {
    console.log("Error in Lambda Handler:", e);
    return e;
  }
};

