import sequelize from 'sequelize';
import appException from '../appException.js';
import pino from 'pino';
import chalk from 'chalk';


var conn = null;
const logger = pino();
class Factory
{
    static async build()
    {
        if(conn != null) {
            return conn;
        }

        try
        {
            var PGUser = process.env.POSTGRES_USERNAME || 'postgres';
            var PGPassword = process.env.POSTGRES_PASSWORD || '140799aash';
            var PGHost = process.env.POSTGRES_HOST || 'localhost';
            var PGDb = process.env.POSTGRES_DB || 'assignment';
            var PGPassEnc = process.env.POSTGRES_PASS_ENV || 'false';


            if(process.env.POSTGRES_USERNAME === undefined) {logger.warn(chalk.yellow('POSTGRES_USERNAME variable is not set'));}
            if(process.env.POSTGRES_PASSWORD === undefined) {logger.warn(chalk.yellow('POSTGRES_PASSWORD variable is not set'));}
            if(process.env.POSTGRES_HOST === undefined) {logger.warn(chalk.yellow('POSTGRES_HOST variable is not set'));}
            if(process.env.POSTGRES_DB === undefined) {logger.warn(chalk.yellow('POSTGRES_DB variable is not set'));}
            if(process.env.POSTGRES_PASS_ENC === undefined) {logger.warn(chalk.yellow('POSTGRES_PASS_ENC variable is not set'));}

            conn = new sequelize.Sequelize(PGDb, PGUser, PGPassword, {
                host : PGHost,
                dialect : 'postgres',
                logging : console.log
            });

            await conn.authenticate();
            logger.info('postgres connection built');

            return conn;
        } catch(err) {
            logger.error(err, chalk.red('Connection Factory Error'));
            throw new appException('ConnFailed', err);
        }
    }
}

export default Factory;