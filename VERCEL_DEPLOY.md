# Vercel Deploy — click-by-click

> Walk through this top to bottom. Should take ~8 minutes.
> You need: GitHub account, Vercel account (free, GitHub login), PayPal Live keys ready.

---

## Phase A — Push to GitHub (2 minutes)

Open a terminal where BreakFree lives:

```bash
cd /workspace/breakfree
git init
git add .
git commit -m "BreakFree v6 — ready for Vercel"
```

If `git init` says "Reinitialized existing Git repository", that's fine — just continue.

Then create a repo on GitHub:
1. Go to https://github.com/new
2. Repository name: `breakfree`
3. Public (or Private — both work on Vercel free tier)
4. **Do NOT** initialize with README, license, or .gitignore — we have all of those
5. Click **Create repository**

Back in the terminal:
```bash
git remote add origin https://github.com/YOUR_USERNAME/breakfree.git
git branch -M main
git push -u origin main
```

You should see a stream of files pushed. If it asks for credentials, use a personal access token (https://github.com/settings/tokens) — passwords don't work anymore for Git push.

---

## Phase B — Deploy the FRONTEND (3 minutes)

### B1 — Create the project

1. Go to https://vercel.com/dashboard
2. Click **Add New… → Project** (top right)
3. Find `breakfree` in the "Import Git Repository" list → click **Import**

### B2 — Configure the build

You should now be on a "Configure Project" page with these fields:

| Field | Set to |
|---|---|
| Project Name | `breakfree` |
| Framework Preset | **Vite** (auto-detected — confirm) |
| Root Directory | `./` (don't change) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | (leave default — `npm install`) |

### B3 — Add environment variables

Scroll down to **Environment Variables**. Click to expand. Add these one at a time:

| Name | Value |
|---|---|
| `VITE_PAYPAL_CLIENT_ID` | Your PayPal Live Client ID |
| `VITE_PAYPAL_PLAN_MONTHLY` | Your `P-...` monthly plan ID |
| `VITE_PAYPAL_PLAN_YEARLY` | Your `P-...` yearly plan ID |
| `VITE_PAYPAL_ENV` | `live` |
| `VITE_API_BASE` | leave BLANK for now — fill after backend deploys |

For each: type the name in the left field, paste the value in the right, click **Add**.

### B4 — Deploy

Click the big blue **Deploy** button.

Vercel will:
1. Clone your repo (~10s)
2. Run `npm install` (~30s)
3. Run `npm run build` (~30s)
4. Upload `dist/` to their CDN (~10s)

Total: ~90 seconds. Watch the build log scroll by.

When it's done, you'll see a green checkmark and a screenshot-style preview of your app. The URL will be at the top — something like:

**`https://breakfree-xyz.vercel.app`**

### B5 — Save the URL

Copy this URL. You'll need it in Phase D.

---

## Phase C — Deploy the BACKEND (3 minutes)

### C1 — Create the second project

1. Vercel dashboard → **Add New… → Project** (again)
2. Find `breakfree` in the list (same repo) → click **Import** (again)

### C2 — Configure

| Field | Set to |
|---|---|
| Project Name | `breakfree-api` |
| Framework Preset | **Other** |
| Root Directory | click **Edit** → type `server` |
| Build Command | `npm install` |
| Output Directory | (leave blank) |
| Install Command | `npm install` |

### C3 — Add environment variables

| Name | Value |
|---|---|
| `PAYPAL_CLIENT_ID` | Your PayPal Live Client ID |
| `PAYPAL_CLIENT_SECRET` | Your PayPal Live Secret |
| `PAYPAL_ENV` | `live` |
| `PAYPAL_WEBHOOK_ID` | Your `WH-...` webhook ID (you'll get this in Phase E) |
| `BREAKFREE_PUBLIC_URL` | `https://breakfree-xyz.vercel.app` (your frontend URL from B5) |
| `PORT` | `3001` |

### C4 — Deploy

Click **Deploy**. Wait ~2 minutes.

When it's done, you'll see the URL at the top:

**`https://breakfree-api-abc.vercel.app`**

Copy this URL.

---

## Phase D — Wire them together (1 minute)

1. Go back to the **frontend project** (`breakfree`, not `breakfree-api`)
2. **Settings** → **Environment Variables**
3. Find `VITE_API_BASE` → click the three dots → **Edit**
4. Paste the backend URL: `https://breakfree-api-abc.vercel.app`
5. Click **Save**
6. Vercel auto-redeploys the frontend. Wait ~1 minute.

### Test the backend works

Open this in a browser:
```
https://breakfree-api-abc.vercel.app/api/health
```

You should see:
```json
{"ok":true,"env":"live"}
```

If you see that, the backend is live. If you see a 404 or error, check Phase C — the Root Directory may not have been set to `server`.

---

## Phase E — Update the PayPal webhook (1 minute)

1. PayPal dashboard → https://developer.paypal.com/dashboard/applications
2. Click your BreakFree app
3. Scroll to **Webhooks** → click on your existing webhook
4. Change the URL to: `https://breakfree-api-abc.vercel.app/api/paypal/webhook`
5. Save

### Test the webhook

Still on the webhook page:
1. Click **"Send test event"**
2. Event type: `BILLING.SUBSCRIPTION.CREATED`
3. Click **Send test**

Go to Vercel → `breakfree-api` project → **Logs** tab. You should see within ~5 seconds:

```
Subscription BILLING.SUBSCRIPTION.CREATED: <id> → ACTIVE
```

If you see that line, the webhook is fully wired.

---

## Phase F — End-to-end test (1 minute)

1. Open your frontend URL: `https://breakfree-xyz.vercel.app`
2. Go through onboarding (pick a face, name, etc.)
3. Tap **Pricing** in the bottom nav (or go to `/#/pricing`)
4. The banner at the top should say **"✓ PayPal live"** in green
5. Click **Subscribe** on either the $5/mo or $45/yr tier
6. A real PayPal popup opens
7. Log in with your real PayPal account (or a sandbox test account if you haven't switched to live yet)
8. Approve the subscription
9. You should land back on BreakFree with the subscription verified

---

## Phase G — Connect a custom domain (optional)

If you want `breakfree.app` or similar instead of `breakfree-xyz.vercel.app`:

1. Buy the domain (Namecheap, Google Domains, Cloudflare Registrar)
2. Vercel → project → **Settings** → **Domains**
3. Type your domain → click **Add**
4. Vercel shows you the DNS records to add at your registrar
5. Add them (typically an `A` record and a `CNAME`)
6. Wait 5-30 minutes for DNS to propagate
7. SSL is automatic

---

## What to do if something goes wrong

| Symptom | Cause | Fix |
|---|---|---|
| Frontend deploy fails with "Module not found" | A bad import somewhere | Check the build log, fix the import |
| Backend deploy fails with "Cannot find module" | Root Directory not set to `server` | Phase C2 — set it |
| `/api/health` returns 404 | Backend not deployed, or routes misconfigured | Re-check Phase C2 |
| Banner still says "Demo mode" after deploy | Frontend env vars not picked up | Check `VITE_PAYPAL_CLIENT_ID` is set; Vercel needs a redeploy to pick up new env vars (Project → Deployments → ⋯ → Redeploy) |
| PayPal popup opens but says "Invalid client" | Wrong Client ID (Sandbox key in Live, or vice versa) | Re-paste the Client ID |
| Subscription approves but lands on error page | `VITE_API_BASE` not set or wrong | Phase D — verify |
| Webhook events aren't arriving | Wrong webhook URL in PayPal | Phase E |

---

## Time estimate

| Phase | Time |
|---|---|
| A: GitHub push | 2 min |
| B: Frontend deploy | 3 min |
| C: Backend deploy | 3 min |
| D: Wire them together | 1 min |
| E: PayPal webhook URL | 1 min |
| F: End-to-end test | 1 min |
| **Total** | **~11 minutes** |

If you already have GitHub CLI installed and Vercel account ready, the whole thing is closer to 7 minutes.

---

## After you're live

Once everything's wired and tested, you can:

1. **Switch from sandbox to live PayPal**: change `PAYPAL_ENV` and `VITE_PAYPAL_ENV` from `sandbox` to `live` in both projects, save, redeploy.

2. **Add a custom domain** (Phase G above)

3. **Start marketing**: open `/workspace/breakfree/MARKETING.md`, copy the Twitter thread, post it.

4. **Start the next app**: tell me what to build. The King routes to Development. The pipeline starts over.

---

## What I just did before handing this to you

- Wrote `.gitignore` so your PayPal keys in `.env` files can never be accidentally committed
- Verified `vercel.json` is correct
- Verified `server/index.js` and `server/package.json` are complete
- Verified `index.html` has the iOS PWA meta tags (apple-touch-icon, splash screen)
- Wrote `VERCEL_DEPLOY.md` (this file) with every click in order

The repo is ready to push. The configs are ready to deploy. The walkthrough is in front of you. Hit go.