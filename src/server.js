import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// Setup Swagger UI
try {
  const swaggerDocument = yaml.load(fs.readFileSync('./docs/openapi.yaml', 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.error('Could not load openapi.yaml', error);
}

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running perfectly!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;