# 🚀 Deployment Guide

Complete guide to deploy Verandah Estates to production.

## Pre-Deployment Checklist

- [ ] All Firebase services enabled (Auth, Firestore, Storage)
- [ ] Security rules deployed
- [ ] Test data seeded
- [ ] Admin account created
- [ ] App tested locally
- [ ] All features working correctly

## Option 1: Firebase Hosting (Recommended)

Firebase Hosting is the easiest way to deploy your React app with Firebase.

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase Hosting

```bash
cd verandah-estates
firebase init hosting
```

**Configuration:**
- Use existing project: Select **sami-b1b53**
- Public directory: **build**
- Configure as single-page app: **Yes**
- Set up automatic builds: **No**
- Overwrite index.html: **No**

### Step 4: Build the App

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Step 5: Deploy

```bash
firebase deploy --only hosting
```

Your app will be deployed to: `https://sami-b1b53.web.app`

### Step 6: Test Production

Visit your deployed URL and test:
- Browse properties
- Register/Login
- Admin panel access
- All features

## Option 2: Netlify

### Step 1: Build the App

```bash
npm run build
```

### Step 2: Deploy to Netlify

#### Option A: Drag & Drop
1. Go to [Netlify](https://app.netlify.com/)
2. Drag the `build` folder to Netlify

#### Option B: Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Step 3: Configure Redirects

Create `public/_redirects`:
```
/*    /index.html   200
```

This ensures React Router works correctly.

## Option 3: Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
cd verandah-estates
vercel --prod
```

Follow the prompts to configure your deployment.

## Post-Deployment Tasks

### 1. Update Firebase OAuth Settings

1. Go to Firebase Console → Authentication → Settings
2. Add your production domain to **Authorized domains**
3. Example: `sami-b1b53.web.app`

### 2. Update CORS Settings (if needed)

If you face CORS issues:

1. Go to Firebase Console → Storage → Rules
2. Add your production domain

### 3. Set Up Custom Domain (Optional)

#### Firebase Hosting:
```bash
firebase hosting:channel:deploy production --site sami-b1b53
```

Then in Firebase Console:
1. Hosting → Add custom domain
2. Follow DNS configuration steps

#### Netlify/Vercel:
Follow their respective custom domain guides in the dashboard.

### 4. Enable Analytics (Optional)

Your Firebase config already includes `measurementId`. Analytics will start automatically.

To view:
1. Go to Firebase Console → Analytics
2. View user behavior, events, and more

### 5. Set Up Environment Variables (Optional)

If you want to use environment variables:

**Firebase Hosting:**
```bash
firebase functions:config:set someservice.key="THE API KEY"
```

**Netlify:**
- Go to Site Settings → Build & Deploy → Environment
- Add variables

**Vercel:**
- Go to Project Settings → Environment Variables
- Add variables

## Production Optimization

### 1. Performance

Already included in the build:
- Minified JavaScript
- Optimized CSS
- Code splitting
- Lazy loading

### 2. SEO

Add to `public/index.html`:

```html
<!-- Meta Tags -->
<meta name="description" content="Premium villas, apartments and plots across Hyderabad, Bengaluru and Goa">
<meta name="keywords" content="real estate, villas, apartments, plots, property, Hyderabad, Bengaluru, Goa">

<!-- Open Graph -->
<meta property="og:title" content="Verandah Estates - Premium Real Estate">
<meta property="og:description" content="Premium villas, apartments and plots">
<meta property="og:image" content="%PUBLIC_URL%/og-image.jpg">
<meta property="og:url" content="https://your-domain.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Verandah Estates">
<meta name="twitter:description" content="Premium real estate listings">
<meta name="twitter:image" content="%PUBLIC_URL%/og-image.jpg">
```

### 3. Security Headers

Add to `public/_headers` (Netlify):

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```

### 4. Caching

Firebase Hosting automatically handles caching optimally.

For other platforms, configure caching for:
- Static assets: 1 year
- HTML: No cache
- API responses: As needed

## Monitoring & Maintenance

### 1. Monitor Performance

**Firebase Performance Monitoring:**
```bash
npm install firebase
```

Add to your app for automatic performance tracking.

### 2. Error Tracking

Consider adding:
- [Sentry](https://sentry.io/) for error tracking
- [LogRocket](https://logrocket.com/) for session replay

### 3. Uptime Monitoring

Use:
- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)

### 4. Backup Strategy

**Firestore Backup:**
1. Go to Firebase Console → Firestore
2. Set up scheduled backups
3. Or use Cloud Scheduler for automated exports

**Storage Backup:**
- Enable versioning in Firebase Storage
- Or set up Cloud Storage backup

## Continuous Deployment

### GitHub Actions (Firebase Hosting)

Create `.github/workflows/firebase-hosting.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: sami-b1b53
```

## Rollback Strategy

### Firebase Hosting
```bash
# View release history
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback
```

### Netlify/Vercel
Use their dashboard to rollback to previous deployments.

## Cost Optimization

### Firebase Pricing

**Free Tier Includes:**
- 50K reads/day (Firestore)
- 20K writes/day (Firestore)
- 20K deletes/day (Firestore)
- 1 GB storage (Firestore)
- 5 GB storage (Storage)
- 10 GB/month bandwidth (Hosting)

### Tips to Stay in Free Tier:
1. Implement pagination (reduce reads)
2. Cache data in localStorage
3. Optimize images before upload
4. Use Cloud Functions sparingly
5. Monitor usage in Firebase Console

### Upgrade When Needed:
- Blaze Plan (pay-as-you-go)
- Monitor costs daily
- Set budget alerts

## Support After Deployment

### User Support Channels:
1. In-app enquiry form
2. WhatsApp: +91 40 2345 6789
3. Email: hello@verandahestates.example
4. Phone: +91 40 2345 6789

### Admin Support:
1. Monitor admin panel daily
2. Respond to enquiries within 24h
3. Update property statuses regularly
4. Review and approve bookings

## Troubleshooting Production Issues

### Users Can't Login
- Check Firebase Auth in console
- Verify domain is authorized
- Check security rules

### Data Not Loading
- Check Firestore rules
- Verify API keys
- Check browser console errors
- Test with different browsers

### Images Not Showing
- Check Storage rules
- Verify image URLs
- Check CORS settings
- Test with direct URL access

### Slow Performance
- Check Firebase quotas
- Optimize Firestore queries
- Enable caching
- Use CDN for images

## Success Metrics

Track these KPIs:
- Daily active users
- Property views
- Booking requests
- Enquiry submissions
- Admin response time
- Page load speed
- Bounce rate

---

**Your app is now live! 🎉**

For issues, check Firebase Console logs and browser console first.
