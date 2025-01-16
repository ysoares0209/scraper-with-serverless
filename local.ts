import { handler } from "./index";

(async () => {
  try {
    //@ts-ignore
    await handler({}, {}, () => {});
  } catch (e) {
    console.log("Error in Lambda Handler:", e);
  }
})();
