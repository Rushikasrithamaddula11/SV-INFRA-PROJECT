# 🚀 Quick Start Guide - Verandah Estates

Get your real estate platform up and running in 5 minutes!

## Step 1: Install Dependencies (1 min)

```bash
cd verandah-estates
npm install
```

## Step 2: Firebase Setup (2 min)

### Enable Firebase Services

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **sami-b1b53**
3. Enable these services:

**Authentication:**
- Go to Authentication → Get Started
- Click "Sign-in method" tab
- Enable "Email/Password"
- Save

**Firestore Database:**
- Go to Firestore Database → Create Database
- Start in **production mode**
- Choose location: (your nearest region)

**Storage:**
- Go to Storage → Get Started
- Use default security rules

## Step 3: Deploy Security Rules (1 min)

### Firestore Rules
1. Go to Firestore Database → Rules tab
2. Replace all content with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /users/{userId} {
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow read: if isAuthenticated();
      allow update: if request.auth.uid == userId || isAdmin();
      allow delete: if isAdmin();
    }
    
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /bookings/{bookingId} {
      allow create: if isAuthenticated();
      allow read: if isAuthenticated();
      allow update, delete: if isAdmin();
    }
    
    match /siteVisits/{visitId} {
      allow create: if isAuthenticated();
      allow read: if isAuthenticated();
      allow update, delete: if isAdmin();
    }
    
    match /enquiries/{enquiryId} {
      allow create: if isAuthenticated();
      allow read: if isAuthenticated();
      allow update, delete: if isAdmin();
    }
    
    match /favorites/{favoriteId} {
      allow create, read, delete: if isAuthenticated();
    }
  }
}
```

3. Click **Publish**

### Storage Rules
1. Go to Storage → Rules tab
2. Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## Step 4: Start the App (1 min)

```bash
npm start
```

The app will open at `http://localhost:3000`

## Step 5: Seed Data & Create Admin

Open Browser Console (F12) and run these commands one by one:

### 1. Seed Properties (10 sample properties)
```javascript
await window.runAllSeeds()
```

Wait for "✅ Properties seeded successfully!"

### 2. Create Admin Account
```javascript
await window.createAdminUser('admin@verandah.com', 'Admin@123', 'Admin User')
```

You should see: "✅ Admin user created successfully!"

## 🎉 You're Ready!

### Test the Public Website
1. Go to `http://localhost:3000`
2. Browse properties
3. Register a test user
4. Add properties to favorites
5. Book a property viewing

### Access Admin Panel
1. Go to `http://localhost:3000/admin/login`
2. Login with:
   - **Email:** admin@verandah.com
   - **Password:** Admin@123
3. Explore:
   - Dashboard - View statistics
   - Properties - Add/Edit/Delete properties
   - Bookings - Manage customer bookings
   - Users - View and manage users

## 📝 Quick Tips

### Add More Properties
In Admin Panel:
1. Go to Properties
2. Click "+ Add Property"
3. Fill the form
4. Save

### Test Bookings
1. Register as a regular user
2. Open any property
3. Click "Book Now"
4. Fill the form
5. Check Admin Panel → Bookings

### Change User to Admin
1. Go to Firebase Console
2. Firestore Database
3. Open `users` collection
4. Find your user
5. Edit document
6. Change `role` field from `user` to `admin`
7. Save

## 🐛 Common Issues

### "Permission Denied" Errors
- Make sure security rules are deployed
- Check that you're logged in
- Verify user has correct role in Firestore

### Seeding Doesn't Work
- Open browser console to see errors
- Make sure you're on the app page (localhost:3000)
- Try refreshing and running commands again

### Can't Login to Admin
- Verify you ran `createAdminUser` command
- Check Firestore → users collection
- Ensure user has `role: 'admin'`

### Properties Not Showing
- Check Firestore → properties collection
- Run seed command again if needed
- Check browser console for errors

## 🎨 Customize

### Change Colors
Edit `src/index.css` - look for CSS variables:
```css
:root {
  --ink: #1B1F1C;      /* Primary dark */
  --brass: #B48A4A;    /* Accent color */
  --moss: #45573F;     /* Success */
  /* ... */
}
```

### Change Logo Text
Edit `src/components/Header.js`:
```javascript
<span className="slat"></span>
VERANDAH  // Change this
```

### Add More Cities
Edit property form in `AdminProperties.js`:
```javascript
<option value="Mumbai">Mumbai</option>
<option value="Delhi">Delhi</option>
```

## 📱 Next Steps

1. **Add Real Images**: Upload property images to Firebase Storage
2. **Customize Content**: Update About page, contact info
3. **Add More Features**: Reviews, comparisons, mortgage calculator
4. **Deploy**: Use `npm run build` and deploy to Firebase Hosting
5. **Custom Domain**: Set up your own domain in Firebase Console

## 💡 Pro Tips

- Use Chrome DevTools for testing (F12)
- Check Network tab if data doesn't load
- Firebase Console is your friend - check Firestore data there
- Test on mobile using Chrome DevTools device emulation

---

**Need Help?** Check the full README.md for detailed documentation!

**Happy Building! 🏘️**
