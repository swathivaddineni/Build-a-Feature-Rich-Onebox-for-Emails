## Run locally
1. copy .env.example -> .env and fill values
2. Start docker services (Elasticsearch + Weaviate):
   docker compose up -d
3. Install dependencies:
   cd backend
   npm install
4. Run dev server:
   npm run dev

Endpoints:
- GET /api/health
- GET /api/emails?q=...
- GET /api/emails/:id
- POST /api/emails/:id/label  { label: "Interested" }
- POST /api/rag/suggest { emailId: "..." }
- POST /api/demo/classify { id: "..." }   // demo endpoint to run categorizer and notify
