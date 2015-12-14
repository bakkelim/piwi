'use strict';

describe('Purchases E2E Tests:', function () {
  describe('Test purchases page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/purchases');
      expect(element.all(by.repeater('purchase in purchases')).count()).toEqual(0);
    });
  });
});
