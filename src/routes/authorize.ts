import * as express from 'express';
import { Response } from 'express';
import { clearCookies, getTokenFromCode } from '../helpers/auth';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const code = req.query.code;

  if (code) {
    let token: string;

    try {
      token = await getTokenFromCode(code, res);
    } catch (error) {
      res.render('error', {
        title: 'Error',
        message: 'Error exchanging code for token',
        error: error
      });
    }

    res.redirect('/');
  } else {
    res.render('error', {
      title: 'Error',
      message: 'Authorization error',
      error: { status: 'Missing code parameter' }
    });
  }
});

router.get('/signout', (req, res, next) => {
  clearCookies(res);

  res.redirect('/');
});

export default router;
