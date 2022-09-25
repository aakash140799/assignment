import appException from '../../utils/appException.js';
import repoAdaptor from '../../utils/adaptor/postgresRepo.js';
import redisAdaptor from '../../utils/adaptor/Redis.js';
import pIteration from 'p-iteration';
import pino from 'pino';



const logger = pino();
class Service {

    constructor(roleRepo, opRepo, cache, configs) {
        if(!(roleRepo instanceof repoAdaptor) || !(opRepo instanceof repoAdaptor) || !(cache instanceof redisAdaptor)) {
            throw new appException('InvalidArgument');
        }

        this.roleRepo = roleRepo;
        this.opRepo = opRepo;
        this.cache = cache;
        this.configs = configs;
        logger.info('role service built');
    }

    async createRole() {
        try{
            // store in this.repo
            var res = await this.roleRepo.create({});

            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async addOp(roleId, opName) {
        try{
            // store in this.repo
            var res = await this.opRepo.create({roleId, opName});

            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async removeOp(roleId, opName) {
        try{
            // store in this.repo
            var res = await this.opRepo.delete({roleId, opName});

            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async getOps(roleId) {
        try{
            // store in this.repo
            var res = await this.opRepo.getMany({roleId}, true, ['opName'], 1, 1e6);

            // return result
            return res.map(op => op.opName);
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async getPermitter(roleId) {
        try{
            // store in this.repo
            var res = new Set(await this.opRepo.getMany({roleId}, true, ['opName'], 1, 1e6));
            res = res.map(op => op.opName);

            // return result
            return (opName) => {
                if(!res.has(opName)) {
                    throw new appException('UnAuthorized');
                }
            };
            
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }
};

export default Service;