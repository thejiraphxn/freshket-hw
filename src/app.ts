import express from 'express';
import calculateRoutes from './routes/calculate.routes';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';

const app = express();

app.use(express.json());
app.use(calculateRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
