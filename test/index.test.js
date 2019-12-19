const mocha = require('mocha');
const describe = mocha.describe;
const assert = require('assert');

describe('it should test', () => {
  it('should work', () => {
    assert.equal(1, 1, 'wow')
  });
});
