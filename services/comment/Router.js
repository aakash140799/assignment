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
        router.post('/comment/:postId', controller.create);
        router.get('/comment/:commentId', controller.get);
        router.put('/comment/:commentId', controller.update);
        router.delete('/comment/:commentId', controller.delete);
        router.get('/commentBulk', controller.getMany);
        router.delete('/commentBulk', controller.deleteMany);
        router.get('/comment/see/:postId', controller.seeComments);

        this.router = router;
        this.getRouter = this.getRouter.bind(this);

        logger.info('comment router built');
    }

    getRouter() {
        return this.router;
    }
};

export default Router;