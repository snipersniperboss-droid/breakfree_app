# Deploying BreakFree's Backend

The frontend is already deployed on Vercel-style static hosting (or `space.minimax.io`).
This file is for deploying the **backend** (the Express server that holds your PayPal Secret
and verifies subscriptions).

Pick whichever host is easiest for you. All four are written below; only one needs to be deployed.

---

## Quick comparison

| Host | Sign-up | Free tier | Card required? | Easiest if... |
|---|---|---|---|---|
| **Vercel** | GitHub login | 100 GB-bandwidth, plenty of function calls | No | You already have GitHub (you do) |
| **Render** | Email | 750 hrs/mo free web service | No | You want a traditional long-running server |
| **Railway** | GitHub login | $5 free credit/month | **Yes** (won't charge unless you exceed) | You want the simplest deploy |
| **Fly.io** | Email | Generous free tier | **Yes** (won't charge unless you exceed) | You want global edge deployment |

**My recommendation: Vercel.** It's the same platform that can host your frontend, so you have
one dashboard for everything. GitHub-login signup means 30 seconds to register, no card.

---

## Option 1 — Vercel (recommended)

### 1.1 Sign up
1. Go to **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel on your GitHub account

### 1.2 Push BreakFree to GitHub (if not already)

```bash
cd /workspace/breakfree
git init
git add .
git commit -m "BreakFree v5 with PayPal"
gh repo create breakfree --public --source=. --push
```

If you don't have the `gh` CLI: create the repo at github.com/new, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/breakfree.git
git branch -M main
git push -u origin main
```

### 1.3 Deploy the frontend
1. Vercel dashboard → **Add New → Project**
2. Import `breakfree` repo
3. Root directory: `./`
4. Framework: Vite (auto-detected)
5. Build command: `npm run build`
6. Output directory: `dist`
7. **Don't deploy yet** — first set up env vars:

**Environment Variables for the frontend:**

| Name | Value |
|---|---|
| `VITE_PAYPAL_CLIENT_ID` | your PayPal Client ID |
| `VITE_PAYPAL_PLAN_MONTHLY` | `P-...` from PayPal plans |
| `VITE_PAYPAL_PLAN_YEARLY` | `P-...` from PayPal plans |
| `VITE_PAYPAL_ENV` | `live` |
| `VITE_API_BASE` | leave blank for now — fill in after backend deploys |

8. Click **Deploy**. Wait ~2 minutes. Save the URL (e.g. `breakfree-xyz.vercel.app`).

### 1.4 Deploy the backend
1. Vercel dashboard → **Add New → Project** again
2. Import the **same `breakfree` repo**
3. Project name: `breakfree-api`
4. **Root directory: edit → `server`**
5. Framework: Other
6. Build command: `npm install`
7. Output directory: leave blank

**Environment Variables for the backend:**

| Name | Value |
|---|---|
| `PAYPAL_CLIENT_ID` | your PayPal Client ID |
| `PAYPAL_CLIENT_SECRET` | your PayPal Secret |
| `PAYPAL_ENV` | `live` |
| `PAYPAL_WEBHOOK_ID` | `WH-...` from PayPal webhook setup |
| `BREAKFREE_PUBLIC_URL` | `https://breakfree-xyz.vercel.app` (your frontend URL) |
| `PORT` | `3001` |

8. Click **Deploy**. Wait ~2 minutes. Save the URL (e.g. `breakfree-api-abc.vercel.app`).

### 1.5 Update frontend's API URL
1. Go back to the **frontend project** → Settings → Environment Variables
2. Edit `VITE_API_BASE` → set to your backend URL
3. Vercel auto-redeploys the frontend (~1 min)

### 1.6 Update PayPal webhook
1. PayPal dashboard → your app → Webhooks
2. Change the URL to `https://breakfree-api-abc.vercel.app/api/paypal/webhook`

---

## Option 2 — Render

### 2.1 Sign up
1. Go to **https://render.com** → Sign up with email
2. (Use your Gmail if you want — Render is fine with Gmail)

### 2.2 Create the web service
1. Render dashboard → **New → Web Service**
2. **Connect your GitHub repo** (or paste the public repo URL)
3. Settings:
   - Name: `breakfree-api`
   - Region: pick one close to your users
   - Branch: `main`
   - Root directory: `.` (it'll use the Dockerfile in the repo root)
   - Runtime: **Docker**
   - Plan: **Free**
4. Click **Create Web Service**

### 2.3 Add environment variables
In the Render dashboard → your service → Environment tab, add:

| Name | Value |
|---|---|
| `PAYPAL_CLIENT_ID` | your PayPal Client ID |
| `PAYPAL_CLIENT_SECRET` | your PayPal Secret |
| `PAYPAL_ENV` | `live` |
| `PAYPAL_WEBHOOK_ID` | `WH-...` |
| `BREAKFREE_PUBLIC_URL` | `https://your-frontend-url` |
| `PORT` | `3001` |

Render will rebuild automatically. Wait ~3 minutes for the first build.

Save the URL (e.g. `breakfree-api.onrender.com`).

### 2.4 Update PayPal webhook
Webhook URL → `https://breakfree-api.onrender.com/api/paypal/webhook`

Note: Render's free tier sleeps after 15 min of inactivity. First request after sleep takes ~30 sec.

---

## Option 3 — Railway

### 3.1 Sign up
1. Go to **https://railway.app** → **Login with GitHub**
2. Authorize Railway on GitHub
3. (Add a credit card for verification, but you won't be charged on the free tier)

### 3.2 Deploy
1. Railway dashboard → **New Project → Deploy from GitHub**
2. Select `breakfree` repo
3. Railway auto-detects Dockerfile
4. Add the same env vars as the Render setup
5. Click Deploy

Save the URL (e.g. `breakfree-api.up.railway.app`).

### 3.3 Update PayPal webhook
Webhook URL → `https://breakfree-api.up.railway.app/api/paypal/webhook`

---

## Option 4 — Fly.io

### 4.1 Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### 4.2 Sign up
```bash
fly auth signup
```
(Use your Gmail.)

### 4.3 Launch
```bash
cd /workspace/breakfree
fly launch --no-deploy
```
This creates a `fly.toml`. Then:
```bash
fly secrets set PAYPAL_CLIENT_ID=... \
              PAYPAL_CLIENT_SECRET=... \
              PAYPAL_WEBHOOK_ID=... \
              PAYPAL_ENV=live \
              BREAKFREE_PUBLIC_URL=https://your-frontend-url
fly deploy
```

---

## After deploying

### Test the backend

Visit `https://your-backend-url/api/health` in a browser. You should see:

```json
{"ok":true,"env":"live"}
```

If you see that, the backend is live and reachable.

### Test the webhook

From PayPal dashboard → your app → Webhooks → click on your webhook → "Send test event" → choose `BILLING.SUBSCRIPTION.CREATED` → send. Check your host's logs (Vercel: Logs tab; Render: Logs tab; Railway: Logs tab) for the line:

```
Subscription BILLING.SUBSCRIPTION.CREATED: <id> → ACTIVE
```

If you see that line, the webhook is wired up correctly.

### Test end-to-end

1. Open your BreakFree frontend URL
2. Go to Pricing
3. Banner should be **"✓ PayPal live"** (green)
4. Click Subscribe
5. Real PayPal popup opens
6. Approve with a real PayPal account
7. Lands back on BreakFree with subscription verified

---

## My recommendation for fastest path

**Vercel**, two projects, GitHub login. ~10 minutes from signup to live PayPal checkout.

If you want to use Render instead because you don't want Vercel hosting the frontend:
**Render** for the backend only (the frontend stays on `space.minimax.io`). ~15 minutes.

Whichever you pick, the env vars to paste are identical.

---

## The honest bottom line

I can't sign up for these services for you. But I've:
- Written `vercel.json` (Vercel)
- Written `Dockerfile` (Render, Railway, Fly, anything Docker)
- Written `render.yaml` (Render)
- Written this walkthrough

So when you sign up — which takes 30 seconds — everything else is one click per env var. You got this.