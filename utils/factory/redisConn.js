import { createClient } from "redis";
import appException from "../appException.js";
import pino from 'pino';
import chalk from "chalk";
import Constant from "../Constant.js";

var client = null;
const logger = pino();
class Factory
{
    static async build()
    {
        if(client != null){
            return client;
        }

        try {
            const REDIS_URL = process.env.REDIS_URL || 'redis://red-ccnvtmta49940mp43c6g:6379';

            if(process.env.REDIS_URL === undefined) {logger.warn('REDIS_URL variable is not set');}

            client = createClient({url: REDIS_URL});

            await client.connect();
            client.on('error', (err) => {throw err});
            logger.info(chalk.green('redis connection build'));

            return client;
        } catch(err) {
            logger.error(err, chalk.red('redis connection failure'));
            throw new appException(Constant.RedisConnFailed, err);
        }
    }
};

export default Factory;