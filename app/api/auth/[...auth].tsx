import { passportAuth } from 'blitz';
import db from 'db';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const HOST =
  process.env.NODE_ENV === 'production'
    ? 'https://dev-meeting-topics.herokuapp.com'
    : 'http://localhost:3000';

export default passportAuth({
  successRedirectUrl: '/',
  errorRedirectUrl: '/',
  strategies: [
    {
      authenticateOptions: { scope: ['email', 'profile', 'openid'] },
      strategy: new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${HOST}/api/auth/google/callback`,
        },
        async function (_accessToken, _refreshToken, profile, done) {
          const email = profile.emails && profile.emails[0]?.value;

          if (!email) {
            // This can happen if you haven't enabled email access in your google app permissions
            return done(new Error("Google OAuth response doesn't have email."));
          }

          const avatar = profile?.photos?.[0]?.value;

          const user = await db.user.upsert({
            where: { email },
            create: {
              email,
              avatar,
              name: profile.displayName,
            },
            update: { email, name: profile.displayName },
          });

          const publicData = {
            userId: user.id,
            roles: [user.role],
            source: 'google',
          };
          done(null, { publicData });
        }
      ),
    },
  ],
});
