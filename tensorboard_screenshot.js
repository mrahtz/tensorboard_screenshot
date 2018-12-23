const url = process.argv[2];
const n_graphs_per_row = 5;

const puppeteer = require('puppeteer');

(async () => {
    console.log("Starting browser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url + '/#scalars&tagFilter=.*');
    await page.evaluate(() => {localStorage.setItem('TF.TensorBoard.PaginatedView.limit', '99')});
    await page.evaluate(() => {localStorage.setItem('_ignoreYOutliers', 'false')});
    console.log("Waiting for page to finish loading...");
    await page.reload({"waitUntil": "networkidle2"});
    const n_graphs = await page.$eval('tf-scalar-card', el => el.parentElement.childElementCount);
    console.log("Found", n_graphs, "graphs")
    await page.setViewport({width: 50 + Math.min(n_graphs, n_graphs_per_row) * 430,
                            height: 410 + 300 * Math.ceil(n_graphs / n_graphs_per_row)});
    const dimensions = await page.$eval('tf-scalar-card', el => {return {
        x: el.parentElement.getBoundingClientRect().x,
        y: el.parentElement.getBoundingClientRect().y,
        width: el.parentElement.getBoundingClientRect().width,
        height: el.parentElement.getBoundingClientRect().height,
    }});
    console.log("Taking screenshot...")
    await page.screenshot({path: 'screenshot.png', clip: dimensions});
    console.log("Screenshot saved to screenshot.png");
    await browser.close();
})();
