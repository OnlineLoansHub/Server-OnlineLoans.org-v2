/**
 * E2E Tests for OnlineLoans.org API
 * 
 * Tests all modules:
 * - Health: /health, /health/ping
 * - Contact: POST/GET /api/contact
 * - Partner: POST/GET /api/partner
 * - Loan Application: POST/GET /api/loan-application
 * 
 * Run with: npm run test:e2e
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoDbModule } from '../src/database/mongodb.module';

describe('App E2E Tests', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let mongoUri: string;

  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(MongoDbModule)
      .useModule(
        MongooseModule.forRoot(mongoUri) as any,
      )
      .compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same validation pipes as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  describe('Health Module', () => {
    it('GET /health/ping - should return pong', () => {
      return request(app.getHttpServer())
        .get('/health/ping')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('message', 'pong');
        });
    });

    it('GET /health - should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
          expect(res.body).toHaveProperty('database');
          expect(res.body.database).toHaveProperty('mongodb');
        });
    });
  });

  describe('Contact Module', () => {
    let contactId: string;

    const validContactData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Test Subject',
      message: 'This is a test message',
    };

    it('POST /api/contact - should create a contact', () => {
      return request(app.getHttpServer())
        .post('/api/contact')
        .send(validContactData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('id');
          contactId = res.body.id;
        });
    });

    it('POST /api/contact - should reject invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/contact')
        .send({
          ...validContactData,
          email: 'invalid-email',
        })
        .expect(400);
    });

    it('POST /api/contact - should reject missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/contact')
        .send({
          name: 'John Doe',
          // Missing other required fields
        })
        .expect(400);
    });

    it('GET /api/contact - should return all contacts', () => {
      return request(app.getHttpServer())
        .get('/api/contact')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('contacts');
          expect(Array.isArray(res.body.contacts)).toBe(true);
        });
    });

    it('GET /api/contact/:id - should return a specific contact', () => {
      return request(app.getHttpServer())
        .get(`/api/contact/${contactId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('contact');
          expect(res.body.contact).toHaveProperty('_id', contactId);
          expect(res.body.contact).toHaveProperty('name', validContactData.name);
          expect(res.body.contact).toHaveProperty('email', validContactData.email);
        });
    });
  });

  describe('Partner Module', () => {
    let partnerId: string;

    const validPartnerData = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567890',
      site: 'https://example.com',
      company: 'Example Corp',
    };

    it('POST /api/partner - should create a partner', () => {
      return request(app.getHttpServer())
        .post('/api/partner')
        .send(validPartnerData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('id');
          partnerId = res.body.id;
        });
    });

    it('POST /api/partner - should reject invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/partner')
        .send({
          ...validPartnerData,
          email: 'invalid-email',
        })
        .expect(400);
    });

    it('POST /api/partner - should reject missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/partner')
        .send({
          name: 'Jane Smith',
          // Missing other required fields
        })
        .expect(400);
    });

    it('GET /api/partner - should return all partners', () => {
      return request(app.getHttpServer())
        .get('/api/partner')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('partners');
          expect(Array.isArray(res.body.partners)).toBe(true);
        });
    });

    it('GET /api/partner/:id - should return a specific partner', () => {
      return request(app.getHttpServer())
        .get(`/api/partner/${partnerId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('partner');
          expect(res.body.partner).toHaveProperty('_id', partnerId);
          expect(res.body.partner).toHaveProperty('name', validPartnerData.name);
          expect(res.body.partner).toHaveProperty('email', validPartnerData.email);
        });
    });
  });

  describe('Loan Application Module', () => {
    let applicationId: string;

    const validLoanApplicationData = {
      loanType: 'personal',
      amount: '50000',
      email: 'applicant@example.com',
      phone: '+1234567890',
    };

    it('POST /api/loan-application - should create a loan application', () => {
      return request(app.getHttpServer())
        .post('/api/loan-application')
        .send(validLoanApplicationData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('id');
          applicationId = res.body.id;
        });
    });

    it('POST /api/loan-application - should accept business loan type', () => {
      return request(app.getHttpServer())
        .post('/api/loan-application')
        .send({
          ...validLoanApplicationData,
          loanType: 'business',
          email: 'business@example.com',
        })
        .expect(201);
    });

    it('POST /api/loan-application - should reject invalid loan type', () => {
      return request(app.getHttpServer())
        .post('/api/loan-application')
        .send({
          ...validLoanApplicationData,
          loanType: 'invalid-type',
        })
        .expect(400);
    });

    it('POST /api/loan-application - should reject invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/loan-application')
        .send({
          ...validLoanApplicationData,
          email: 'invalid-email',
        })
        .expect(400);
    });

    it('POST /api/loan-application - should accept optional phone and additionalData', () => {
      return request(app.getHttpServer())
        .post('/api/loan-application')
        .send({
          loanType: 'personal',
          amount: '30000',
          email: 'optional@example.com',
          phone: '+9876543210',
          additionalData: {
            customField: 'customValue',
          },
        })
        .expect(201);
    });

    it('GET /api/loan-application - should return all loan applications', () => {
      return request(app.getHttpServer())
        .get('/api/loan-application')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('applications');
          expect(Array.isArray(res.body.applications)).toBe(true);
        });
    });

    it('GET /api/loan-application/:id - should return a specific loan application', () => {
      return request(app.getHttpServer())
        .get(`/api/loan-application/${applicationId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('application');
          expect(res.body.application).toHaveProperty('_id', applicationId);
          expect(res.body.application).toHaveProperty('email', validLoanApplicationData.email);
          expect(res.body.application).toHaveProperty('loanType', validLoanApplicationData.loanType);
        });
    });
  });
});

