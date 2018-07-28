import * as graph from '@microsoft/microsoft-graph-client';
import * as express from 'express';
import { getAccessToken } from '../helpers/auth';
import { IMessage, IParams } from './routes';

const router = express.Router();

router.get('/', async function(
  req: express.Request,
  res: express.Response,
  next
) {
  let parms: IParams = { title: 'Inbox', active: { inbox: true } };

  const accessToken = await getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;

    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: done => {
        done(null, accessToken);
      }
    });

    try {
      // Get the 10 newest messages from inbox
      const result = await client
        .api('/me/mailfolders/inbox/messages')
        .top(10)
        .select('subject,from,receivedDateTime,isRead')
        .orderby('receivedDateTime DESC')
        .get();

      parms.messages = result.value;
      res.render('mail', parms);
    } catch (err) {
      parms.message = 'Error retrieving messages';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.render('error', parms);
    }
  } else {
    // Redirect to home
    res.redirect('/');
  }
});

export default router;
