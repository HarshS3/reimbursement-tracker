# 🎨 Quick Visual Reference

## Page Layouts

### Homepage (/)
```
┌─────────────────────────────────────────────────┐
│                                                 │
│        FULL SCREEN 3D SPLINE (70% opacity)     │
│                                                 │
│        ┌─────────────────────────────┐         │
│        │                             │         │
│        │   AI-Powered Expense        │         │
│        │   Reimbursement System      │         │
│        │                             │         │
│        │     [Get Started]           │         │
│        │                             │         │
│        └─────────────────────────────┘         │
│                                                 │
│        💰 $10M+      ⚡ 50K+      🌍 150+      │
│         Processed   Users     Countries       │
│                                                 │
│                ↓ Scroll ↓                      │
└─────────────────────────────────────────────────┘
```

### SignIn Page (/signin)
```
┌─────────────────────────────────────────────────┐
│                                                 │
│     3D SPLINE BACKGROUND (20% opacity)         │
│                                                 │
│              Signin Page                        │
│                                                 │
│        ┌───────────────────────┐               │
│        │  ╔══════════════════╗ │               │
│        │  ║  Email           ║ │               │
│        │  ╚══════════════════╝ │               │
│        │                       │               │
│        │  ╔══════════════════╗ │               │
│        │  ║  Password    👁  ║ │               │
│        │  ╚══════════════════╝ │               │
│        │                       │               │
│        │     [  Login  ]       │               │
│        │                       │               │
│        │  Don't have account?  │               │
│        │      Signup           │               │
│        │  Forgot password?     │               │
│        └───────────────────────┘               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### SignUp Page (/signup)
```
┌─────────────────────────────────────────────────┐
│                                                 │
│     3D SPLINE BACKGROUND (20% opacity)         │
│                                                 │
│         1 admin user per company                │
│      Admin (company) Signup Page                │
│                                                 │
│        ┌───────────────────────┐   ┃           │
│        │  ╔══════════════════╗ │   ┃ Scrollable│
│        │  ║  Name            ║ │   ┃           │
│        │  ╚══════════════════╝ │   ┃           │
│        │  ╔══════════════════╗ │   ┃           │
│        │  ║  Email           ║ │   ┃           │
│        │  ╚══════════════════╝ │   ┃           │
│        │  ╔══════════════════╗ │   ┃           │
│        │  ║  Password    👁  ║ │   ┃           │
│        │  ╚══════════════════╝ │   ┃           │
│        │  ╔══════════════════╗ │   ┃           │
│        │  ║  Confirm     👁  ║ │   ┃           │
│        │  ╚══════════════════╝ │   ┃           │
│        │  ╔══════════════════╗ │   ┃           │
│        │  ║▼ Country Select  ║ │   ┃           │
│        │  ╚══════════════════╝ │   ┃           │
│        │   Currency: USD       │   ┃           │
│        │     [  Signup  ]      │   ┃           │
│        │                       │   ┃           │
│        │  Already have account?│   ┃           │
│        │      Sign in          │   ┃           │
│        └───────────────────────┘   ┃           │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Color Codes

### Backgrounds:
- `#0f172a` - Dark midnight blue
- `#1e293b` - Slate gray
- `rgba(255,255,255,0.1)` - Glass overlay

### Primary Colors:
- `primary-400` - #60a5fa (Light blue)
- `primary-500` - #3b82f6 (Primary blue)
- `primary-600` - #2563eb (Dark blue)

### States:
- `white/90` - Labels (90% opacity)
- `white/70` - Body text (70% opacity)
- `white/50` - Hints (50% opacity)
- `white/10` - Borders (10% opacity)
- `white/5` - Input backgrounds (5% opacity)

## Animation Timeline

### Homepage Load:
```
0ms    → Gradient background appears
100ms  → Spline starts loading
500ms  → Hero text fades in (opacity 0 → 1)
800ms  → CTA button slides up
1200ms → Stats cards animate in
1500ms → Spline fully loaded at 70%
```

### Auth Pages Load:
```
0ms    → Gradient background appears
100ms  → Spline starts loading
300ms  → Page title fades in
400ms  → Glass card fades + slides up
600ms  → Form fields render
800ms  → Spline fully loaded at 20%
```

## User Interactions

### SignIn:
1. User visits `/signin`
2. Sees subtle 3D background
3. Enters email → border glows blue
4. Enters password → can toggle visibility
5. Clicks "Login" → button shows loading
6. Success → redirects to `/dashboard`

### SignUp:
1. User visits `/signup`
2. Sees subtle 3D background
3. Fills Name, Email, Password, Confirm
4. Selects Country from dropdown
5. Currency auto-displays below
6. Clicks "Signup" → button shows loading
7. Success → redirects to `/dashboard`

## File Structure

```
src/
├── pages/
│   ├── Homepage.jsx          (70% Spline)
│   └── auth/
│       ├── SignIn.jsx        (20% Spline)
│       └── SignUp.jsx        (20% Spline)
├── index.css                 (Custom scrollbar)
└── hooks/
    └── useApi.js             (Country data)
```

## Quick Test Checklist

✅ Homepage:
- [ ] 3D Spline loads and is visible (bold)
- [ ] Hero text readable over 3D
- [ ] Scroll affects opacity/scale
- [ ] "Get Started" button works

✅ SignIn:
- [ ] 3D Spline subtle in background
- [ ] Form is primary focus
- [ ] Email validation works
- [ ] Password toggle works
- [ ] Login button has loading state
- [ ] Links navigate correctly

✅ SignUp:
- [ ] 3D Spline subtle in background
- [ ] All fields visible and functional
- [ ] Country dropdown loads
- [ ] Currency auto-displays
- [ ] Password match validation works
- [ ] Scrollbar appears if needed
- [ ] Signup button has loading state

## Browser DevTools Tips

### Check Spline Opacity:
1. Open DevTools (F12)
2. Inspect the Spline div
3. Look for `opacity-20` (Auth) or `opacity-70` (Home)

### Check Z-Index Layering:
```
Background: z-0   (Spline)
Content:    z-10  (Forms/Text)
```

### Performance Monitor:
- FPS should stay above 30
- Spline renders on GPU
- Forms remain responsive

## Troubleshooting

### Spline Not Loading:
- Check internet connection
- Scene URL correct: `6Wq1Q7YGyM-iab9i`
- Suspense fallback showing gradient
- Console for errors

### Form Not Submitting:
- Check validation errors
- Email format correct
- Password min 8 characters
- Country selected

### Styling Issues:
- Tailwind classes applied
- Glass-card class in index.css
- Primary colors defined in theme
- Border opacity correct

---

**Quick Start**: Visit http://localhost:5173/ and explore!

1. Homepage → See bold 3D hero
2. Click "Get Started" → SignUp page
3. Notice subtle 3D background
4. Fill form → Create account
5. Or click "Sign in" → SignIn page
