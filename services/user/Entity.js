import {Sequelize, DataTypes} from 'sequelize';
import appException from '../../utils/appException.js';
import Constant from '../../utils/Constant.js';
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
            this.model = this.conn.define('USER', {
                id : {
                    type : DataTypes.UUID,
                    defaultValue : DataTypes.UUIDV4,
                    primaryKey : true
                },
    
    
                email : {
                    type : DataTypes.STRING(50),
                    allowNull : false,
                    unique : true,
                    validate : {
                        isEmail : {
                            args : true,
                            msg : JSON.stringify(Constant.ReqEmailWrong)
                        },
                        len : {
                            args : [1, 48],
                            msg : JSON.stringify(Constant.ReqEmailLen)
                        }
                    }
                },
            
                password : {
                    type : DataTypes.STRING('400'),
                    allowNull : false
                },
            
                role : {
                    type : DataTypes.SMALLINT,
                    allowNull : false,
                    defaultValue : 0,
                },
                
            }, {freezeTableName : true, paranoid : true});

            await this.model.sync({force : false});
            logger.info(chalk.green('user table synced'));

            return this.model
            
        } catch(err) {
            logger.error(err, 'user model error');
            throw new appException('EntityFailed', err);
        }
    }
};

export default Entity;