import path from 'node:path';
import express from 'express';
import logger from 'morgan';
import createError from 'http-errors';
import cors from 'cors';
import multer from 'multer';
import mainRouter from './routes/main.js';
import authRouter from './routes/auth.js';


const server = express();
const upload = multer();

server.set('views', path.resolve('./http/views'));
server.set('view engine', 'ejs');
server.use((req, res, next) => {
    console.log('Запит на маршрут:', req.originalUrl);
    next();  // Дозволити виконання наступних middleware
});


server.use(cors({
    origin: 'http://localhost:3000', 
  }));
  
server.use(logger('dev'));
server.use(express.static(path.resolve('./http/public')));
server.use(upload.none());
server.use(express.json());



server.use('/', mainRouter);
server.use('/auth', authRouter);

server.use((req, res, next) => {
    next(createError(404));
});


// error handler
server.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default server;
