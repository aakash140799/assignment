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
        
        this.createRole = this.createRole.bind(this);
        this.addOp = this.addOp.bind(this);
        this.removeOp = this.removeOp.bind(this);
        this.getOps = this.getOps.bind(this);


        logger.info('role controller built');
    }

    async createRole(req, res, next) {
        try{
            await req.permit('CreateRole');

            const ires = await this.service.createRole();
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'role controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async addOp(req, res, next) {
        try{
            await req.permit('AddOp');

            const ires = await this.service.addOp(req.params.roleId, req.body.data.opName);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'role controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async removeOp(req, res, next) {
        try{
            await req.permit('RemoveOp');

            const ires = await this.service.removeOp(req.params.roleId, req.body.data.opName);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'role controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async getOps(req, res, next) {
        try{
            await req.permit('GetOps');

            const ires = await this.service.getOps(req.params.roleId);
            return checker.checkediRes(ires, req, res, next);
            
        } catch(err) {

            logger.error(err, 'role controller');
            err = appException.fromError(err);
            return next(err);
        }
    }
};

export default Controller;