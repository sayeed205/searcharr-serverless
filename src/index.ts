import { VercelRequest, VercelResponse } from '@vercel/node';
import { Telegraf } from 'telegraf';

import { development, production } from './core';

const BOT_TOKEN = process.env.TG_BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

bot.start(ctx => ctx.reply('Welcome'));

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
    await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
