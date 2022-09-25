import appException from '../../utils/appException.js';
import checker from '../../utils/checker.js';
import pino from 'pino';


const logger = pino();
class Controller {

    constructor(service) {
        if(service == null || service == undefined) {
            throw new appException('InvalidArgument');
        }
        this.service = service;
        
        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.login = this.login.bind(this);
        this.checkEmail = this.checkEmail.bind(this);
        this.createMany = this.createMany.bind(this);
        this.updateMany = this.updateMany.bind(this);
        this.getMany = this.getMany.bind(this);
        this.deleteMany = this.deleteMany.bind(this);
        this.followUser = this.followUser.bind(this);
        this.unFollowUser = this.unFollowUser.bind(this);
        this.getFollowers = this.getFollowers.bind(this);
        this.getFollowees = this.getFollowees.bind(this);


        logger.info('user controller built');
    }

    async create(req, res, next) {
        try{
            await req.permit('CreateUser');

            const ires = await this.service.create(req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async get(req, res, next) {
        try{
            await req.permit('GetUser');

            const ires = await this.service.get(req.user.id);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async update(req, res, next) {
        try{
            await req.permit('UpdateUser');

            const ires = await this.service.update(req.user.id, req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async delete(req, res, next) {
        try{
            await req.permit('DeleteUser');

            const ires = await this.service.delete(req.user.id);

            if(ires.success) {
                return checker.checkediRes(undefined, req, res, next);
            }else{
                return res.json({success : false});
            }
            
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async login(req, res, next) {
        try{
            await req.permit('LoginUser');

            const ires = await this.service.login(req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async checkEmail(req, res, next) {
        try{
            await req.permit('CheckEmail');

            const ires = await this.service.checkEmail(req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async createMany(req, res, next) {
        try{
            await req.permit('CreateManyUser');

            const ires = await this.service.createMany(req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async updateMany(req, res, next) {
        try{
            await req.permit('UpdateManyUser');

            const ires = await this.service.updateMany(req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async getMany(req, res, next) {
        try{
            await req.permit('GetManyUser');

            const ires = await this.service.getMany(req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async deleteMany(req, res, next) {
        try{
            await req.permit('DeleteManyUser');

            const ires = await this.service.deleteMany(req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async followUser(req, res, next) {
        try{
            await req.permit('FollowUser');

            const ires = await this.service.followUser(req.user.id, req.params.followeeId);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async unFollowUser(req, res, next) {
        try{
            await req.permit('UnFollowUser');

            const ires = await this.service.unFollowUser(req.user.id, req.params.followeeId);
            
            if(ires.success) {return checker.checkediRes(undefined, req, res, next);}
            else{return res.json({success : false});}

        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async getFollowers(req, res, next) {
        try{
            await req.permit('GetFollowers');

            const ires = await this.service.getFollowers(req.user.id);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async getFollowees(req, res, next) {
        try{
            await req.permit('GetFollowees');

            const ires = await this.service.getFollowees(req.user.id);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'user controller');
            err = appException.fromError(err);
            return next(err);
        }
    }
};

export default Controller;