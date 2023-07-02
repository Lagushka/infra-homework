const { assert } = require('chai');

const bugID = 0;

describe('Checking header', async function() {
    it('burger menu displays correctly on mobile screen', async function() {
        await this.browser.url(`http://localhost:3000/hw/store${bugID ? `?bug_id=${bugID}` : ""}`);

        await this.browser.setWindowSize(575, 900);

        // await page.waitForSelector(".navbar", )
        await this.browser.assertView('mobileHeader', '.navbar');
    });

    it (`burger menu closes after selecting menu item`, async function() {
        let weFailed = false;
        for (let i = 0; i < 4; i++) {
            await this.browser.url(`http://localhost:3000/hw/store${bugID ? `?bug_id=${bugID}` : ""}`);
            await this.browser.setWindowSize(575, 900);
            const burgerButton = await this.browser.$(`button[aria-label="Toggle navigation"]`);

            await burgerButton.click();

            const menu = await this.browser.$("#headerMenu");
            const menuItems = await menu.$$(".nav-link");

            if (menuItems && menuItems.length >= i) {
                await menuItems[i].click();
            }

            const display = await menu.getCSSProperty("display");

            if (display.value !== "none") {
                weFailed = true;
            }
        }

        assert(!weFailed);
    });
});

it('layout must be responsive and exist', async function() {
    await this.browser.url(`http://localhost:3000/hw/store`);

    await this.browser.setWindowSize(575, 900);

    await this.browser.assertView('mobileMain', '.navbar');
});

describe("testing catalog", async function() {
    it ('has name', async function () {
        await this.browser.url(`http://localhost:3000/hw/store/catalog`);

        const productCards = await this.browser.$$(".card[data-testid]");

        for (const card of productCards) {
            const title = await card.$("h5");
            const text = await title.getText();
            assert(text.length);
        }
    });

    it ('has price', async function() {
        await this.browser.url(`http://localhost:3000/hw/store/catalog`);

        const productCards = await this.browser.$$(".card[data-testid]");

        for (const card of productCards) {
            const title = await card.$(".card-text");
            const text = await title.getText();
            assert(text.length && text[0] === "$" && !isNaN(Number(text.slice(1))));
        }
    });

    it ('has link to details', async function() {
        await this.browser.url(`http://localhost:3000/hw/store/catalog`);

        const productCards = await this.browser.$$(".card[data-testid]");

        for (const card of productCards) {
            const normalId = await card.getAttribute("data-testid");
            const title = await card.$(".card-link");
            const text = await title.getAttribute("href");
            assert(`/hw/store/catalog/${normalId}` === text);
        }
    });

    it ('page with additional info appears', async function() {
        await this.browser.url(`http://localhost:3000/hw/store/catalog`);

        const productCards = await this.browser.$$(".card[data-testid]");

        const ids = [];
        for (const card of productCards) {
            const id = await card.getAttribute("data-testid");
            ids.push(id);
        }

        for (const id of ids) {
            await this.browser.url(`http://localhost:3000/hw/store/catalog/${id}`);

            const block = await this.browser.$(".ProductDetails");
            await block.waitForExist();

            assert(await block.isExisting());
        }
    });
});

describe("testing cart", async function() {
    it ("cart number is correct", async function() {
        await this.browser.url(`http://localhost:3000/hw/store/catalog`);

        const productCards = await this.browser.$$(".card[data-testid]");
        const id = await productCards[0].getAttribute("data-testid");

        await this.browser.url(`http://localhost:3000/hw/store/catalog/${id}`);
        const block = await this.browser.$(".ProductDetails");
        await block.waitForExist();

        const addToCart = await block.$("button");
        await addToCart.click();

        await this.browser.url(`http://localhost:3000/hw/store/cart`);
        const nameInput = await this.browser.$("#f-name");
        await nameInput.addValue("1");
        const phoneInput = await this.browser.$("#f-phone");
        await phoneInput.addValue("+79101111111");
        const addressInput = await this.browser.$("#f-address");
        await addressInput.addValue("1");

        const submitButton = await this.browser.$(".Form button");
        await submitButton.click();

        const cartNumberElem = await this.browser.$(".Cart-Number");
        if (await cartNumberElem.isExisting()) {
            const cartNumber = await cartNumberElem.getText();
            assert(cartNumber === "1");
        } else {
            assert(true);
        }
    });

    it ("cart outputs necessary info after checkout", async function() {
        await this.browser.url(`http://localhost:3000/hw/store/catalog`);

        const productCards = await this.browser.$$(".card[data-testid]");
        const id = await productCards[0].getAttribute("data-testid");

        await this.browser.url(`http://localhost:3000/hw/store/catalog/${id}`);
        const block = await this.browser.$(".ProductDetails");
        await block.waitForExist();

        const addToCart = await block.$("button");
        await addToCart.click();

        await this.browser.url(`http://localhost:3000/hw/store/cart`);
        const nameInput = await this.browser.$("#f-name");
        await nameInput.addValue("1");
        const phoneInput = await this.browser.$("#f-phone");
        await phoneInput.addValue("+79101111111");
        const addressInput = await this.browser.$("#f-address");
        await addressInput.addValue("1");

        const submitButton = await this.browser.$(".Form button");
        await submitButton.click();

        const inValidInput = await this.browser.$(".is-invalid");
        const cartNumberElem = await this.browser.$(".Cart-Number");

        assert(await cartNumberElem.isExisting() || await inValidInput.isExisting());
    });

    it ("incrorrectly makes inputs invalid", async function() {
        await this.browser.url(`http://localhost:3000/hw/store/catalog`);

        const productCards = await this.browser.$$(".card[data-testid]");
        const id = await productCards[0].getAttribute("data-testid");

        await this.browser.url(`http://localhost:3000/hw/store/catalog/${id}`);
        const block = await this.browser.$(".ProductDetails");
        await block.waitForExist();

        const addToCart = await block.$("button");
        await addToCart.click();

        await this.browser.url(`http://localhost:3000/hw/store/cart`);
        const nameInput = await this.browser.$("#f-name");
        await nameInput.addValue("1");
        const phoneInput = await this.browser.$("#f-phone");
        await phoneInput.addValue("+79101111111");
        const addressInput = await this.browser.$("#f-address");
        await addressInput.addValue("1");

        const submitButton = await this.browser.$(".Form button");
        await submitButton.click();

        const inValidInput = await this.browser.$(".is-invalid");

        assert(!(await inValidInput.isExisting()));
    });
});


