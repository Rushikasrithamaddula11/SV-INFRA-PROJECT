# Admin User Guide - Tuhe Swamy Properties

## 🚀 Quick Start

### Step 1: Create Admin Account

1. Navigate to: **http://localhost:3000/admin/setup**
2. Fill in the admin details:
   - **Name**: Your admin name
   - **Email**: admin@tuheswamy.com (or your preferred email)
   - **Password**: At least 6 characters
   - **Phone**: Your contact number
3. Click "Create Admin Account"
4. You'll be redirected to the login page

### Step 2: Login to Admin Panel

1. Navigate to: **http://localhost:3000/admin/login**
2. Enter your admin credentials
3. Click "Login"
4. You'll be taken to the Admin Dashboard

---

## 📊 Admin Dashboard Overview

The dashboard shows:
- **Total Properties** - Number of properties listed
- **Total Bookings** - Number of site visit bookings
- **Registered Users** - Total user accounts
- **Enquiries** - Number of property enquiries
- **Recent Bookings** - Latest booking requests
- **Recent Enquiries** - Latest property enquiries

---

## 🏘️ Managing Properties

### Add New Property

1. Click **Properties** in the admin navigation
2. Click **"+ Add Property"** button
3. Fill in the property details:

   **Basic Information:**
   - Property Name (e.g., "Verandah Estates")
   - Type: Villa, Apartment, Plot, or Project
   - Location (e.g., "Kokapet")
   - City: Hyderabad, Bengaluru, or Goa

   **Pricing:**
   - Price (₹) - Numeric value
   - Price Label (e.g., "₹2.85 Cr onwards")

   **Details:**
   - Size (sq.ft) - Total area
   - Bedrooms - Number of bedrooms
   - Status: Available, Reserved, or Sold
   - Developer Name

   **Description:**
   - Full property description
   - Amenities (comma-separated): e.g., "24x7 Security, Swimming Pool, Gym"
   - Nearby Places (comma-separated with distance): e.g., "International School — 2.1 km"

   **Images:**
   - Upload images directly (will upload to Cloudinary)
   - Or paste image URLs (comma-separated)

   **Featured:**
   - Check this box to feature the property on the homepage

4. Click **"Add Property"**

### Edit Property

1. Go to **Properties** page
2. Click **"Edit"** button on any property
3. Modify the details
4. Click **"Update Property"**

### Delete Property

1. Go to **Properties** page
2. Click **"Delete"** button on the property
3. Confirm the deletion

---

## 📅 Managing Bookings

View and manage site visit bookings from users:

1. Click **Bookings** in the admin navigation
2. See all booking requests with:
   - Property name
   - User name and contact
   - Preferred date/time
   - Status (Pending, Confirmed, Completed, Cancelled)
3. Update booking status as needed

---

## 👥 Managing Users

View and manage registered users:

1. Click **Users** in the admin navigation
2. See all registered users with:
   - Name
   - Email
   - Phone
   - Registration date
   - Role (User or Admin)

---

## 🔐 Default Credentials (First Time Setup)

**If you haven't created an admin yet, use these default credentials:**

- **Email**: admin@tuheswamy.com
- **Password**: TuheSwamy@2026

**⚠️ Important**: Change these credentials after first login!

---

## 🖼️ Image Upload (Cloudinary)

The system uses Cloudinary for image hosting:

1. In the property form, click "Choose Files" under "Upload Images"
2. Select one or multiple images
3. Wait for upload to complete
4. Images will automatically be added to the form

**Alternative**: Paste direct image URLs in the "Image URLs" field

---

## 🎯 Property Types Explained

- **Villa**: Independent houses with gardens
- **Apartment**: Multi-unit residential buildings
- **Plot**: Land parcels for sale
- **Project**: Upcoming or ongoing developments

---

## 📋 Property Status Options

- **Available**: Property is ready for sale
- **Reserved**: Property is on hold
- **Sold**: Property has been sold

---

## ✨ Featured Properties

Properties marked as "Featured" will appear:
- On the homepage "Featured Properties" section
- With priority in search results
- Limited to top listings

---

## 🔍 Tips for Best Results

1. **Use High-Quality Images**: Upload at least 5-8 images per property
2. **Write Detailed Descriptions**: Include all important features
3. **Keep Amenities Updated**: List all available facilities
4. **Add Nearby Locations**: Schools, hospitals, transportation
5. **Update Status Regularly**: Keep property availability current
6. **Use Accurate Pricing**: Include all charges and fees

---

## 🛠️ Troubleshooting

### Can't Login?
- Check your email and password
- Make sure you created an admin account at `/admin/setup`
- Try the default credentials if this is your first time

### Can't Add Properties?
- Check your Firebase/Firestore connection
- Ensure you're logged in as admin
- Check browser console for errors

### Images Not Uploading?
- Verify Cloudinary configuration in `src/utils/cloudinary.js`
- Check file size (max 10MB per image)
- Ensure internet connection is stable

---

## 📞 Support

For technical issues or questions, contact the development team.

---

## 🔒 Security Best Practices

1. **Change default password immediately**
2. **Use strong passwords** (minimum 8 characters, mix of letters, numbers, symbols)
3. **Don't share admin credentials**
4. **Log out when not using the admin panel**
5. **Regularly backup your data**

---

## 📱 Access URLs

- **Admin Setup**: http://localhost:3000/admin/setup
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin
- **Properties Management**: http://localhost:3000/admin/properties
- **Bookings Management**: http://localhost:3000/admin/bookings
- **Users Management**: http://localhost:3000/admin/users

---

**Created for Tuhe Swamy Properties** 🏘️
