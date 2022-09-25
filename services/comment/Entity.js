import {Sequelize, DataTypes, Model} from 'sequelize';
import appException from '../../utils/appException.js';
import Constant from '../../utils/Constant.js';
import pino from 'pino';


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
            this.model = this.conn.define('COMMENT', {
                id : {
                    type : DataTypes.UUID,
                    defaultValue : DataTypes.UUIDV4,
                    primaryKey : true
                },

                userId : {
                    type : DataTypes.UUID,
                    allowNull : false,
                },

                postId : {
                    type : DataTypes.UUID,
                    allowNull : false,
                },
    
                comment : {
                    type : DataTypes.STRING(128),
                    allowNull : false,
                    validate : {
                        notEmpty : {
                            args : true,
                            msg : JSON.stringify(Constant.CommentLen)
                        },
                        len : {
                            args : [1, 120],
                            msg : JSON.stringify(Constant.CommentLen)
                        }
                    }
                },
                
            }, {freezeTableName : true, paranoid : false});

            // this.model.belongsTo(this.userModel, {as : 'user', onDelete : 'CASCADE', onUpdate : 'CASCADE'});
            // this.model.belongsTo(this.postModel, {as : 'post', onDelete : 'CASCADE', onUpdate : 'CASCADE'});

            await this.model.sync({force : false});
            logger.info('comment table synced');

            return this.model
            
        } catch(err) {
            logger.error(err, 'comment model error');
            throw new appException(Constant.EntityFailed, err);
        }
    }
};

export default Entity;