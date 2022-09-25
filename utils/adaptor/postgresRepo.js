import appException from "../appException.js";
import pino from 'pino';
import chalk from "chalk";
import { Sequelize } from "sequelize";
import pIterations from 'p-iteration';


const logger = pino();
const Op = Sequelize.Op;
const pForEach = pIterations.forEach;
class Adaptor  {

    constructor(schema, cache, endpoint, configs) {
        if(schema == null || schema == undefined || cache == null || cache == undefined) {
            throw new appException('NullValue');
        }

        this.schema = schema;
        this.cache = cache;
        this.endpoint = endpoint;
        this.configs = configs;
        logger.info(this.endpoint + ' repo built');
    }

    formatQuery(query) {
        var doc = {};
        Object.keys(query).forEach(key => {
            if(key != 'role' && key !== 'userId' && key !== 'id' && key !== 'postId' && key !== 'commentId' && key !== 'roleId' && key !== 'opName'){
                doc[key] = {[Op.like] :  query[key]};
            }
        });

        return doc;
    }

    getConn() {
        return this.schema;
    }

    async create(doc) {
        try{
            // create in db
            var res = await this.schema.create(doc, {returning : true});

            var data = res.dataValues;
            var isNewRecords = res._options.isNewRecord;

            // create in cache
            if(this.configs.cacheSingle) {
                var key = Object.keys(data).filter(i => this.configs.keyColumns.has(i)).map(i => data[i]);
                await this.cache.setKey(key, data);
            }            

            return data;
        } catch(err) {
            logger.error(err, chalk.red('repo.create error'));
            throw appException.fromError(err);
        }
    }

    async update(keyDoc, doc) {
        try{
            // clean keyDoc
            Object.keys(keyDoc).forEach(key => {
                if(!this.configs.keyColumns.has(key)) {
                    delete keyDoc[key];
                }
            })

            // update in db
            var res = await this.schema.update(doc, {where : keyDoc, returning : true, paranoid : true});
            res = res[1][0];

            // get result
            var data = res.dataValues;
            var isNewRecords = res._options.isNewRecord;

            // create in cache
            if(this.configs.cacheSingle) {
                var key = Object.keys(data).filter(i => this.configs.keyColumns.has(i)).map(i => data[i]);
                await this.cache.setKey(key, data);
            }

            return data;
        } catch(err) {
            logger.error(err, chalk.red('repo.update error'));
            throw appException.fromError(err);
        }
    }


    async upsert(doc) {
        try{

            // update in db
            var res = await this.schema.upsert(doc, {validate: true, returning : true});
            res = res[0];

            // get result
            var data = res.dataValues;
            var isNewRecords = res._options.isNewRecord;

            // create in cache
            if(this.configs.cacheSingle) {
                var key = Object.keys(data).filter(i => this.configs.keyColumns.has(i)).map(i => data[i]);
                await this.cache.setKey(key, data);
            }

            return data;
        } catch(err) {
            logger.error(err, chalk.red('repo.update error'));
            throw appException.fromError(err);
        }
    }

    async get(keyDoc) {
        try{
            // clean keyDoc
            Object.keys(keyDoc).forEach(key => {
                if(!this.configs.keyColumns.has(key)) {
                    delete keyDoc[key];
                }
            })

            // find in cache
            if(this.configs.cacheSingle) {
                var key = Object.keys(keyDoc).filter(i => this.configs.keyColumns.has(i)).map(i => keyDoc[i]);
                const cRes = await this.cache.getKey(key);
                if(cRes.success){
                    console.log('found in cache');
                    return cRes.response;
                }
            }

            // find in db
            var res = await this.schema.findAll({where : keyDoc});
            if(res.length == 0){throw new appException('EntityNotFound');}
            res = res[0];
            
            // get result
            var data = res.dataValues;
            var isNewRecords = res._options.isNewRecord;

            // create in cache
            if(this.configs.cacheSingle) {
                var key = Object.keys(data).filter(i => this.configs.keyColumns.has(i)).map(i => data[i]);
                await this.cache.setKey(key, data);
            }

            return data;
        } catch(err) {

            logger.error(err, chalk.red('repo.get error'));
            throw appException.fromError(err);
        }
    }

    async delete(keyDoc) {
        try{
            // clean keyDoc
            Object.keys(keyDoc).forEach(key => {
                if(!this.configs.keyColumns.has(key)) {
                    delete keyDoc[key];
                }
            })

            // delete in db
            const res = await this.schema.destroy({where : keyDoc, cascade : true});
            if(res == 0){throw new appException('ItemNotFound');}

            // delete in cache
            if(this.configs.cacheSingle) {
                var key = Object.keys(keyDoc).filter(i => this.configs.keyColumns.has(i)).map(i => keyDoc[i]);
                await this.cache.delKey(key);
            }

            return {success : true};
        } catch(err) {
            logger.error(err, chalk.red('repo.delete error'));
            throw appException.fromError(err);
        }
    }


    async createMany(docs) {
        try{
            // create in db
            var res =   await this.schema.bulkCreate(docs, {validate : true, ignoreDuplicates : false});
            res = res.map(val => val.dataValues);

            // return result
            return res;
        } catch(err) {
            logger.error(err, chalk.red('repo.createMany error'));
            throw appException.fromError(err);
        }
    }


    async updateMany(query, exact, updateDoc) {
        try{
            if(exact === false){query = this.formatQuery(query);}

            // update in db
            var res = await this.schema.update(updateDoc, {where : query, cascade : true, paranoid : true, validate : true, returning : true});
            if(res.length == 0 || res.length == 1){return [];}
            var bulkData = res[1].map(i => i.dataValues);

            // delete in cache
            await this.cache.flush();
            
            // return
            return bulkData;
        } catch(err) {
            logger.error(err, chalk.red('repo.updateMany error'));
            throw appException.fromError(err);
        }
    }

    async deleteMany(query, exact) {
        try{
            if(exact === false){query = this.formatQuery(query);}

            // delete in db
            var res = await this.schema.destroy({where : query, cascade : true});

            // delete in cache
            await this.cache.flush();

            return {count : res}
        } catch(err) {
            logger.error(err, chalk.red('repo.deleteMany error'));
            throw appException.fromError(err);
        }
    }

    /**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */


    async getMany(query, exact, select, pageNo, count) {
        if(pageNo <= 0){throw new appException('InvalidPageNo');}
        if(count <= 0){throw new appException('InvalidCount');}
        var key = JSON.stringify(query) + "~" + JSON.stringify(select) + "~" + pageNo + "~" + count + "~";
        if(exact === false){query = this.formatQuery(query);}

        if(this.configs.cacheMany) {
            
            var cRes = await this.cache.getKey(key);
            if(cRes.success) {
                console.log('found in cache');
                return cRes.response;
            }
        }

        try{
            // get from db
            var res = [];
            if(select != null) {
                var res = await this.schema.findAll({where : query, paranoid : true, limit : count , offset : (pageNo-1)*count, attributes : select});
            } else{
                var res = await this.schema.findAll({where : query, paranoid : true, limit : count , offset : (pageNo-1)*count});
            }
            
            var bulkData = res.map(data => data.dataValues);

            //set in cache
            if(this.configs.cacheMany) {
                var key = JSON.stringify(query) + "~" + JSON.stringify(select) + "~" + pageNo + "~" + count + "~";
                var cRes = await this.cache.setKeyWithExp (key, bulkData, 10);
            }

            // return result
            return bulkData;
        } catch(err) {
            logger.error(err, chalk.red('repo.getMany error'));
            throw appException.fromError(err);
        }
    }
};

export default Adaptor;