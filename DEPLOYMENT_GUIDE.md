# VaaniBiz Deployment Guide

## Quick Deployment to Vercel (Recommended)

Vercel is the easiest and most optimized platform for Next.js applications. Follow these steps:

### Step 1: Prepare Your Repository

1. Ensure your code is pushed to GitHub, GitLab, or Bitbucket
2. Make sure your `frontend` directory contains the Next.js app

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your Git repository
4. Configure project settings:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add: `NEXT_PUBLIC_OPPORTUNITIES_API_URL`
   - Value: Your AWS API Gateway URL (or leave empty to use mock data)
   - Select: Production, Preview, Development

6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to your frontend directory
cd VaaniBiz/frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? vaanibiz (or your choice)
# - Directory? ./
# - Override settings? No

# For production deployment
vercel --prod
```

### Step 3: Configure Environment Variables (if needed)

If you have an AWS API Gateway endpoint:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add:
   ```
   NEXT_PUBLIC_OPPORTUNITIES_API_URL=https://your-api-gateway-url.amazonaws.com/prod/opportunities
   ```
4. Redeploy to apply changes

### Step 4: Verify Deployment

1. Visit the deployment URL provided by Vercel (e.g., `vaanibiz.vercel.app`)
2. Test the following:
   - ✅ Landing page loads
   - ✅ Navigate to "Start Your Journey"
   - ✅ Language selector works
   - ✅ Voice recording interface appears
   - ✅ Processing page shows animations
   - ✅ Results page displays (with mock data if API not configured)

### Step 5: Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain (e.g., `vaanibiz.com`)
3. Follow DNS configuration instructions:
   - Add A record pointing to Vercel's IP
   - Or add CNAME record pointing to `cname.vercel-dns.com`
4. Wait for DNS propagation (5-30 minutes)
5. Vercel automatically provisions SSL certificate

---

## Alternative: Deploy to Netlify

### Using Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`
5. Add environment variables in Site settings → Environment variables
6. Click "Deploy site"

### Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd VaaniBiz/frontend

# Login
netlify login

# Initialize and deploy
netlify init

# Deploy to production
netlify deploy --prod
```

---

## Alternative: Deploy to AWS Amplify

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Connect your Git repository
4. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/.next
       files:
         - "**/*"
     cache:
       paths:
         - frontend/node_modules/**/*
   ```
5. Add environment variables
6. Save and deploy

---

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] All pages are accessible (/, /idea, /processing, /results)
- [ ] Voice recording works (requires HTTPS)
- [ ] Language selector functions correctly
- [ ] Animations render smoothly
- [ ] Mobile responsive design works
- [ ] API connection works (if configured) or mock data displays
- [ ] SSL certificate is active (HTTPS)
- [ ] Custom domain configured (if applicable)

---

## Monitoring and Analytics

### Vercel Analytics (Built-in)

1. Go to your project dashboard
2. Navigate to Analytics tab
3. View:
   - Page views
   - Performance metrics
   - Top pages
   - Visitor locations

### Add Google Analytics (Optional)

1. Create a Google Analytics property
2. Add tracking code to `app/layout.tsx`:

```typescript
// Add to <head> section
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

---

## Continuous Deployment

Once connected to Git, deployments are automatic:

- **Push to main branch** → Automatic production deployment
- **Push to other branches** → Preview deployment with unique URL
- **Pull requests** → Automatic preview deployments

---

## Troubleshooting

### Build Fails

1. Check build logs in Vercel/Netlify dashboard
2. Verify all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check Node.js version compatibility

### Environment Variables Not Working

1. Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding/changing environment variables
3. Check variable names match exactly (case-sensitive)

### Voice Recording Not Working

1. Ensure site is served over HTTPS (required for microphone access)
2. Check browser permissions for microphone
3. Test in Chrome/Edge (best support for Web Audio API)

### Slow Performance

1. Check Vercel Analytics for performance metrics
2. Verify images are optimized
3. Check bundle size: `npm run build` shows bundle analysis
4. Consider enabling ISR (Incremental Static Regeneration) for static pages

---

## Rollback Deployment

### Vercel

1. Go to Deployments tab
2. Find previous successful deployment
3. Click "..." menu → "Promote to Production"

### Netlify

1. Go to Deploys tab
2. Find previous deployment
3. Click "Publish deploy"

---

## Cost Estimates

### Vercel (Hobby - Free)

- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Analytics

### Vercel (Pro - $20/month)

- Everything in Hobby
- ✅ 1TB bandwidth
- ✅ Advanced analytics
- ✅ Team collaboration
- ✅ Password protection

### Netlify (Free)

- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS

---

## Next Steps After Deployment

1. **Share the URL** with your team and test users
2. **Monitor analytics** to track usage
3. **Set up error tracking** (e.g., Sentry)
4. **Configure API endpoint** when backend is ready
5. **Add custom domain** for professional branding
6. **Enable Web Analytics** to understand user behavior
7. **Set up status monitoring** (e.g., UptimeRobot)

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Netlify Docs**: https://docs.netlify.com

For VaaniBiz-specific issues, check the project README or contact the development team.
