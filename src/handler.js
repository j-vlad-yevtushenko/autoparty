'use strict';

const userAgent = require('random-useragent');
const puppeteer = require('puppeteer-extra');

const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());

const handler = {
  i(message) {
    message.reply(
      'Autoparty bot для ксго! :joystick: :joystick: :joystick:\n' +
        ':point_down::point_down::point_down:\n' +
        '`!i - info` -  інформація\n' +
        '`!a - announce` - анонс дефолтного паті сьогодні (23 00)\n' +
        '`!at - announce at time` - анонс паті на конкретний час (!at 22)\n' +
        '`!s - stat` - статистика\n' +
        '`!b - bomj` - оприділяю бомжа з попередньої катки \n\n' +
        'created by https://github.com/j-vlad-yevtushenko'
    );
  },

  a(message) {
    message.channel.send('@here Cьогодні в/після 11 хтось буде?');
  },

  at(message, args) {
    if (!args || args.length === 0) {
      return this.a(message);
    }
    message.channel.send(`@here Cьогодні в/після ${args[0]} хтось буде?`);
  },

  b(message, args) {
    message.reply('Cекунду, шукаю бомжа...').then((msg) => {
      setTimeout(() => {
        message.reply('ти бомж!!! азаза');
      }, 1000);
    });
  },

  async s(message, args) {
    message.reply('Секунду, шукаю стату...');

    const path = 'https://csgostats.gg';
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.setUserAgent(userAgent.getRandom());
    await page.goto(path + '/player/76561198112704674#/matches');
    await page.waitForSelector('.table');

    const url = await page.$$eval('.table tbody tr:first-child.js-link', (trs) =>
      trs.map((tr) => {
        const attr = tr.getAttribute('onclick');
        const url = attr.substr(attr.search('/match/'));
        return url.substr(0, url.length - 2);
      })
    );

    message.channel.send('', {
      embed: {
        color: 3447003,
        title: 'Статистика',
        url: path,
        description: `Тут можна переглянути статистику усіх наших каток`,
        thumbnail: {
          url: 'https://cdn.discordapp.com/app-icons/769990595627319387/d284cace8d89541b7c5461fed41f161a.png?size=256',
        },
        fields: [
          {
            name: 'Остання катка',
            value: `[:rainbow_flag:](${path + url})`,
          },
          {
            name: 'Усі катки за весь період',
            value: `[:pirate_flag:](${page.url()})`,
          },
        ],
        timestamp: new Date(),
      },
    });

    await browser.close();
  },
};

module.exports = handler;
