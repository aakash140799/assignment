import appException from '../../utils/appException.js';
import checker from '../../utils/checker.js';
import repoAdaptor from '../../utils/adaptor/postgresRepo.js';
import redisAdaptor from '../../utils/adaptor/Redis.js';
import Constant from '../../utils/Constant.js';
import cryptic from '../../utils/cryptic.js';
import pIteration from 'p-iteration';
import pino from 'pino';



const logger = pino();
class Service {

    constructor(repo, followerRepo, cache, configs) {
        if(!(repo instanceof repoAdaptor) || !(followerRepo instanceof repoAdaptor) || !(cache instanceof redisAdaptor)) {
            throw new appException(Constant.FuncArgWrong);
        }

        this.repo = repo;
        this.followerRepo = followerRepo;
        this.cache = cache;
        this.configs = configs;
        logger.info('user service built');
    }

    createSanity(doc) {
        if(checker.isUndefined(doc)){throw new appException(Constant.ReqDataMissing);}
        if(!checker.isObject(doc)){throw new appException(Constant.ReqDescInvalid);}
        if(checker.isUndefined(doc.email)){throw new appException(Constant.ReqEmailMissing);}
        if(checker.isUndefined(doc.password)){throw new appException(Constant.ReqPasswordMissing);}
        if(!checker.isString(doc.email)){throw new appException(Constant.ReqEmailWrong);}
        if(!checker.isString(doc.password)){throw new appException(Constant.ReqPasswordWrong);}
    }

    updateSanity(doc) {
        if(checker.isUndefined(doc)){throw new appException(Constant.ReqDataMissing);}
        if(!checker.isObject(doc)){throw new appException(Constant.ReqDescInvalid);}
        if(!checker.isUndefined(doc.email) && !checker.isString(doc.email)){throw new appException(Constant.ReqEmailWrong);}
        if(!checker.isUndefined(doc.password) && !checker.isString(doc.password)){throw new appException(Constant.ReqPasswordWrong);}
    }

    async createTrans(doc) {
        if(doc.email !== undefined){ doc.email = doc.email.trim().toLowerCase(); }
        if(doc.password !== undefined){ doc.password = await cryptic.generateHash(doc.password.trim()); }
    }

