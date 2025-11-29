# DrapeDrop - Fashion Marketplace

A modern web application for buying and renting pre-loved dresses. Built with HTML, CSS, and JavaScript.

## Features

### 🔐 Authentication System
- **Professional Login/Register Page**: Dedicated authentication interface
- **User Registration**: Create new user accounts with email verification
- **Admin Registration**: Create admin accounts with proper permissions
- **Secure Login**: Email and password-based authentication
- **Session Management**: Persistent login sessions across browser sessions
- **Password Recovery**: Forgot password functionality
- **User Types**: Separate user and admin roles with different permissions
- **Default Accounts**: Pre-configured demo accounts for testing

### 🏠 Homepage
- Beautiful landing page with gradient background
- Single "Login/Register" button redirecting to auth page
- Feature showcase highlighting the platform's benefits
- Responsive design for all devices

### 👤 User Features
- **Browse Products**: View all available dresses with detailed information
- **Add to Cart**: Add dresses to shopping cart for purchase or rental
- **Shopping Cart**: Dedicated cart page with full functionality
- **Product Details**: View detailed information about each dress in a dedicated page
- **Checkout**: Complete purchase with delivery address

### 👨‍💼 Admin Features
- **Product Management**: View all current products
- **Add New Products**: Complete form to add new dresses with:
  - Product name, brand, color, size
  - Wear condition (Excellent, Very Good, Good, Fair)
  - Original price and current price
  - Product type (Sale or Rent)
  - Description and image upload
- **Instant Confirmation**: See newly added products immediately with visual highlighting
- **Form Auto-clear**: Form resets after successful product addition
- **Edit/Delete Products**: Manage existing products
- **Image Upload**: Upload product images with preview

### 🛍️ Product Information
Each dress includes:
- **Basic Details**: Name, brand, color, size
- **Condition**: How well the dress has been maintained
- **Pricing**: Original price and current sale/rent price
- **Type**: Available for sale or rent
- **Description**: Detailed information about the dress
- **Image**: High-quality product photos

## How to Use

### Authentication:
1. Open `index.html` in your web browser
2. Click "Login/Register" button
3. Choose between "Login" or "Register" tab
4. Select "User" or "Admin" type
5. Fill in required information and submit

### Default Demo Accounts:
- **User Account**: 
  - Email: `user@example.com`
  - Password: `user123`
- **Admin Account**:
  - Email: `admin@drapedrop.com`
  - Password: `admin123`

### For Users:
1. Login with user credentials
2. Browse available dresses
3. Click "Buy Now" or "Rent Now" to add to cart
4. Click the cart icon to view your cart
5. Enter delivery address and complete checkout

### For Admins:
1. Login with admin credentials
2. Use "Manage Products" tab to view current products
3. Use "Add New Product" tab to add new dresses
4. Fill in all required fields including image upload
5. Submit to add the product to the marketplace
6. **See instant confirmation**: Form clears, switches to products tab, and highlights your new product
7. **New products will automatically appear in the user dashboard!**

### Data Persistence:
- All products added by admins are saved to browser localStorage
- Products persist between browser sessions
- Changes made by admin immediately reflect in user view
- To reset to default products, run `clearAllData()` in browser console

## File Structure

```
DrapeDrop/
├── index.html              # Main homepage with login options
├── login.html              # Dedicated login/register page
├── auth.html               # Alternative authentication page
├── product-details.html    # Dedicated product details page
├── cart.html               # Dedicated shopping cart page
├── checkout.html           # Dedicated checkout and delivery page
├── styles.css              # Complete styling with modern design
├── script.js               # All functionality and interactions
└── README.md               # This documentation
```

## Technical Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Gradient backgrounds, smooth animations, hover effects
- **Modal Windows**: Login forms and cart display
- **Image Upload**: File preview functionality for admin
- **Data Persistence**: Products are saved to localStorage and persist between sessions
- **Real-time Updates**: Admin changes immediately reflect in user dashboard
- **Form Validation**: Required fields and proper input types
- **Interactive Elements**: Buttons, tabs, and dynamic content

## Demo Data

The application comes with 3 sample dresses:
1. **Elegant Black Evening Dress** - For sale at ₹12,499
2. **Summer Floral Dress** - For rent at ₹1,199/day
3. **Red Cocktail Dress** - For sale at ₹8,349

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Getting Started

1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start exploring the features!

## Future Enhancements

- Backend integration for real user authentication
- Payment gateway integration
- User reviews and ratings
- Advanced search and filtering
- Wishlist functionality
- Order tracking
- Admin analytics dashboard

---

**Note**: This is a frontend demo application. In a production environment, you would need:
- Backend server for data persistence
- Database for user and product management
- Secure authentication system
- Payment processing integration
- Image hosting service 