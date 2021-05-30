'use strict';

const userAgent = require('random-useragent');
const puppeteer = require('puppeteer-extra');

const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());

const get = async () => {
    const path = 'https://csgostats.gg';
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.setUserAgent(userAgent.getRandom());
    await page.goto(path + '/player/76561198112704674#/matches');
    await page.waitForSelector('.table');

    const lastGameUriPart = await page.$$eval('.table tbody tr:first-child.js-link', (trs) =>
        trs.map((tr) => {
            const attr = tr.getAttribute('onclick');
            const url = attr.substr(attr.search('/match/'));
            return url.substr(0, url.length - 2);
        })
    );

    await browser.close();

    return {
        url: path,
        lastGameUrl: path + lastGameUriPart,
        allGamesUrl: page.url()
    };
};

module.exports = { get: get };
