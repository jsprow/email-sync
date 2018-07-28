import * as express from 'express';
import authorize from './routes/authorize';

const app = express();
app.set('view-engine', 'hbs');

app.use('/authorize', authorize);

app.listen(3000);
