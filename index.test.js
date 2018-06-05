const skeletorLocalServer = require('./index');

let express;
jest.mock('express');

global.console = {
    log: jest.fn()
};

const logger = {
    info: () => {},
    error: () => {}
};
const options = {logger};
let consoleSpy;

describe('local server plugin', () => {

    beforeEach(() => {
        express = require('express');
        consoleSpy = jest.spyOn(global.console, 'log');
    });

    afterEach(() => {
        consoleSpy.mockReset();
        express.__clearRoutes();
    });

    it('should error when no entry point specified', async () => {
        const expectedError = {
            status: 'error',
            message: 'Error with config. Directory: testDir, Entry: undefined'
        };
        const config = {
            currentDirectory: 'testDir'
        };
        await expect(skeletorLocalServer().run(config, options)).rejects.toEqual(expectedError);
    });

    it('should error when no entry point specified', async () => {
        const expectedError = {
            status: 'error',
            message: 'Error with config. Directory: undefined, Entry: testDir'
        };
        const config = {
            entry: 'testDir'
        };
        await expect(skeletorLocalServer().run(config, options)).rejects.toEqual(expectedError);
    });

    it('should spin up a local server', () => {
        const expectedResp = {
            status: 'running'
        };
        const expectedMessage = 'Started server on port 3000';
        const config = {
            entry: 'testDir',
            currentDirectory: 'testDir'
        };

        return skeletorLocalServer().run(config, options).then(resp => {
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith(expectedMessage);
            expect(resp).toEqual(expectedResp);
        });
    });

    it('should have a configurable port', () => {
        const expectedResp = {
            status: 'running'
        };
        const expectedMessage = 'Started server on port 3001';
        const config = {
            port: 3001,
            entry: 'testDir',
            currentDirectory: 'testDir'
        };

        return skeletorLocalServer().run(config, options).then(resp => {
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith(expectedMessage);
            expect(resp).toEqual(expectedResp);
        });
    });

    xit('should serve up patternlab patterns', () => {

    });

    xit('should serve up a React app', () => {

    });

    describe('middleware', () => {
        it('should default route to /', () => {
            const config = {
                port: 3001,
                entry: 'testDir',
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
                entry: 'testDir',
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
                entry: 'testDir',
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
                entry: 'testDir',
                currentDirectory: 'testDir',
                middleware: {
                    route: route,
                    fn: () => true
                }
            };
            return skeletorLocalServer().run(config, options).then(() => {
                const routeList = express.__getItemsForRoute('/hello');
                expect(routeList).toHaveLength(1);
                expect(typeof routeList[0]).toBe('function');
                expect(routeList[0]()).toBe(true);
            });
        });
    });

    xit('should refresh browser on file update', () => {

    });
});