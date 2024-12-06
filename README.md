# Diary Management Platform

## Project Overview

This project is a Diary Management Platform where users can register, log in, and manage their personal diary entries. It supports both local authentication and social login via Google and Facebook. Users can add, edit, and delete diary entries and access account details. The platform includes secure session handling and payment functionality for subscription services.

---

## Features

- **User Authentication**: Register, log in, and log out.
- **Social Login**: Google and Facebook authentication.
- **Diary Management**: Add, edit, and delete diary entries.
- **Pricing and Payments**: Simulated payment submission for subscription upgrades.
- **Account Details**: View user account details.

---

## File Structure

```
/public           # Static assets (CSS, JS, images)
/views            # EJS templates for frontend
app.js            # Main server file
.env              # Environment variables (not included in repo)
package.json      # Node.js dependencies
```

---

## Dependencies

Key dependencies used in the project:

- **express**: Web framework.
- **passport**: Authentication middleware.
- **mongoose**: MongoDB ORM.
- **dotenv**: Environment variable management.
- **ejs**: Templating engine.
- **passport-google-oauth20**: Google OAuth strategy.
- **passport-facebook**: Facebook OAuth strategy.
- **express-session**: Session handling.

---

## How to Start the Project Locally

### 1. Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v14+ recommended)
- **npm** (comes with Node.js)
- **MongoDB** (local or cloud instance)
- **Git** (optional)

---

### 2. Clone the Repository

```bash
git clone https://github.com/ranjanshashi9471/MyVirtualDiary
cd MyVirtualDiary
```

---

### 3. Install Dependencies

Run the following command in the project directory to install the required npm packages:

```bash
npm install
```

---

### 4. Configure Environment Variables

Create a `.env` file in the project root directory and add the following:

```env
# MongoDB connection string
MONGODB=<your_mongodb_connection_string>

# Google OAuth credentials
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>

# Facebook OAuth credentials
FACEBOOK_APP_ID=<your_facebook_app_id>
FACEBOOK_APP_SECRET=<your_facebook_app_secret>
```

Replace `<your_mongodb_connection_string>`, `<your_google_client_id>`, `<your_google_client_secret>`, `<your_facebook_app_id>`, and `<your_facebook_app_secret>` with your actual credentials.

---

### 5. Start MongoDB

If you’re using a local MongoDB instance, make sure it is running. Use the following command to start MongoDB:

```bash
mongod
```

---

### 6. Start the Server

Run the following command to start the Express server:

```bash
node app.js
```

The server will start on `http://localhost:3000`. You should see the message:

```
Server Started on port 3000
MongoDB Server Connected
```

---

### 7. Access the Application

- Open your browser and navigate to `http://localhost:3000`.
- You can register a new user or log in using Google or Facebook.

---

## Notes

- Ensure the `.env` file is correctly configured with valid OAuth credentials.
- Use a secure connection string for MongoDB (e.g., `mongodb+srv` for cloud databases).

---

## Contact

For any issues or inquiries, please mailat ranjanshashi9471@gmail.com.

Happy coding! 🚀
