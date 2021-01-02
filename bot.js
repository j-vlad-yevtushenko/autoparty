'use strict';

const Discord = require('discord.js');
const winston = require('winston');
const handler = require('./src/handler');

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

const client = new Discord.Client();

client.on('ready', () => {
  logger.info('Started autoparty bot!');
});

client.on('message', (message) => {
  if (message.author.bot || !message.content.startsWith('!')) return;
  logger.info(`Guild [${message.guild.name}] Channel [${message.channel.name}] in touch`);
  logger.info(`New message from user:[${message.author.username}] content: [${message.content}]`);

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
