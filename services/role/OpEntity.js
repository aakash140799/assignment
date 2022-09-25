import {Sequelize, DataTypes} from 'sequelize';
import appException from '../../utils/appException.js';
import pino from 'pino';
import chalk from 'chalk';
import Constant from '../../utils/Constant.js';


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
            this.model = this.conn.define('OPERATION', {
                roleId : {
                    type : DataTypes.BIGINT,
                    primaryKey : true,
                },

                opName : {
                    type : DataTypes.TEXT(32),
                    primaryKey : true,
                }
                
            }, {freezeTableName : true, paranoid : false});

            await this.model.sync({force : false});
            logger.info(chalk.green('op table synced'));

            return this.model
            
        } catch(err) {
            logger.error(err, 'op model error');
            throw new appException(Constant.EntityFailed, err);
        }
    }
};

export default Entity;