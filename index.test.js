const skeletorLocalServer = require('./index');

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
        consoleSpy = jest.spyOn(global.console, 'log');
    });

    afterEach(() => {
        consoleSpy.mockReset();
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

    xit('should handle middleware passed in', () => {

    });

    xit('should refresh browser on file update', () => {

    });
});