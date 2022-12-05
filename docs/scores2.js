const puppeteer = require('puppeteer')

async function run() {
    const browser =
        await puppeteer.launch(
            {
                headless: true,
            }
        )
    page =
        await browser.newPage()
    await page.goto(
        'https://scores.hssailing.org/f22/nwisa-girls-qualifiers/full-scores/'
    )

    const data =
        await page.evaluate(
            function () {
                const scoreData =
                    document.querySelectorAll(
                        '#menu > a'
                    ).textContent
                console.log(
                    scoreData
                )
                return scoreData
            }
        )
    console.log(
        await data
    )
    await browser.close()
}
run()
