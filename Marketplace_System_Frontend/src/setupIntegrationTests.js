// setupIntegrationTests.js
import request from 'supertest';
import app from './App'; // Adjust the path to your app

global.request = request(app);
