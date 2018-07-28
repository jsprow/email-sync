import * as express from 'express';
import { getAccessToken, getAuthUrl } from '../helpers/auth';
import { IParams } from './routes';

const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response, next) => {
  let params: IParams = { title: 'Home', active: { home: true } };

  const accessToken: string = await getAccessToken(req.cookies, res);
  const userName: string = req.cookies.graph_user_name;

  if (accessToken && userName) {
    params.user = userName;
    params.debug = `User: ${userName}\nAccess Token: ${accessToken}`;
  } else {
    params.signInUrl = getAuthUrl();
    params.debug = params.signInUrl;
  }

  res.render('index', params);
});

export default router;
