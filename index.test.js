const skeletorLocalServer = require('./index');

let express;
jest.mock('express');
jest.mock('opn');

const logger = {
    info: () => {},
    error: () => {}
};
const options = {logger};
let logInfoSpy;

describe('local server plugin', () => {

    beforeEach(() => {
        express = require('express');
        logInfoSpy = jest.spyOn(logger, 'info');
    });

    afterEach(() => {
        express.__resetServer();
        logInfoSpy.mockReset();
    });

    it('should error when no entry points specified', async () => {
        const expectedError = {
            status: 'error',
            message: 'Error with config. Directory: testDir, Entry points: undefined'
        };
        const config = {
            currentDirectory: 'testDir'
        };
        await expect(skeletorLocalServer().run(config, options)).rejects.toEqual(expectedError);
    });

    it('should error when no current directory specified', async () => {
        const expectedError = {
            status: 'error',
            message: 'Error with config. Directory: undefined, Entry points: testDir'
        };
        const config = {
            entryPoints: ['testDir']
        };
        await expect(skeletorLocalServer().run(config, options)).rejects.toEqual(expectedError);
    });

    it('should log when server starts', () => {
        const expectedResp = {
            status: 'running'
        };
        const expectedMessage = 'Started server on port 0';
        const config = {
            entryPoints: ['testDir'],
            currentDirectory: 'testDir'
        };
        jest.useFakeTimers();

        return skeletorLocalServer().run(config, options).then(resp => {
            jest.runAllTimers();
            expect(logInfoSpy).toHaveBeenCalledTimes(1);
            expect(logInfoSpy).toHaveBeenCalledWith(expectedMessage);
            expect(resp).toEqual(expectedResp);
        });
    });

    it('should have a configurable port', () => {
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
        jest.useFakeTimers();
        jest.clearAllTimers();

        return skeletorLocalServer().run(config, options).then(resp => {
            jest.runAllTimers();
            expect(logInfoSpy).toHaveBeenCalledTimes(1);
            expect(logInfoSpy).toHaveBeenCalledWith(expectedMessage);
            expect(resp).toEqual(expectedResp);

            const currentPort = express.__getPortInUse();
            expect(currentPort).toBe(expectedPort);
        });
    });

    describe('entry point(s)', () => {
        it('should assign asset path to correct route', () => {
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

            return skeletorLocalServer().run(config, options).then(() => {
                const patternRouteItems = express.__getItemsForRoute('/patterns');
                expect(patternRouteItems).toHaveLength(1);
                expect(patternRouteItems[0]).toEqual(expectedRouteVals[0]);

                const appRouteItems = express.__getItemsForRoute('/app');
                expect(appRouteItems).toHaveLength(1);
                expect(appRouteItems[0]).toEqual(expectedRouteVals[1]);
            });
        });

        it('should default path to root', () => {
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

            return skeletorLocalServer().run(config, options).then(() => {
                const patternRouteItems = express.__getItemsForRoute('/');
                expect(patternRouteItems).toHaveLength(2);
                expect(patternRouteItems).toEqual(expectedRouteVals);
            });
        });
    });

    describe('middleware', () => {
        it('should default route to /', () => {
            const config = {
                port: 3001,
                entryPoints: [{entry: 'testDir'}],
                currentDirectory: 'testDir',
                middleware: [{
                    fn: () => true
                }]
            };
            return skeletorLocalServer().run(config, options).then(() => {
                const routeList = express.__getItemsForRoute('/');
                expect(routeList).toHaveLength(2);
                expect(typeof routeList[1]).toBe('function');
                expect(routeList[1]()).toBe(true);
            });
        });

        it('should not apply middleware if no function defined', () => {
            const config = {
                port: 3001,
                entryPoints: [{entry: 'testDir'}],
                currentDirectory: 'testDir',
                middleware: [{}]
            };
            return skeletorLocalServer().run(config, options).then(() => {
                const routeList = express.__getItemsForRoute('/');
                expect(routeList).toHaveLength(1);
            });
        });

        it('should ensure that config is an array', () => {
            const config = {
                port: 3001,
                entryPoints: [{entry: 'testDir'}],
                currentDirectory: 'testDir',
                middleware: {
                    fn: () => true
                }
            };
            return skeletorLocalServer().run(config, options).then(() => {
                const routeList = express.__getItemsForRoute('/');
                expect(routeList).toHaveLength(2);
                expect(typeof routeList[1]).toBe('function');
                expect(routeList[1]()).toBe(true);
            });
        });

        it('should apply middleware to specified route', () => {
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
            return skeletorLocalServer().run(config, options).then(() => {
                const routeList = express.__getItemsForRoute('/hello');
                expect(routeList).toHaveLength(1);
                expect(typeof routeList[0]).toBe('function');
                expect(routeList[0]()).toBe('hello');
            });
        });
    });

    xit('should refresh browser on file update', () => {

    });
});