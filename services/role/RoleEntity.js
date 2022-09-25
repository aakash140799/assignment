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
            this.model = this.conn.define('ROLE', {
                id : {
                    type : DataTypes.BIGINT,
                    primaryKey : true,
                    autoIncrement : true,
                },
                
            }, {freezeTableName : true, paranoid : false});

            await this.model.sync({force : false});
            logger.info(chalk.green('role table synced'));

            return this.model
            
        } catch(err) {
            logger.error(err, 'role model error');
            throw new appException(Constant.EntityFailed, err);
        }
    }
};

export default Entity;