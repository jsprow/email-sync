import * as express from 'express';
import { getAuthUrl } from '../helpers/auth';

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const signInUrl = getAuthUrl();
  const params = {
    active: { home: true },
    debug: signInUrl,
    signInUrl,
    title: 'Home'
  };

  res.render('index', params);
});

export default router;
