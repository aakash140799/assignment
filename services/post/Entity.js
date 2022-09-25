import {Sequelize, DataTypes} from 'sequelize';
import appException from '../../utils/appException.js';
import Constant from '../../utils/Constant.js';
import pino from 'pino';


const logger = pino();
class Entity {

    constructor(conn, userModel) {
        if(!(conn instanceof Sequelize) || userModel == null || userModel == undefined){
            throw new appException('InvalidArgument')
        }
        this.conn = conn;
        this.model = null;
        this.userModel = userModel;
    }


    async build() {

        if(this.model != null) {
            return this.model;
        }

        try
        {
            this.model = this.conn.define('POST', {
                id : {
                    type : DataTypes.UUID,
                    defaultValue : DataTypes.UUIDV4,
                    primaryKey : true
                },
    
                title : {
                    type : DataTypes.STRING(128),
                    allowNull : false,
                    validate : {
                        len : {
                            args : [1, 120],
                            msg : JSON.stringify(Constant.ReqTitleLen)
                        }
                    }
                },
            
                description : {
                    type : DataTypes.TEXT(),
                    allowNull : false,
                    validate : {
                        notEmpty : {
                            args : true,
                            msg : JSON.stringify(Constant.ReqDescLen)
                        },
                        len : {
                            args : [2, 28000],
                            msg : JSON.stringify(Constant.ReqDescLen)
                        }
                    }
                },
                
            }, {freezeTableName : true, paranoid : true});

            this.model.belongsTo(this.userModel, {as : 'user', onUpdate : 'CASCADE', onDelete : 'CASCADE'})
            
            await this.model.sync({force : false});
            logger.info('post table synced');

            return this.model
            
        } catch(err) {

            logger.error(err, 'post model error');
            throw new appException(Constant.EntityFailed, err);
        }
    }
};

export default Entity;