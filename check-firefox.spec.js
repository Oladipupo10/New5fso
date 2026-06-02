const {test, expect} = require('@playwright/test')
test('verify local firefox launch without download ', async ({page}) => {
    await page.goto('https://example.com')
    await expect(page).toHaveTitle(/Example Domain/)
})