    async create(body) {
        try{// sanity checks
            var doc = body.data;
            this.createSanity(doc);


            // transforms
            console.log('cratea', doc);
            await this.createTrans(doc);


            // store in this.repo
            var res = await this.repo.create(doc);
            delete res.password;


            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async get(userid) {
        try{// sanity check
            if(!checker.isString(userid)){throw new appException(Constant.FuncArgWrong);}

            // db query
            var res = await this.repo.get({id : userid});
            delete res.password;

            // return result
             return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async update(userid, body) {
        try{// sanity
            var doc = body.data;
            if(!checker.isString(userid)){throw new appException(Constant.FuncArgWrong);}
            this.updateSanity(doc);
            


            // transforms
            await this.createTrans(doc);


            // update in this.repo
            var res = await this.repo.update({id : userid}, doc);
            delete res.password;


            // return result
            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async delete(userid) {
        try{// sanity
            if(!checker.isString(userid)){throw new appException(Constant.FuncArgWrong);}



            // delete user in this.repo
            var res = await this.repo.delete({id : userid});



            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    // not working
    async verifyUser(email, password) {
        try{// sanity
            if(!checker.isString(email)){throw new appException(Constant.ReqEmailWrong);}
            if(!checker.isString(password)){throw new appException(Constant.ReqPasswordWrong);}



            // transform
            email = email.toLowerCase();



            // db query
            var userStored = await this.repo.getMany({email}, true, null, 1, 1);
            if(userStored.length == 0){throw new appException(Constant.DbUserMissing);}
            userStored = userStored[0];




            // verify password
            if(await cryptic.compareHash(password, userStored.password)){
                delete userStored.password;
                return userStored;
            }
            else{throw new appException(Constant.ReqPasswordIncorrect);}

        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async login(body) {
        try{// sanity
            var doc = body.data;
            this.createSanity(doc);
            if(!checker.isUndefined(body.rememberMe)){throw new appException(Constant.ReqRememberWrong);}
            
            
            console.log('p91898109891823901839890189031', body)
            // transform
            await this.createTrans(doc);
            var rememberMe = body.rememberMe || false;



            // authenticate
            var userStored = await this.verifyUser(doc.email, doc.password);
            delete userStored.password;



            // create login token
            var token = null;
            var expiresIn = '365d';
            if(rememberMe) {
                token = await cryptic.sign(userStored, {expiresIn});
            } else {
                expiresIn = '24h';
                token = await cryptic.sign(userStored, {expiresIn});
            }

            // return
            return {token : token, expiresIn};
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async checkEmail(body) {
        try{// sanity
            var doc = body.data;
            if(checker.isUndefined(doc)){throw new appException(Constant.ReqDataMissing);}
            if(!checker.isObject(doc)){throw new appException(Constant.ReqDataWrong);}
            if(checker.isUndefined(doc.email)){throw new appException(Constant.ReqEmailMissing);}
            if(!checker.isString(doc.email)){throw new appException(Constant.ReqEmailWrong);}




            // find in db
            const res = await this.repo.getMany({email : doc.email}, true, ['id'], 1, 1);




            // check existance
            if(res.length === 0){return {exists : false};}
            return {exists : true};
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async createMany(body) {
        try {
            // sanity
            var docs = body.data;
            if(checker.isUndefined(docs)){throw new appException(Constant.ReqDataMissing);}
            if(!(docs instanceof Array)){throw new appException(Constant.ReqDataWrong);}



            var errDict = {}
            for(var i = 0; i < docs.length; i++) {
                var doc = docs[i];
                try{this.createSanity(doc)} catch(err) {errDict[i] = err;}
            }
            if(Object.keys(errDict).length > 0) {
                throw new appException(Constant.ReqMultiErr, errDict);
            }


            // transform
            await pIteration.forEach(docs, async (doc) => {
                await this.createTrans(doc);
            });


            
            
            // create in db
            var res = await this.repo.createMany(docs);

            // clean result
            await pIteration.forEach(res, async (doc) => {
                delete doc.password;
            });

            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async updateMany(body) {
        try {// sanity
            var {query, exact} = checker.deleteManySanity(body);
            var {data} = body;
            this.updateSanity(data);



            // trans
            await this.createTrans(data);


            
            // create in db
            var res = await this.repo.updateMany(query, exact, data);

            

            // clean result
            await pIteration.forEach(res, async (doc) => {
                delete doc.password;
            });

            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async getMany(body) {
        try {// sanity
            var {query, select, exact, count, index} = checker.getManySanity(body);



            // search in db
            var res = await this.repo.getMany(query, exact, select, index, count);




            // clean result
            await pIteration.forEach(res, async (doc) => {
                delete doc.password;
            });



            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async deleteMany(body) {
        try {// sanity
            var {query, exact} = checker.deleteManySanity(body);


            // delete in db
            const res = await this.repo.deleteMany(query, exact);
            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async followUser(userId, followeeId) {
        try{
            // sanity
            if(!checker.isString(userId) || !checker.isString(followeeId)) {throw new appException(Constant.FuncArgWrong);}
            await this.get(followeeId);     // checks existance




            // store in this.repo
            var res = await this.followerRepo.create({followerId : userId, followeeId : followeeId});



            // cache check
            if(this.configs.cacheFollows) {
                this.cache.addToSet('FOLLOWEES_'+userId, followeeId);
                this.cache.addToSet('FOLLOWERS_'+followeeId, userId);
            }




            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async unFollowUser(userId, followeeId) {
        try{// sanity
            if(!checker.isString(userId) || !checker.isString(followeeId)) {throw new appException(Constant.FuncArgWrong);}
            await this.get(followeeId);     // checks existance




            // store in this.repo
            var res = await this.followerRepo.delete({followerId : userId, followeeId : followeeId});





            // cache check
            if(this.configs.cacheFollows) {
                this.cache.removeFromSet('FOLLOWEES_'+userId, [followeeId]);
                this.cache.removeFromSet('FOLLOWERS_'+followeeId, [userId]);
            }

            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async getFollowers(userId) {
        try{// sanity
            if(!checker.isString(userId)) {throw new appException(Constant.FuncArgWrong);}
            await this.get(userId); // checks existance




            // check cache
            if(this.configs.cacheFollows) {
                const res = await this.cache.getAllFromSet('FOLLOWERS_'+userId);
                if(res.success){console.log('found in cache'); return res.response;}
            }



            // db query
            var res = await this.followerRepo.getMany({followeeId : userId}, true, ['followerId'], 1, 1e6);




            // cache check
            if(this.configs.cacheFollows) {
                pIteration.forEach(res, async (data) => {
                    await this.cache.addToSet('FOLLOWERS_'+userId, data);
                });
            }

            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async getFollowees(userId) {
        try{// sanity
            if(!checker.isString(userId)) {throw new appException(Constant.FuncArgWrong);}
            await this.get(userId); // checks existance



            // cache check
            if(this.configs.cacheFollows) {
                const res = await this.cache.getAllFromSet('FOLLOWEES_'+userId);
                if(res.success){console.log('found in cache');return res.response;}
            }



            // db query
            var res = await this.followerRepo.getMany({followerId : userId}, true, ['followeeId'], 1, 1e6);



            // cache check
            if(this.configs.cacheFollows) {
                pIteration.forEach(res, async (data) => {
                    await this.cache.addToSet('FOLLOWEES_'+userId, data);
                });
            }



            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }
};

export default Service;