import DbFactory from '../../utils/factory/postgresConn.js';
import cacheFactory from '../../utils/factory/redisConn.js';
import redisAdaptor from '../../utils/adaptor/Redis.js';
import RoleEntity from './RoleEntity.js';
import OpEntity from './OpEntity.js';
import Repo from '../../utils/adaptor/postgresRepo.js';
import Service from './Service.js';
import Controller from './Controller.js';
import Router from './Router.js';
import pino from 'pino';

var conn = null;
var roleEntity = null;
var roleModel = null;
var opEntity = null;
var opModel = null;
var redisConn = null;
var cache = null;
var roleRepoConfigs = null;
var roleRepo = null;
var opRepoConfigs = null;
var opRepo = null;
var serviceConfig = null;
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

            roleEntity = new RoleEntity(conn);

            roleModel = await roleEntity.build();

            opEntity = new OpEntity(conn);

            opModel = await opEntity.build();

            redisConn = await cacheFactory.build();

            cache = new redisAdaptor(redisConn, 'User');

            await cache.flush();

            roleRepoConfigs = {keyColumns : new Set(['id']), cacheSingle : false, cacheMany : false};

            roleRepo = new Repo(roleModel, cache, 'Role', roleRepoConfigs);

            opRepoConfigs = {keyColumns : new Set(['roleId', 'opName']), cacheSingle : true, cacheMany : true};

            opRepo = new Repo(opModel, cache, 'Op', opRepoConfigs);

            serviceConfig = {cacheFollows : true}

            service = new Service(roleRepo, opRepo, cache, serviceConfig); 
            
            controller = new Controller(service);

            router = new Router(controller);

            app = router.getRouter();

            built = true;

            logger.info('user factory built');
        }

        return app;
    }

    static async getConnection() {
        await this.build();
        return conn;
    }

    static async getRoleEntity() {
        await this.build();
        return roleEntity;
    }

    static async getRoleModel() {
        await this.build();
        return roleModel;
    }

    static async getOpEntity() {
        await this.build();
        return opEntity;
    }

    static async getOpModel() {
        await this.build();
        return opModel;
    }

    static async getRedisConn() {
        await this.build();
        return redisConn;
    }

    static async getCache() {
        await this.build();
        return cache;
    }

    static async getRoleRepoConf() {
        await this.build();
        return roleRepoConfigs;
    }

    static async getRoleRepo() {
        await this.build();
        return roleRepo;
    }

    static async getOpRepoConfigs() {
        await this.build();
        return opRepoConfigs;
    }

    static async getOpRepo() {
        await this.build();
        return opRepo;
    }

    static async getServiceConf() {
        await this.build();
        return serviceConfig;
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