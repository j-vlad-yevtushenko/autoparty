'use strict';

const userAgent = require('random-useragent');
const puppeteer = require('puppeteer-extra');
const config = require('../config/config.json');

const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());

const get = async (discordUserId) => {
    const path = 'https://csgostats.gg';
    const steamId = resolve(discordUserId);
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.setUserAgent(userAgent.getRandom());
    await page.goto(path + `/player/${steamId}#/matches`);
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

const resolve = (discordUserId) => {
    return config.clientSteamIds[discordUserId] ? config.clientSteamIds[discordUserId] : '76561198112704674';
};

module.exports = { get: get };
