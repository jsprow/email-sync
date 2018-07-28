import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as simpleOauth2 from 'simple-oauth2';

const id = 'c9968a27-658a-4ec0-930e-e664f883565b';
const secret = 'vyilueTHSP48oWFT641^_-=';
const tokenHost = 'https://login.microsoftonline.com';
const authorizePath = 'common/oauth2/v2.0/authorize';
const tokenPath = 'common/oauth2/v2.0/token';
const redirect_uri = 'http://localhost:3000/authorize';
const scope =
  'openid profile offline_access User.Read Mail.Read Calendars.Read';

const credentials: simpleOauth2.ModuleOptions = {
  client: {
    id,
    secret
  },
  auth: {
    tokenHost,
    authorizePath,
    tokenPath
  }
};
const oauth2 = simpleOauth2.create(credentials);

export const getAuthUrl = () => {
  const returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri,
    scope
  });

  return returnVal;
};

const saveValuesToCookie = (token: simpleOauth2.Token, res: Response) => {
  const user: any = jwt.decode(token.id_token);

  res.cookie('graph_access_token', token.access_token, {
    maxAge: 3600000,
    httpOnly: true
  });
  res.cookie('graph_user_name', user.name, { maxAge: 3600000, httpOnly: true });
  res.cookie('graph_refresh_token', token.refresh_token, {
    maxAge: 7200000,
    httpOnly: true
  });

  res.cookie('graph_token_expires', token.expires_at.getTime(), {
    maxAge: 3600000,
    httpOnly: true
  });
};

export interface ICookies {
  graph_access_token: string;
  graph_refresh_token: string;
  graph_token_expires: number;
}

export const getAccessToken = async (cookies: ICookies, res: Response) => {
  let token = cookies.graph_access_token;

  if (token) {
    const FIVE_MINUTES = 300000;
    const expiration = new Date(cookies.graph_token_expires - FIVE_MINUTES);

    if (expiration > new Date()) {
      return token;
    }
  }

  const refresh_token = cookies.graph_refresh_token;

  if (refresh_token) {
    const newToken = await oauth2.accessToken
      .create({ refresh_token: refresh_token })
      .refresh();
    saveValuesToCookie(newToken, res);
    return newToken.token.access_token;
  }

  return null;
};

export const getTokenFromCode = async (auth_code: string, res: Response) => {
  let result = await oauth2.authorizationCode.getToken({
    code: auth_code,
    redirect_uri,
    scope
  });

  const { token } = oauth2.accessToken.create(result);

  saveValuesToCookie(token, res);

  return token.access_token;
};

export const clearCookies = (res: Response) => {
  res.clearCookie('graph_access_token', { maxAge: 3600000, httpOnly: true });
  res.clearCookie('graph_user_name', { maxAge: 3600000, httpOnly: true });
  res.clearCookie('graph_refresh_token', { maxAge: 7200000, httpOnly: true });
  res.clearCookie('graph_token_expires', { maxAge: 3600000, httpOnly: true });
};
