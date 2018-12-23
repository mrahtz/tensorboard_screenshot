Install

const puppeteer = require('puppeteer');
const url = process.argv[2];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({width: 2100, height:2000});
    await page.goto(url + '/#scalars&tagFilter=.*');
    await page.evaluate(() => {localStorage.setItem('TF.TensorBoard.PaginatedView.limit', '99')});
    await page.evaluate(() => {localStorage.setItem('_ignoreYOutliers', 'false')});
    await page.reload({"waitUntil": "networkidle2"});
    const dimensions = await page.$eval('tf-category-pane', el => {return {
        x: el.getBoundingClientRect().x,
        y: el.getBoundingClientRect().y,
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
    }});
    await page.screenshot({path: 'screenshot.png', clip: dimensions});
    await browser.close();
})();