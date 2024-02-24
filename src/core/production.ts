import { VercelRequest, VercelResponse } from '@vercel/node';
import createDebug from 'debug';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

const debug = createDebug('bot:dev');

const PORT = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000;
const BASE_URL = `${process.env.BASE_URL}`;

const production = async (
    req: VercelRequest,
    res: VercelResponse,
    bot: Telegraf<Context<Update>>
) => {
    debug('Bot runs in production mode');
    debug(`setting webhook: ${BASE_URL}`);

    if (!BASE_URL) {
        throw new Error('BASE_URL is not set.');
    }

    const getWebhookInfo = await bot.telegram.getWebhookInfo();
    if (getWebhookInfo.url !== BASE_URL + '/api') {
        debug(`deleting webhook ${BASE_URL}`);
        await bot.telegram.deleteWebhook();
        debug(`setting webhook: ${BASE_URL}/api`);
        await bot.telegram.setWebhook(`${BASE_URL}/api`);
        console.log('Webhook set to:', BASE_URL + '/api');
        console.log('Webhook info:', await bot.telegram.getWebhookInfo());
    }
    console.log(getWebhookInfo);

    if (req.method === 'POST') {
        await bot.handleUpdate(req.body as unknown as Update, res);
    } else {
        res.status(200).json('Listening to bot events...');
    }
    debug(`starting webhook on port: ${PORT}`);
};
export { production };
