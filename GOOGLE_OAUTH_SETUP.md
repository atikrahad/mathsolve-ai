# Google OAuth Setup Guide

This guide explains how to set up Google OAuth authentication for MathSolve AI.

## Prerequisites

1. A Google Cloud Platform account
2. Your MathSolve AI project set up locally

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

## Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, navigate to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: `MathSolve AI`
   - User support email: Your email
   - Developer contact information: Your email
4. Add authorized domains if deploying to production
5. Save and continue through the scopes and test users sections

## Step 3: Create OAuth Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Configure:
   - Name: `MathSolve AI Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain (when deployed)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback` (for development)
     - Your production callback URL (when deployed)

## Step 4: Configure Environment Variables

### Backend (.env in apps/backend/)

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### Frontend (.env.local in apps/web/)

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Step 5: Features Implemented

### Backend Features
- **Google token verification**: Validates Google ID tokens
- **User creation/authentication**: Creates new users or authenticates existing ones
- **JWT integration**: Issues JWT tokens after successful Google authentication
- **Account linking**: Support for linking Google accounts to existing users
- **OAuth provider tracking**: Tracks authentication method in user profile

### Frontend Features
- **Google Sign-In button**: Pre-built component with Google branding
- **Auto-redirect**: Automatically redirects to dashboard after successful authentication
- **Error handling**: Displays appropriate error messages for failed authentication
- **Loading states**: Shows loading indicators during authentication process

### Endpoints Available

#### Public Endpoints
- `GET /auth/google/url` - Get Google OAuth authorization URL
- `POST /auth/google/callback` - Handle Google OAuth callback with authorization code
- `POST /auth/google/token` - Authenticate with Google ID token directly

#### Protected Endpoints
- `POST /auth/google/link` - Link Google account to existing authenticated user

## Step 6: Database Schema

The user model has been updated to support OAuth:

```prisma
model User {
  id            String    @id @default(cuid())
  username      String    @unique
  email         String    @unique
  passwordHash  String?   @map("password_hash") // Optional for OAuth users
  profileImage  String?   @map("profile_image")
  emailVerified Boolean   @default(false) @map("email_verified")
  provider      String?   // "local", "google", etc.
  providerId    String?   @map("provider_id") // OAuth provider user ID
  // ... other fields
}
```

## Step 7: Testing

1. Start both backend and frontend servers:
   ```bash
   # Terminal 1 - Backend
   cd apps/backend && npm run dev
   
   # Terminal 2 - Frontend
   cd apps/web && npm run dev
   ```

2. Navigate to `http://localhost:3000/auth/login`
3. Click "Sign in with Google"
4. Complete the Google OAuth flow
5. Verify you're redirected to the dashboard

## Security Features

- **Token validation**: All Google ID tokens are verified server-side
- **Email verification**: Only verified Google email addresses are accepted
- **JWT integration**: Standard JWT tokens are issued for session management
- **Rate limiting**: OAuth endpoints are rate-limited to prevent abuse
- **HTTPS enforcement**: Cookies are marked secure in production
- **CSRF protection**: State parameter validation for OAuth flows

## Troubleshooting

### Common Issues

1. **"Invalid client ID"**
   - Verify `GOOGLE_CLIENT_ID` is correct in both backend and frontend
   - Ensure the client ID matches your Google Cloud project

2. **"Redirect URI mismatch"**
   - Check that your redirect URI in Google Cloud matches your environment
   - Ensure `GOOGLE_REDIRECT_URI` is correctly set

3. **"Access denied"**
   - Verify OAuth consent screen is properly configured
   - Check that your email is added as a test user during development

4. **"Authentication failed"**
   - Check backend logs for detailed error messages
   - Verify Google API credentials are correctly configured

### Debug Mode

Enable debug logging by setting:
```env
LOG_LEVEL=debug
```

This will log detailed information about Google OAuth flows and token validation.

## Production Deployment

When deploying to production:

1. Update authorized domains in Google Cloud Console
2. Add production URLs to authorized JavaScript origins and redirect URIs
3. Set `NODE_ENV=production` to enable secure cookies
4. Use HTTPS for all OAuth flows
5. Store secrets securely (use secret managers in production)

## Support

For issues with Google OAuth setup:
1. Check Google Cloud Console logs
2. Review backend application logs
3. Verify all environment variables are correctly set
4. Test with a fresh Google account to rule out account-specific issues