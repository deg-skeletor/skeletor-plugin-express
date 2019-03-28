const skeletorLocalServer = require('./index');

let express;
let portfinder;
jest.mock('express');
jest.mock('opn');
jest.mock('portfinder');

const logger = {
    info: () => {},
    error: () => {}
};
const options = {logger};
let logInfoSpy;

describe('local server plugin', () => {

    beforeEach(() => {
        jest.useFakeTimers();
        express = require('express');
        portfinder = require('portfinder');
        logInfoSpy = jest.spyOn(logger, 'info');
    });

    afterEach(() => {
        express.__resetServer();
        portfinder.__clearNextAvailablePort();
        logInfoSpy.mockReset();
    });

    it('should error when listen fails', async () => {
        const expectedError = {
            status: 'error',
            error: new Error('listen failed')
        };
        const config = {
            entryPoints: ['testDir'],
            currentDirectory: 'testDir'
        };
        express.__setThrowOnListen(true);

        await expect(skeletorLocalServer().run(config, options)).rejects.toEqual(expectedError);
    });

    it('should log when server starts', async () => {
        const expectedResp = {
            status: 'running'
        };
        const expectedMessage = 'Started server on port 0';
        const config = {
            entryPoints: ['testDir'],
            currentDirectory: 'testDir'
        };
        
        const resp = await skeletorLocalServer().run(config, options);
        jest.runAllTimers();
        
        expect(logInfoSpy).toHaveBeenCalledTimes(1);
        expect(logInfoSpy).toHaveBeenCalledWith(expectedMessage);
        expect(resp).toEqual(expectedResp);
    });

    it('should have a configurable port', async () => {
        const expectedResp = {
            status: 'running'
        };
        const expectedPort = 3001;
        const expectedMessage = 'Started server on port 3001';
        const config = {
            port: expectedPort,
            entryPoints: ['testDir'],
            currentDirectory: 'testDir'
        };

        const resp = await skeletorLocalServer().run(config, options);
        jest.runAllTimers();
        expect(logInfoSpy).toHaveBeenCalledTimes(1);
        expect(logInfoSpy).toHaveBeenCalledWith(expectedMessage);
        expect(resp).toEqual(expectedResp);

        const currentPort = express.__getPortInUse();
        expect(currentPort).toBe(expectedPort);
    });

    it('should use the next available port', async () => {
        const expectedResp = {
            status: 'running'
        };
        const unavailablePort = 3001;
        const expectedPort = 3002;
        const expectedMessage = 'Started server on port 3002';
        const config = {
            port: unavailablePort,
            entryPoints: ['testDir'],
            currentDirectory: 'testDir'
        };

        portfinder.__setNextAvailablePort(3002);

        const resp = await skeletorLocalServer().run(config, options);
        jest.runAllTimers();
        expect(logInfoSpy).toHaveBeenCalledTimes(1);
        expect(logInfoSpy).toHaveBeenCalledWith(expectedMessage);
        expect(resp).toEqual(expectedResp);

        const currentPort = express.__getPortInUse();
        expect(currentPort).toBe(expectedPort);
    });

    describe('entry point(s)', () => {
        it('should assign asset path to correct route', async () => {
            const expectedRouteVals = ['testDir/patternDir', 'testDir/appDir'];
            const config = {
                entryPoints: [{
                    entry: 'patternDir',
                    route: '/patterns'
                },
                {
                    entry: 'appDir',
                    route: '/app'
                }],
                currentDirectory: 'testDir'
            };

            await skeletorLocalServer().run(config, options);
            const patternRouteItems = express.__getItemsForRoute('/patterns');
            expect(patternRouteItems).toHaveLength(1);
            expect(patternRouteItems[0]).toEqual(expectedRouteVals[0]);

            const appRouteItems = express.__getItemsForRoute('/app');
            expect(appRouteItems).toHaveLength(1);
            expect(appRouteItems[0]).toEqual(expectedRouteVals[1]);
        });

        it('should default path to root', async () => {
            const expectedRouteVals = ['testDir/patternDir', 'testDir/appDir'];
            const config = {
                entryPoints: [{
                    entry: 'patternDir'
                },
                {
                    entry: 'appDir'
                }],
                currentDirectory: 'testDir'
            };

            await skeletorLocalServer().run(config, options);
            const patternRouteItems = express.__getItemsForRoute('/');
            expect(patternRouteItems).toHaveLength(2);
            expect(patternRouteItems).toEqual(expectedRouteVals);
        });
    });

    describe('middleware', () => {
        it('should default route to /', async () => {
            const config = {
                port: 3001,
                entryPoints: [{entry: 'testDir'}],
                currentDirectory: 'testDir',
                middleware: [{
                    fn: () => true
                }]
            };
            
            await skeletorLocalServer().run(config, options);
            const routeList = express.__getItemsForRoute('/');
            expect(routeList).toHaveLength(2);
            expect(typeof routeList[1]).toBe('function');
            expect(routeList[1]()).toBe(true);
        });

        it('should not apply middleware if no function defined', async () => {
            const config = {
                port: 3001,
                entryPoints: [{entry: 'testDir'}],
                currentDirectory: 'testDir',
                middleware: [{}]
            };
            
            await skeletorLocalServer().run(config, options);
            const routeList = express.__getItemsForRoute('/');
            expect(routeList).toHaveLength(1);
        });

        it('should ensure that config is an array', async () => {
            const config = {
                port: 3001,
                entryPoints: [{entry: 'testDir'}],
                currentDirectory: 'testDir',
                middleware: {
                    fn: () => true
                }
            };
            
            await skeletorLocalServer().run(config, options);
            const routeList = express.__getItemsForRoute('/');
            expect(routeList).toHaveLength(2);
            expect(typeof routeList[1]).toBe('function');
            expect(routeList[1]()).toBe(true);
        });

        it('should apply middleware to specified route', async () => {
            const route = '/hello';
            const config = {
                port: 3001,
                entryPoints: [{entry: 'testDir'}],
                currentDirectory: 'testDir',
                middleware: {
                    route: route,
                    fn: () => 'hello'
                }
            };
            
            await skeletorLocalServer().run(config, options);
            const routeList = express.__getItemsForRoute('/hello');
            expect(routeList).toHaveLength(1);
            expect(typeof routeList[0]).toBe('function');
            expect(routeList[0]()).toBe('hello');
        });
    });

    xit('should refresh browser on file update', () => {

    });
});