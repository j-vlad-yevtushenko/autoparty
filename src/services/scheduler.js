'user strict';

const cron = require('node-cron');
const config = require('../config/config.json');

const tasks = new Map();

const schedule = (channelId, cronn, callback) => {
    if (!cron.validate(cronn)) return;

    if (tasks.has(channelId)) {
        cancel(channelId);
    }

    const task = cron.schedule(cronn, callback, {
        timezone: config.timezone
    });
    tasks.set(channelId, task);

    return task;
};

const scheduleDefault = (channelId, callback) => {
    return schedule(channelId, config.defaultCron, callback);
};

const cancel = (channelId) => {
    if (!tasks.has(channelId)) return;

    const task = tasks.get(channelId);
    tasks.delete(channelId);

    task.stop();
};

module.exports = {
    schedule: schedule,
    scheduleDefault: scheduleDefault,
    cancel: cancel
};

