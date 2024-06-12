QA-API-Testing :
This is a QA project which tests API, application built on Nodejs Express and Mysql Workbench for a product management system. 
The project tests unit functions, integration tests, and then end to end testing. For testing , jest, chai, and mocha, postman and newman is used. 
Please following instruction after cloning or downloading the repository.
Instructions to run:
Ensure you have Node.js and MySQL installed. Then, install the following dependencies on your Node.js Express server:

"body-parser": "^1.20.2",
    "chai": "^4.3.4",
    "chai-http": "^4.4.0",
    "express": "^4.19.2",
    "fs": "^0.0.1-security",
    "jest": "^29.7.0",
    "mocha": "^10.4.0",
    "mysql2": "^3.10.0",
    "node-mocks-http": "^1.14.1",
    "sinon": "^18.0.0",
    "supertest": "^7.0.0"

Then npm start for the server and to run the tests please use the following command: npm run  test:unit, test:integration, and test:e2e. All tests (18 unit tests, 7 integration tests, 10 e2e tests) shall pass. Then see the norman in JSON format.

Note: please use your own database table name in the logic files.

