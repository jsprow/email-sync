import * as express from 'express';
import { getAuthUrl } from '../helpers/auth';
var router = express.Router();

/* GET /authorize. */
router.get('/', function(req, res, next) {
  // Get auth code
  const code = req.query.code;

  // If code is present, use it
  if (code) {
    res.render('index', { title: 'Home', debug: `Auth code: ${code}` });
  } else {
    // Otherwise complain
    res.render('error', {
      title: 'Error',
      message: 'Authorization error',
      error: { status: 'Missing code parameter' }
    });
  }
});

export default router;
