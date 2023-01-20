import config from "./config.js";

const delay = ms => new Promise(res => setTimeout(res, ms));

async function test() {
    const url = "http://localhost:8000";
    let res;
    for (let i = 0; i < config.RATE_LIMIT_THRESHOLD; i++) {
        const res = await fetch(url);
        console.log(res.status);
        if (res.status !== 200) {
            throw Error("Test Failed! API failed for happy flow.");
        }
    }
    res = await fetch(url);
    console.log(res.status);
    if (res.status !== 429) {
        throw Error("Test Failed! API failed for Negative flow.");
    }
    await delay(config.RATE_LIMIT_WINDOW);
    res = await fetch(url);
    console.log(res.status);
    if (res.status !== 200) {
        throw Error("Test Failed! API request blocked!")
    }
    console.log("Test Success!");
}

await test();