'use strict';

const discord = require('discord.js');
const winston = require('winston');
const handler = require('./services/handler');
const {scheduleDefault} = require('./services/scheduler');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'DD-MM-YYYY HH:MM:SS',
        }),
        winston.format.colorize(),
        winston.format.align(),
        winston.format.printf((info) => `[${info.timestamp}] [${info.level}] : ${info.message}`)
      ),
    }),
  ],
});

const client = new discord.Client();

client.on('ready', () => {
  logger.info('Started autoparty bot!');

  const textChannels = client.channels.cache.filter((chn) => chn.type === 'text');
  textChannels.forEach((chn) => {
    scheduleDefault(chn.id, () => chn.send('@here Cьогодні в/після 23:00 хтось буде?'));
  });
});

client.on('message', (message) => {
  if (message.author.bot || !message.content.startsWith('!')) return;
  logger.info(`Guild [${message.guild.name}] Channel [${message.channel.name}] in touch`);
  logger.info(`New message from user:[${message.author.username}] content: [${message.content}]`);
  console.log(message.author.id);
  const args = message.content.slice(1).trim().split(' ');
  const cmd = args.shift().toLowerCase();

  if (!handler[cmd]) {
    logger.warn(cmd);
    return;
  }

  try {
    logger.info(`Executing message handler:[${cmd}] with args:[${args}]`);
    handler[cmd](message, args);
    logger.info(`Message successfully handled and responded!`);
  } catch (error) {
    logger.error(`Error occured: ${error}`);
  }
});

client.login(process.env.TOKEN).catch((err) => {
  logger.error('Token does not exists. Please provide ENV variable');
  logger.error('Shuttind down application');
  process.exit();
});
