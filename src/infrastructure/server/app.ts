import 'dotenv/config';
import 'reflect-metadata';
import '../container';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import routes from '../../presentation/http/routes';

// express
export const app = express();

// morgan
app.use(morgan('dev'));

//cors
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'tenant-id', 'tenantId'],
};
app.use(cors(corsOptions));

//helmet
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

