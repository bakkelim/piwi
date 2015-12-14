'use strict';

(function () {
  // Purchases Controller Spec
  describe('Purchases Controller Tests', function () {
    // Initialize global variables
    var PurchasesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Purchases,
      mockPurchase;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Purchases_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Purchases = _Purchases_;

      // create mock purchase
      mockPurchase = new Purchases({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Purchase about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Purchases controller.
      PurchasesController = $controller('PurchasesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one purchase object fetched from XHR', inject(function (Purchases) {
      // Create a sample purchases array that includes the new purchase
      var samplePurchases = [mockPurchase];

      // Set GET response
      $httpBackend.expectGET('api/purchases').respond(samplePurchases);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.purchases).toEqualData(samplePurchases);
    }));

    it('$scope.findOne() should create an array with one purchase object fetched from XHR using a purchaseId URL parameter', inject(function (Purchases) {
      // Set the URL parameter
      $stateParams.purchaseId = mockPurchase._id;

      // Set GET response
      $httpBackend.expectGET(/api\/purchases\/([0-9a-fA-F]{24})$/).respond(mockPurchase);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.purchase).toEqualData(mockPurchase);
    }));

    describe('$scope.create()', function () {
      var samplePurchasePostData;

      beforeEach(function () {
        // Create a sample purchase object
        samplePurchasePostData = new Purchases({
          title: 'An Purchase about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Purchase about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Purchases) {
        // Set POST response
        $httpBackend.expectPOST('api/purchases', samplePurchasePostData).respond(mockPurchase);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the purchase was created
        expect($location.path.calls.mostRecent().args[0]).toBe('purchases/' + mockPurchase._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/purchases', samplePurchasePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock purchase in scope
        scope.purchase = mockPurchase;
      });

      it('should update a valid purchase', inject(function (Purchases) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/purchases\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/purchases/' + mockPurchase._id);
      }));

      it('should set scope.error to error response message', inject(function (Purchases) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/purchases\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(purchase)', function () {
      beforeEach(function () {
        // Create new purchases array and include the purchase
        scope.purchases = [mockPurchase, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/purchases\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockPurchase);
      });

      it('should send a DELETE request with a valid purchaseId and remove the purchase from the scope', inject(function (Purchases) {
        expect(scope.purchases.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.purchase = mockPurchase;

        $httpBackend.expectDELETE(/api\/purchases\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to purchases', function () {
        expect($location.path).toHaveBeenCalledWith('purchases');
      });
    });
  });
}());
