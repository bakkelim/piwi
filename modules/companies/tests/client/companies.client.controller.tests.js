'use strict';

(function () {
  // Companies Controller Spec
  describe('Companies Controller Tests', function () {
    // Initialize global variables
    var CompaniesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Companies,
      mockCompany;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Companies_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Companies = _Companies_;

      // create mock company
      mockCompany = new Companies({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'An Company about MEAN',       
        description: 'MEAN rocks!'
      });    

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Companies controller.
      CompaniesController = $controller('CompaniesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one company object fetched from XHR', inject(function (Companies) {
      // Create a sample companies array that includes the new company
      var sampleCompanies = [mockCompany];

      // Set GET response
      $httpBackend.expectGET('api/companies').respond(sampleCompanies);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.companies).toEqualData(sampleCompanies);
    }));

    it('$scope.findOne() should create an array with one company object fetched from XHR using a companyId URL parameter', inject(function (Companies) {
      // Set the URL parameter
      $stateParams.companyId = mockCompany._id;

      // Set GET response
      $httpBackend.expectGET(/api\/companies\/([0-9a-fA-F]{24})$/).respond(mockCompany);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.company).toEqualData(mockCompany);
    }));

    describe('$scope.create()', function () {
      var sampleCompanyPostData;

      beforeEach(function () {
        // Create a sample company object
        sampleCompanyPostData = new Companies({
          name: 'An Company about MEAN',      
          description: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.name = 'An Company about MEAN';      
        scope.description = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Companies) {
        // Set POST response
        $httpBackend.expectPOST('api/companies', sampleCompanyPostData).respond(mockCompany);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.name).toEqual('');       
        expect(scope.description).toEqual('');

        // Test URL redirection after the company was created
        expect($location.path.calls.mostRecent().args[0]).toBe('companies/' + mockCompany._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/companies', sampleCompanyPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock company in scope
        scope.company = mockCompany;
      });

      it('should update a valid company', inject(function (Companies) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/companies\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/companies/' + mockCompany._id);
      }));

      it('should set scope.error to error response message', inject(function (Companies) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/companies\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(company)', function () {
      beforeEach(function () {
        // Create new companies array and include the company
        scope.companies = [mockCompany, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/companies\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockCompany);
      });

      it('should send a DELETE request with a valid companyId and remove the company from the scope', inject(function (Companies) {
        expect(scope.companies.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.company = mockCompany;

        $httpBackend.expectDELETE(/api\/companies\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to companies', function () {
        expect($location.path).toHaveBeenCalledWith('companies');
      });
    });
  });
}());
