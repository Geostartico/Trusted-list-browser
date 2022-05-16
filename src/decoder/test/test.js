//var assert = require('assert');
import { strict as assert } from 'node:assert';
//var Service = require('./items').Service;
import Service from '../items'
describe('Service', function () {
  describe('Constructor', function () {
    it('should construct the object', function () {
      let ser = new Service("IO", 40, ["tante", "persone", "in", "in"], null, "gone", "ww.google.com", 69, "nonono");
      assert.equal(ser.name, "IO");
    });
  });
});
