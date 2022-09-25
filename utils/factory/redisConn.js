import { createClient } from "redis";
import appException from "../appException.js";
import pino from 'pino';
import chalk from "chalk";

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
            const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
            const REDIS_PORT = process.env.REDIS_PORT || '6379';

            if(process.env.REDIS_HOST === undefined) {logger.warn(chalk.yellow('REDIS_HOST variable is not set'));}
            if(process.env.REDIS_PORT === undefined) {logger.warn(chalk.yellow('REDIS_PORT variable is not set'));}

            client = createClient({url: `redis://${REDIS_HOST}:${REDIS_PORT}`});

            await client.connect();
            client.on('error', (err) => {throw err});
            logger.info(chalk.green('redis connection build'));

            return client;
        } catch(err) {
            logger.error(err, chalk.red('redis connection failure'));
            throw new appException('RedisConnFailed', err);
        }
    }
};

export default Factory;