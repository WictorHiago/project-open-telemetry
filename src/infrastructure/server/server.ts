import 'dotenv/config';
import 'reflect-metadata';
import '../container';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import routes from '../../presentation/http/routes';

// express
const server = express();
const port = process.env.SERVER_PORT;

// morgan
server.use(morgan('dev'));

//cors
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'tenant-id', 'tenantId'],
};
server.use(cors(corsOptions));

//helmet
server.use(helmet());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/api/v1', routes);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
