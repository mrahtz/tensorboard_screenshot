const url = process.argv[2];
const n_graphs_per_row = 5;
// Should contain tf-scalar-card children
const selector = '#center > div > tf-category-pane:nth-child(4) > iron-collapse > div > tf-paginated-view > div > div'

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
    const n_graphs = await page.$eval(selector, el => el.childElementCount);
    console.log("Found", n_graphs, "graphs")
    await page.setViewport({width: 50 + Math.min(n_graphs, n_graphs_per_row) * 430,
                            height: 410 + 300 * Math.ceil(n_graphs / n_graphs_per_row)});
    const dimensions = await page.$eval(selector, el => {return {
        x: el.getBoundingClientRect().x,
        y: el.getBoundingClientRect().y,
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
    }});
    await page.screenshot({path: 'screenshot.png', clip: dimensions});
    console.log("Screenshot saved to screenshot.png");
    await browser.close();
})();
