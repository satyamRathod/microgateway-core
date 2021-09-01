const assert = require('assert');
const PluginsSeqManager = require('../lib/PluginsSeqManager');
const sourceConfig = require('./fixtures/source-config.json');

describe('plugin sequence manager', () => {
  
  const sourceRequest = {
        'method' : 'GET',
        'connection' : {
            'encrypted' : false
        },
        'socket' : { 
            remoteAddress : "this.does.not.exist"
        },
        'headers': {
            'hostname' : 'this.does.not.exist:7777',
            'transfer-encoding' : 'chunked'
        },
        'targetSecure' : false,
        'targetHostname' : 'this.does.not.exist',
        'targetPort' : 8999,
        transactionContextData: {
            'targetHostName' : 'this.does.not.exist'
        }
  }
  
  it('will set empty preflow and postflow PluginSequence', (done) => {

    const pluginsSeqManager = new PluginsSeqManager(sourceConfig, [])
    pluginsSeqManager.setPluginSequence(sourceRequest)
    assert.equal(Array.isArray(sourceRequest.preflowPluginSequence), true);
    assert.equal(Array.isArray(sourceRequest.postflowPluginSequence), true);
    done();
    
  });
  
  it('will exclude urls from provided list', (done) => {

    const config = Object.assign({}, sourceConfig)
    config.edgemicro.plugins.excludeUrls = '/test'
    config.edgemicro.plugins.disableExcUrlsCache = true

    const pluginsSeqManager = new PluginsSeqManager(config , [])

    pluginsSeqManager.setPluginSequence(sourceRequest)
    assert.equal(Array.isArray(sourceRequest.preflowPluginSequence), true);
    assert.equal(Array.isArray(sourceRequest.postflowPluginSequence), true);
    done();
      
  });

  it('Verify plugins excludeUrls property', (done) => {

    const config = Object.assign({}, sourceConfig);
    config.edgemicro.plugins.excludeUrls = '/test';
    config.oauth.excludeUrls = 'test.com';
    config.edgemicro.plugins.disableExcUrlsCache = true;

    const plugins = [{ id: 'oauth' }]

    const pluginsSeqManager = new PluginsSeqManager(config, plugins);
    pluginsSeqManager.setPluginSequence(sourceRequest)
    assert.equal(Array.isArray(sourceRequest.preflowPluginSequence), true);
    assert.equal(Array.isArray(sourceRequest.postflowPluginSequence), true);
    done();
      
  });

  it('verify quota plugins excludeUrls', (done) => {

    const config = Object.assign({}, sourceConfig);
    config.edgemicro.plugins.excludeUrls = '/test';
    config.edgemicro.plugins.sequence.push('quota');
    config.quota = {excludeUrls: '/test'};
    config.edgemicro.plugins.disableExcUrlsCache = false;

    const plugins = [{ id: 'quota' }]

    const pluginsSeqManager = new PluginsSeqManager(config, plugins);
    pluginsSeqManager.setPluginSequence(sourceRequest)
    assert.equal(Array.isArray(sourceRequest.preflowPluginSequence), true);
    assert.equal(Array.isArray(sourceRequest.postflowPluginSequence), true);
    done();
      
  });
  
  
});
