# OnlineLoans.org API Server

NestJS API server with TypeScript and Mongoose for handling form submissions and website events.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.local.example`:
```bash
cp .env.local.example .env
```

3. Update `.env` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/onlineloans
FRONTEND_URL=http://localhost:3000
PORT=3001
```

4. Run the development server:
```bash
npm run start:dev
```

The server will run on `http://localhost:3001` (or the port specified in your `.env`).

## API Endpoints

### Contact Form
- **POST** `/api/contact` - Submit contact form
- **GET** `/api/contact` - Get all contact form submissions
- **GET** `/api/contact/:id` - Get a specific contact form submission

### Partner Form
- **POST** `/api/partner` - Submit partner form
- **GET** `/api/partner` - Get all partner form submissions
- **GET** `/api/partner/:id` - Get a specific partner form submission

### Loan Application
- **POST** `/api/loan-application` - Submit loan application
- **GET** `/api/loan-application` - Get all loan applications
- **GET** `/api/loan-application/:id` - Get a specific loan application

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts             # Root module
├── modules/
│   ├── contact/
│   │   ├── contact.controller.ts
│   │   ├── contact.service.ts
│   │   ├── contact.schema.ts
│   │   ├── contact.module.ts
│   │   └── dto/
│   │       └── create-contact.dto.ts
│   ├── partner/
│   │   ├── partner.controller.ts
│   │   ├── partner.service.ts
│   │   ├── partner.schema.ts
│   │   ├── partner.module.ts
│   │   └── dto/
│   │       └── create-partner.dto.ts
│   └── loan-application/
│       ├── loan-application.controller.ts
│       ├── loan-application.service.ts
│       ├── loan-application.schema.ts
│       ├── loan-application.module.ts
│       └── dto/
│           └── create-loan-application.dto.ts
```

## Technologies

- NestJS 10
- TypeScript
- Mongoose (MongoDB ODM)
- class-validator (for DTO validation)
- class-transformer

## Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
