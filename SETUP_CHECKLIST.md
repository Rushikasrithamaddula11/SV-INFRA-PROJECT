# ✅ Verandah Estates - Setup Checklist

Use this checklist to ensure everything is set up correctly.

## 📦 Installation

- [ ] Node.js installed (v14+)
- [ ] Navigated to project folder
- [ ] Run `npm install` completed successfully
- [ ] All dependencies installed (check for errors)

## 🔥 Firebase Setup

### Project Configuration
- [ ] Firebase project exists (sami-b1b53)
- [ ] Firebase configuration in `src/firebase.js` is correct
- [ ] All API keys match your Firebase project

### Firebase Services
- [ ] **Authentication** enabled
  - [ ] Go to Firebase Console → Authentication
  - [ ] Click "Get started"
  - [ ] Enable "Email/Password" method
  
- [ ] **Firestore Database** created
  - [ ] Go to Firestore Database
  - [ ] Click "Create database"
  - [ ] Started in production mode
  - [ ] Selected a location
  
- [ ] **Storage** enabled
  - [ ] Go to Storage
  - [ ] Click "Get started"
  - [ ] Default rules accepted

### Security Rules
- [ ] **Firestore Rules** deployed
  - [ ] Copied from `firestore.rules`
  - [ ] Pasted in Firebase Console → Firestore → Rules
  - [ ] Clicked "Publish"
  
- [ ] **Storage Rules** deployed
  - [ ] Copied from `storage.rules`
  - [ ] Pasted in Firebase Console → Storage → Rules
  - [ ] Clicked "Publish"

## 🚀 Running the App

- [ ] Run `npm start`
- [ ] App opens at `http://localhost:3000`
- [ ] No console errors
- [ ] Page loads correctly

## 🌱 Data Seeding

### Open Browser Console (F12)

- [ ] **Seed Properties**
  ```javascript
  await window.runAllSeeds()
  ```
  - [ ] See "✅ Properties seeded successfully!"
  - [ ] 10 properties added

- [ ] **Create Admin User**
  ```javascript
  await window.createAdminUser('admin@verandah.com', 'Admin@123', 'Admin User')
  ```
  - [ ] See "✅ Admin user created successfully!"
  - [ ] Admin account ready

### Verify in Firebase Console
- [ ] Go to Firestore Database
- [ ] See `properties` collection (10 documents)
- [ ] See `users` collection (1 admin user)
- [ ] Admin user has `role: 'admin'`

## 🧪 Testing

### Public Website
- [ ] Home page loads with properties
- [ ] Can search properties
- [ ] Can filter by city/type
- [ ] Click on a property shows details
- [ ] Register a test user account
- [ ] Login works
- [ ] Can add property to favorites
- [ ] Favorite shows in Favorites page
- [ ] Can book a property
- [ ] Booking shows in Account page

### Admin Panel
- [ ] Go to `/admin/login`
- [ ] Login with admin@verandah.com / Admin@123
- [ ] Dashboard shows statistics
- [ ] Can view all properties
- [ ] Can add new property
- [ ] Can edit property
- [ ] Can delete property
- [ ] Can view bookings
- [ ] Can change booking status
- [ ] Can view users
- [ ] Can change user role

## 🎨 Customization (Optional)

- [ ] Updated contact phone numbers
- [ ] Updated contact email
- [ ] Updated company name (if needed)
- [ ] Updated About page content
- [ ] Updated colors (in `src/index.css`)
- [ ] Added real property images
- [ ] Customized footer links

## 📱 Responsive Testing

- [ ] Test on Desktop (1024px+)
- [ ] Test on Tablet (680-1024px)
- [ ] Test on Mobile (< 680px)
- [ ] Hamburger menu works on mobile
- [ ] All forms work on mobile
- [ ] Images load correctly on all devices

## 🔐 Security Verification

- [ ] Can't access admin without login
- [ ] Regular users can't access admin panel
- [ ] Users can only see their own bookings
- [ ] Can't edit other users' data
- [ ] Properties are publicly visible
- [ ] Authentication redirects work

## 📊 Final Checks

### Firebase Console
- [ ] All collections visible
- [ ] Sample data present
- [ ] Security rules active
- [ ] No errors in console

### Application
- [ ] No console errors
- [ ] All images load
- [ ] All links work
- [ ] Forms submit correctly
- [ ] Toast notifications appear
- [ ] Loading states show
- [ ] Error messages display

### Documentation
- [ ] Read README.md
- [ ] Read QUICKSTART.md
- [ ] Understand project structure
- [ ] Know how to add properties
- [ ] Know how to manage users

## 🚢 Ready for Production? (Optional)

If deploying to production:

- [ ] Read DEPLOYMENT.md
- [ ] Build works (`npm run build`)
- [ ] No build warnings/errors
- [ ] Production domain added to Firebase
- [ ] Environment variables configured
- [ ] Firebase billing set up (if needed)
- [ ] Monitoring tools installed
- [ ] Backup strategy in place
- [ ] Support channels active

## 📝 Notes

**Common Issues:**

1. **"Permission Denied" errors**
   - Check if security rules are deployed
   - Verify you're logged in
   - Check user role in Firestore

2. **Properties not showing**
   - Run seed command again
   - Check Firestore console for data
   - Clear browser cache

3. **Can't login to admin**
   - Verify admin account created
   - Check role is 'admin' in Firestore
   - Try password reset if needed

4. **Images not loading**
   - Check internet connection
   - URLs use picsum.photos (requires internet)
   - Replace with local images if needed

## ✨ Success Criteria

Your setup is complete when:

✅ App runs without errors  
✅ Can browse 10 sample properties  
✅ Can register and login as user  
✅ Can add favorites and make bookings  
✅ Can login to admin panel  
✅ Can manage properties in admin  
✅ All CRUD operations work  
✅ Firebase Console shows all data  

---

## 🎉 You're All Set!

If all items are checked, your Verandah Estates platform is fully functional!

**Next Steps:**
1. Customize content and branding
2. Add real property data
3. Test all features thoroughly
4. Deploy to production (see DEPLOYMENT.md)

**Need Help?**
- Check README.md for detailed documentation
- Review QUICKSTART.md for common tasks
- Check browser console for error messages
- Visit Firebase Console to verify data

---

**Congratulations on setting up your real estate platform! 🏘️**
