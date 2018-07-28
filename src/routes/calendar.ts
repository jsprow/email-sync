import * as graph from '@microsoft/microsoft-graph-client';
import * as express from 'express';
import { getAccessToken } from '../helpers/auth';
import { IParams } from './routes';
import { JSONCookies } from '../../node_modules/@types/cookie-parser';

const router = express.Router();

router.get('/', async function(req, res, next) {
  let parms: IParams = { title: 'Calendar', active: { calendar: true } };

  const accessToken = await getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;

    const client = graph.Client.init({
      authProvider: done => {
        done(null, accessToken);
      }
    });

    const start = new Date(new Date().setHours(0, 0, 0));
    const end = new Date(new Date(start).setDate(start.getDate() + 7));

    try {
      const result = await client
        .api(
          `/me/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`
        )
        .top(10)
        .select('subject,start,end,attendees')
        .orderby('start/dateTime DESC')
        .get();

      console.log(JSON.stringify(result, null, 2));
      parms.events = result.value;

      res.render('calendar', parms);
    } catch (err) {
      parms.message = 'Error retrieving events';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);

      res.render('error', parms);
    }
  } else {
    res.redirect('/');
  }
});

export default router;
