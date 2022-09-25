import {Sequelize, DataTypes} from 'sequelize';
import appException from '../../utils/appException.js';
import pino from 'pino';
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
            this.model = this.conn.define('USER_LIKES', {
                userId : {
                    type : DataTypes.UUID,
                    primaryKey : true
                },

                postId : {
                    type : DataTypes.UUID,
                    primaryKey : true
                },

                like : {
                    type : DataTypes.INTEGER,
                    allowNull : false,
                    defaultValue : 0,
                    validate : {
                        isIn : {
                            args : [[-1, 0, 1]],
                            msg : JSON.stringify(Constant.InvalidLikeValue)
                        }
                    }
                }
                                
            }, {freezeTableName : true, paranoid : false});

            await this.model.sync({force : false});
            logger.info('user_likes table synced');

            return this.model
            
        } catch(err) {
            logger.error(err, 'user_likes model error');
            throw new appException(Constant.EntityFailed, err);
        }
    }
};

export default Entity;