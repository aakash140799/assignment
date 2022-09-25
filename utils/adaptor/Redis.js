import appException from '../appException.js';
import pino from 'pino';


const logger = pino();
class Adaptor {

    constructor(client, endpoint = '') {
        
        this.client = client;
        this.endpoint = String(endpoint).toUpperCase();
        
        logger.info(this.endpoint + ' redis adaptor built');
    }

    buildKey(key) {
        return this.endpoint + '~' + key;
    }

    redisSymbol(type) {
        switch(type) {
            case 'present' : return 'XX';
            case 'absent' : return 'NX';
            case 'always' : return 'null';
            default : throw new appException(errTy.Invalid, 'setWhen');
        }
    }

    async flush() {
        try{
            return await this.client.sendCommand(['FLUSHALL']);
        } catch(err) {

            logger.error(err, 'redis error');
            throw appException.fromError(err);
        } 
    }

    async getAllKeys() {
        try{
            var res = await this.client.sendCommand(['KEYS', '*']);
            return {success : true, response : res};
        } catch(err) {

            logger.error(err, 'redis error');
            throw appException.fromError(err);
        }
    }

    async setKey(key, value, type = 'always') {
        try{
            key = this.buildKey(JSON.stringify(key));
            value = JSON.stringify(value);
            var res = await this.client.sendCommand(this.redisSymbol(type) !== 'null' ? ['SET', key, value, this.redisSymbol(type)] : ['SET', key, value]);
            if(res == 'OK'){res = {success : true}}
            else{res = {success : false}}

            return res;
        } catch(err) {

            logger.error(err, 'redis error');
            throw appException.fromError(err);
        }
    }

    async setKeyWithExp(key, value, sec) {
        try{
            key = this.buildKey(JSON.stringify(key));
            value = JSON.stringify(value);
            var res = await this.client.sendCommand(['SET', key, value, 'EX', String(sec)]);
            if(res == 'OK'){res = {success : true}}
            else{res = {success : false}}

            return res;
        } catch(err) {

            logger.error(err, 'redis error');
            throw appException.fromError(err);
        }
    }

    async getKey(key) {
        try{
            key = this.buildKey(JSON.stringify(key));
            var value = JSON.parse(await this.client.sendCommand(['GET', key]));

            if(value == null || value == undefined) {return {success : false, response : null};}
            else {return {success : true, response : value}};

        } catch(err) {

            logger.error(err, 'redis error');
            throw appException.fromError(err);
        }
    }

    async delKey(key) {
        try{
            key = this.buildKey(JSON.stringify(key));
            var value = await this.client.sendCommand(['DEL', key]);
            
            if(value == 0 || value == null || value == undefined) {return {success : false, response : value};}
            else {return {success : true, response : value}};

        } catch(err) {

            logger.error(err, 'redis error');
            throw appException.fromError(err);
        }
    }

    async delManyKey(keys) {
        try{
            keys = keys.map(key => this.buildKey(JSON.stringify(key)));
            var value = await this.client.sendCommand(['DEL', ... keys]);
            
            if(value == 0 || value == null || value == undefined) {return {success : false, response : value};}
            else {return {success : true, response : value}};

        } catch(err) {

            logger.error(err, 'redis error');
            throw appException.fromError(err);
        }
    }

    async addToSet(key, value) {
        try{
            key = this.buildKey(JSON.stringify(key));
            value = JSON.stringify(value);
            value =  await this.client.sendCommand(['SADD', key, value]);

            if(value == 0 || value == null || value == undefined) {return {success : false, response : value};}
            else {return {success : true, response : value}};
            
        } catch(err) {

            logger.error(err, 'redis error');
            throw appException.fromError(err);
        }
    }

    async countInSet(key) {
        try{
            key = this.buildKey(JSON.stringify(key));
            return {success : true, response : await this.client.sendCommand(['SCARD', key])};
        } catch(err) {

            logger.error(err, 'redis error');
            throw appException.fromError(err);
        }
    }

    async isInSet(key, value) {
        try{
            key = this.buildKey(JSON.stringify(key));
            value = JSON.stringify(value);
            return {success : true, response : await this.client.sendCommand(['SISMEMBER', key, value])};
        } catch(err) {

            logger.error(err, 'redis error');
            throw appException.fromError(err);
        }
    }

    async getAllFromSet(key) {
        try{
            key = this.buildKey(JSON.stringify(key));
            var value = await this.client.sendCommand(['SMEMBERS', key]);
            if(value.length === 0){return {success : false};}
            return {success : true, response : value.map(i => JSON.parse(i))};
        } catch(err) {

            logger.error(err, 'redis error');
            throw appException.fromError(err);
        }
    }

    async removeFromSet(key, values) {
        try{
            key = this.buildKey(JSON.stringify(key));
            values = values.map(i => JSON.stringify(i));
            return {success : true, response : await this.client.sendCommand(['SREM', key, ... values])};
        } catch(err) {

            logger.error(err, 'redis error');
            throw appException.fromError(err);
        }
    }
};

export default Adaptor;