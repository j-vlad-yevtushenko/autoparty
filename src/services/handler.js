'use strict';

const scheduler = require('./scheduler');
const statistic = require('./statistic');

const handler = {
  i(message) {
    message.reply(
      'Autoparty bot! :joystick: :joystick: :joystick:\n' +
      ':point_down::point_down::point_down:\n\n' +
      '`!i - info` -  інформація\n' +
      '`!at - announce at time` - анонс паті на конкретний час (!at 22)\n' +
      '`!every - schedule announcement at time` - автоматичний анонс паті\n' +
      '`!cancel - cancel announcement at time` - відміна автоматичного анонсу паті\n' +
      '`!go - go` - зазивала паті\n' +
      '`!s - stat` - статистика\n\n\n\n' +
      'created by https://github.com/j-vlad-yevtushenko'
    );
  },

  go(message) {
    message.channel.send('@here :regional_indicator_g: :regional_indicator_o: ');
  },

  at(message, args) {
    if (!args || args.length === 0) {
      message.channel.send('@here Cьогодні в/після 23:00 хтось буде?');
      return;
    }
    message.channel.send(`@here Cьогодні в/після ${args[0]} хтось буде?`);
  },

  every(message) {
    scheduler.scheduleDefault(message.channel.id, () => this.at(message));
    message.reply('Автоматичне опитування успішно додано');
  },

  cancel(message) {
    scheduler.cancel(message.channel.id, currentTask);
    message.reply('Автоматичне опитування видалено');
  },

  async s(message) {
    message.reply('Секунду, шукаю стату...');

    const statistics = await statistic.get();

    message.channel.send('', {
      embed: {
        color: 3447003,
        title: 'Статистика',
        url: statistics.url,
        description: `Тут можна переглянути статистику усіх наших каток`,
        thumbnail: {
          url: 'https://cdn.discordapp.com/app-icons/769990595627319387/d284cace8d89541b7c5461fed41f161a.png?size=256',
        },
        fields: [
          {
            name: 'Остання катка',
            value: `[:rainbow_flag:](${statistics.lastGameUrl})`,
          },
          {
            name: 'Усі катки за весь період',
            value: `[:pirate_flag:](${statistics.allGamesUrl})`,
          },
        ],
        timestamp: new Date(),
      },
    });
  },
};

module.exports = handler;
