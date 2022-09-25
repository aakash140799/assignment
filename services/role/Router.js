import express from 'express';
import appException from '../../utils/appException.js';
import pino from 'pino';


const logger = pino();
class Router {

    constructor(controller) {
        if(controller == null || controller == undefined) {
            throw new appException('InvalidArgument')
        }

        var router = express.Router();
        router.post('/role', controller.createRole);
        router.post('/role/:roleId', controller.addOp);
        router.delete('/role/:roleId', controller.removeOp);
        router.get('/role/:roleId', controller.getOps);

        this.router = router;
        this.getRouter = this.getRouter.bind(this);

        logger.info('role router built');
    }

    getRouter() {
        return this.router;
    }
};

export default Router;