'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Purchase = mongoose.model('Purchase'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, purchase;

/**
 * Purchase routes tests
 */
describe('Purchase CRUD tests', function () {
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

    // Save a user to the test db and create new purchase
    user.save(function () {
      purchase = {
        title: 'Purchase Title',
        content: 'Purchase Content'
      };

      done();
    });
  });

  it('should be able to save an purchase if logged in', function (done) {
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

        // Save a new purchase
        agent.post('/api/purchases')
          .send(purchase)
          .expect(200)
          .end(function (purchaseSaveErr, purchaseSaveRes) {
            // Handle purchase save error
            if (purchaseSaveErr) {
              return done(purchaseSaveErr);
            }

            // Get a list of purchases
            agent.get('/api/purchases')
              .end(function (purchasesGetErr, purchasesGetRes) {
                // Handle purchase save error
                if (purchasesGetErr) {
                  return done(purchasesGetErr);
                }

                // Get purchases list
                var purchases = purchasesGetRes.body;

                // Set assertions
                (purchases[0].user._id).should.equal(userId);
                (purchases[0].title).should.match('Purchase Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an purchase if not logged in', function (done) {
    agent.post('/api/purchases')
      .send(purchase)
      .expect(403)
      .end(function (purchaseSaveErr, purchaseSaveRes) {
        // Call the assertion callback
        done(purchaseSaveErr);
      });
  });

  it('should not be able to save an purchase if no title is provided', function (done) {
    // Invalidate title field
    purchase.title = '';

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

        // Save a new purchase
        agent.post('/api/purchases')
          .send(purchase)
          .expect(400)
          .end(function (purchaseSaveErr, purchaseSaveRes) {
            // Set message assertion
            (purchaseSaveRes.body.message).should.match('Title cannot be blank');

            // Handle purchase save error
            done(purchaseSaveErr);
          });
      });
  });

  it('should be able to update an purchase if signed in', function (done) {
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

        // Save a new purchase
        agent.post('/api/purchases')
          .send(purchase)
          .expect(200)
          .end(function (purchaseSaveErr, purchaseSaveRes) {
            // Handle purchase save error
            if (purchaseSaveErr) {
              return done(purchaseSaveErr);
            }

            // Update purchase title
            purchase.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing purchase
            agent.put('/api/purchases/' + purchaseSaveRes.body._id)
              .send(purchase)
              .expect(200)
              .end(function (purchaseUpdateErr, purchaseUpdateRes) {
                // Handle purchase update error
                if (purchaseUpdateErr) {
                  return done(purchaseUpdateErr);
                }

                // Set assertions
                (purchaseUpdateRes.body._id).should.equal(purchaseSaveRes.body._id);
                (purchaseUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of purchases if not signed in', function (done) {
    // Create new purchase model instance
    var purchaseObj = new Purchase(purchase);

    // Save the purchase
    purchaseObj.save(function () {
      // Request purchases
      request(app).get('/api/purchases')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single purchase if not signed in', function (done) {
    // Create new purchase model instance
    var purchaseObj = new Purchase(purchase);

    // Save the purchase
    purchaseObj.save(function () {
      request(app).get('/api/purchases/' + purchaseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', purchase.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single purchase with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/purchases/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Purchase is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single purchase which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent purchase
    request(app).get('/api/purchases/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No purchase with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an purchase if signed in', function (done) {
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

        // Save a new purchase
        agent.post('/api/purchases')
          .send(purchase)
          .expect(200)
          .end(function (purchaseSaveErr, purchaseSaveRes) {
            // Handle purchase save error
            if (purchaseSaveErr) {
              return done(purchaseSaveErr);
            }

            // Delete an existing purchase
            agent.delete('/api/purchases/' + purchaseSaveRes.body._id)
              .send(purchase)
              .expect(200)
              .end(function (purchaseDeleteErr, purchaseDeleteRes) {
                // Handle purchase error error
                if (purchaseDeleteErr) {
                  return done(purchaseDeleteErr);
                }

                // Set assertions
                (purchaseDeleteRes.body._id).should.equal(purchaseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an purchase if not signed in', function (done) {
    // Set purchase user
    purchase.user = user;

    // Create new purchase model instance
    var purchaseObj = new Purchase(purchase);

    // Save the purchase
    purchaseObj.save(function () {
      // Try deleting purchase
      request(app).delete('/api/purchases/' + purchaseObj._id)
        .expect(403)
        .end(function (purchaseDeleteErr, purchaseDeleteRes) {
          // Set message assertion
          (purchaseDeleteRes.body.message).should.match('User is not authorized');

          // Handle purchase error error
          done(purchaseDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Purchase.remove().exec(done);
    });
  });
});
