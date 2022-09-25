import {Sequelize, DataTypes} from 'sequelize';
import appException from '../../utils/appException.js';
import pino from 'pino';
import chalk from 'chalk';


const logger = pino();
class Entity {

    constructor(conn) {
        if(!(conn instanceof Sequelize)){
            throw new appException('InvalidArgument')
        }
        this.conn = conn;
        this.model = null;
    }


    async build() {

        if(this.model != null) {
            return this.model;
        }

        try
        {
            this.model = this.conn.define('FOLLOWER', {
                followerId : {
                    type : DataTypes.UUID,
                    primaryKey : true
                },
    
                followeeId : {
                    type : DataTypes.UUID,
                    primaryKey : true
                }
                
            }, {freezeTableName : true, paranoid : false});


            await this.model.sync({force : true});
            logger.info(chalk.green('follower table synced'));

            return this.model
            
        } catch(err) {
            logger.error(err, 'follower model error');
            throw new appException('EntityFailed', err);
        }
    }
};

export default Entity;