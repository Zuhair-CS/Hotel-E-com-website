# 🌍 Wanderlust

Wanderlust is a full-stack travel destination web application inspired by Airbnb. Users can explore places, register and log in, add new destinations, leave reviews, and upload photos — all in a smooth, dynamic, and cloud-connected environment.

> 💻 This is my first deployed full-stack project, built with the **MongoDB, Express.js, Node.js, and EJS** stack and following the **MVC architecture**.

Live Site: [https://wanderlust-j3s6.onrender.com/](https://wanderlust-j3s6.onrender.com/)

---

## 📸 Features

- User authentication (register/login/logout)
- Create, edit, and delete travel destinations
- Upload images using Cloudinary
- Leave reviews on destinations
- Flash messages for success and error states
- Full form validation on both client and server
- Clean UI with EJS templating and Bootstrap
- Protected routes and authorization checks

---

## 🧱 Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose (ODM)
- Passport.js (authentication)
- Joi + express-validator (validation)

**Frontend**
- EJS (templating)
- ejs-mate (layouts and partials)
- Bootstrap (styling)
- Custom CSS

**Image Handling & Uploads**
- Multer (file upload handling)
- Cloudinary (image storage and CDN)

**Other Utilities**
- express-session & connect-flash (flash messaging and session storage)
- method-override (support for PUT/DELETE)
- dotenv (environment variable management)

---

## 📁 Project Structure
Wanderlust/
├── app.js # Main app file
├── routes/ # Express route handlers
├── controllers/ # Route logic
├── models/ # Mongoose schemas
├── views/ # EJS frontend templates
├── public/ # Static assets (CSS, JS, etc.)
├── uploads/ # Local upload (if any)
├── cloudConfig.js # Cloudinary config
├── schema.js # Joi validation schemas
└── init/ # MongoDB connection

**Steps to run application locally**

-Install dependencies using npm install

-Create a .env file in the root directory and include:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
DB_URL=your_mongodb_connection_string
SECRET=session_secret

-Run the development server: node app.js
App will be available at http://localhost:3000.
