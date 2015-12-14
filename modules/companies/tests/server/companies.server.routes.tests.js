'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, company;

/**
 * Company routes tests
 */
describe('Company CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new company
    user.save(function () {
      company = {
        name: 'Company Name',     
        description: 'Company Desc'
      };

      done();
    });
  });

  it('should be able to save an company if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new company
        agent.post('/api/companies')
          .send(company)
          .expect(200)
          .end(function (companySaveErr, companySaveRes) {
            // Handle company save error
            if (companySaveErr) {
              return done(companySaveErr);
            }

            // Get a list of companies
            agent.get('/api/companies')
              .end(function (companiesGetErr, companiesGetRes) {
                // Handle company save error
                if (companiesGetErr) {
                  return done(companiesGetErr);
                }

                // Get companies list
                var companies = companiesGetRes.body;

                // Set assertions
                (companies[0].user._id).should.equal(userId);
                (companies[0].name).should.match('Company Name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an company if not logged in', function (done) {
    agent.post('/api/companies')
      .send(company)
      .expect(403)
      .end(function (companySaveErr, companySaveRes) {
        // Call the assertion callback
        done(companySaveErr);
      });
  });

  it('should not be able to save an company if no name is provided', function (done) {
    // Invalidate name field
    company.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new company
        agent.post('/api/companies')
          .send(company)
          .expect(400)
          .end(function (companySaveErr, companySaveRes) {
            // Set message assertion
            (companySaveRes.body.message).should.match('Name cannot be blank');

            // Handle company save error
            done(companySaveErr);
          });
      });
  });

  it('should be able to update an company if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new company
        agent.post('/api/companies')
          .send(company)
          .expect(200)
          .end(function (companySaveErr, companySaveRes) {
            // Handle company save error
            if (companySaveErr) {
              return done(companySaveErr);
            }

            // Update company name
            company.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing company
            agent.put('/api/companies/' + companySaveRes.body._id)
              .send(company)
              .expect(200)
              .end(function (companyUpdateErr, companyUpdateRes) {
                // Handle company update error
                if (companyUpdateErr) {
                  return done(companyUpdateErr);
                }

                // Set assertions
                (companyUpdateRes.body._id).should.equal(companySaveRes.body._id);
                (companyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of companies if not signed in', function (done) {
    // Create new company model instance
    var companyObj = new Company(company);

    // Save the company
    companyObj.save(function () {
      // Request companies
      request(app).get('/api/companies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single company if not signed in', function (done) {
    // Create new company model instance
    var companyObj = new Company(company);

    // Save the company
    companyObj.save(function () {
      request(app).get('/api/companies/' + companyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', company.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single company with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/companies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Company is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single company which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent company
    request(app).get('/api/companies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No company with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an company if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new company
        agent.post('/api/companies')
          .send(company)
          .expect(200)
          .end(function (companySaveErr, companySaveRes) {
            // Handle company save error
            if (companySaveErr) {
              return done(companySaveErr);
            }

            // Delete an existing company
            agent.delete('/api/companies/' + companySaveRes.body._id)
              .send(company)
              .expect(200)
              .end(function (companyDeleteErr, companyDeleteRes) {
                // Handle company error error
                if (companyDeleteErr) {
                  return done(companyDeleteErr);
                }

                // Set assertions
                (companyDeleteRes.body._id).should.equal(companySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an company if not signed in', function (done) {
    // Set company user
    company.user = user;

    // Create new company model instance
    var companyObj = new Company(company);

    // Save the company
    companyObj.save(function () {
      // Try deleting company
      request(app).delete('/api/companies/' + companyObj._id)
        .expect(403)
        .end(function (companyDeleteErr, companyDeleteRes) {
          // Set message assertion
          (companyDeleteRes.body.message).should.match('User is not authorized');

          // Handle company error error
          done(companyDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Company.remove().exec(done);
    });
  });
});
