import DbFactory from '../../utils/factory/postgresConn.js';
import cacheFactory from '../../utils/factory/redisConn.js';
import redisAdaptor from '../../utils/adaptor/Redis.js';
import Entity from './Entity.js';
import Repo from '../../utils/adaptor/postgresRepo.js';
import Service from './Service.js';
import Controller from './Controller.js';
import Router from './Router.js';
import pino from 'pino';

var conn = null;
var entity = null;
var model = null;
var redisConn = null;
var cache = null;
var repoConfigs = null;
var repo = null;
var serviceConfigs = null;
var service = null;
var controller = null;
var router = null;
var app = null;
var built = false;
const logger = pino();
class Factory
{
    static async build()
    {
        if(!built)
        {
            conn = await DbFactory.build();

            entity = new Entity(conn);

            model = await entity.build();

            redisConn = await cacheFactory.build();

            cache = new redisAdaptor(redisConn, 'User');

            await cache.flush();

            repoConfigs = {keyColumns : new Set(['id']), cacheSingle : true, cacheMany : true};

            repo = new Repo(model, cache, 'Comment', repoConfigs);

            serviceConfigs = {};

            service = new Service(repo, serviceConfigs); 
            
            controller = new Controller(service);

            router = new Router(controller);

            app = router.getRouter();

            built = true;

            logger.info('comment factory built');
        }

        return app;
    }

    static async getConnection() {
        await this.build();
        return conn;
    }

    static async getEntity() {
        await this.build();
        return entity;
    }

    static async getModel() {
        await this.build();
        return model;
    }

    static async getRedisConn() {
        await this.build();
        return redisConn;
    }

    static async getCache() {
        await this.build();
        return cache;
    }

    static async getRepoConf() {
        await this.build();
        return repoConfigs;
    }

    static async getRepo() {
        await this.build();
        return repo;
    }

    static async getServiceConf() {
        await this.build();
        return serviceConfigs;;
    }

    static async getService() {
        await this.build();
        return service;
    }

    static async getController() {
        await this.build();
        return controller;
    }

    static async getRouter() {
        await this.build();
        return router;
    }

    static async getApp() {
        return await this.build();
    }

    reset() {
        build = false;
    }
};

export default Factory;