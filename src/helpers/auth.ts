import { create } from 'simple-oauth2';

export const clientId = 'outlook-gmail-sync';
export const secret = 'thgKUGRG285!+voavRV77|!';
export const tokenHost = 'https://login.microsoftonline.com';
export const authorizePath = 'common/oauth2/v2.0/authorize';
export const tokenPath = 'common/oauth2/v2.0/token';
export const redirect_uri = 'openid profile User.Read Mail.Read';
export const scope = 'http://localhost:3000/authorize';

const credentials = {
  client: {
    id: clientId,
    secret
  },
  auth: {
    tokenHost,
    authorizePath,
    tokenPath
  }
};
const oauth2 = create(credentials);

export const getAuthUrl = () => {
  const returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri,
    scope
  });
  console.log(`Generated auth url: ${returnVal}`);
  return returnVal;
};

export const getTokenFromCode = async (auth_code: string) => {
  let result = await oauth2.authorizationCode.getToken({
    code: auth_code,
    redirect_uri,
    scope
  });

  const token = oauth2.accessToken.create(result);
  console.log('Token created: ', token.token);
  return token.token.access_token;
};

export default getAuthUrl;
