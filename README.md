# Blog Application with Firebase Authentication

This is a **NestJS** application powered by **PostgreSQL** as its database and runs with **Docker Compose**. The project provides a blog platform secured with Firebase Authentication for user management. Here’s a summary of its functionality:

---

## **Key Features**

### **Authentication**

- **User Registration, Login, and Logout**:
  - Authentication is managed via **Firebase**.
  - Firebase returns an ID token upon successful login, which is securely stored in an HTTP-only **cookie** for subsequent authentication.
- **Protected Routes**:
  - An `AuthGuard` validates the token from the cookie to ensure secure access to protected resources.

### **User Features**

- **Profile Management**:
  - Authenticated users can view their profile information.

### **Post Management**

- **CRUD Operations**:
  - Users can **create**, **read**, **update**, and **delete** their blog posts.
  - Post images can be uploaded or removed using **Multer** for local storage.
- **Authorization**:
  - Users can only modify or delete the posts they own, ensuring data integrity and privacy.

### **Blog Explorer**

- **Published Blogs**:
  - A dedicated API allows users to explore published blogs created by other users.

### **Pagination**

- All list-based endpoints (e.g., posts, blog explorer) support **pagination** using `page` and `limit` query parameters for optimized data retrieval.

---

## **Technical Highlights**

1. **Backend Framework**:

   - Built with **NestJS**, utilizing its modular and scalable architecture.
   - Follows **Clean Architecture** principles for code organization, ensuring separation of concerns.

2. **Database**:

   - Uses **PostgreSQL** for data storage.
   - Database interactions are managed with **TypeORM**, leveraging its powerful ORM features.

3. **Authentication**:

   - Integrates **Firebase Authentication** for user registration and login.
   - Secures sensitive routes using custom NestJS `AuthGuard`.

4. **File Management**:

   - Implements **Multer** for handling image uploads and managing local storage.

5. **Containerized Deployment**:
   - Configured to run using **Docker Compose**, spinning up both the application and a PostgreSQL database.

---

## **How to Run the Project**

1. Clone the repository and navigate to the project directory.
2. Ensure Docker is installed and running on your machine.
3. Ensure .env file is created and has following fields:

```bash
 FIREBASE_PROJECT_ID=
 FIREBASE_CLIENT_EMAIL=
 FIREBASE_PRIVATE_KEY=
 FIREBASE_API_KEY=
 DB_HOST=
 DB_PORT=
 DB_USER=
 DB_PASS=
 DB_NAME=
 PORT=
 NODE_ENV=
```

4. Run the application with the following command:

```bash
docker-compose up
```

5. Access the API at `http://localhost:<PORT>` (as defined in your environment variables).

---

## **Usage Flow**

1. **User Authentication**:
   - Register or log in via Firebase.
   - Token is securely set in a cookie for subsequent authenticated requests.
2. **Profile**:
   - View your profile information.
3. **Post Management**:
   - Create, update, delete, or upload/remove images for your posts.
4. **Blog Explorer**:
   - Explore published blogs from other users.
5. **Pagination**:
   - Use `page` and `limit` query parameters to navigate lists efficiently.

---

## **Future Improvements**

- Implement role-based access control (e.g., admin users).
- Add advanced search and filtering options for blog explorer.
- Enhance image management with cloud storage (e.g., AWS S3).

This project demonstrates secure authentication, modular architecture, and seamless user experience with robust backend development principles.

## Author

Created by "PocketJack (Rez Khaleghi)"

- GitHub: https://github.com/rezkhaleghi
- Email: rezaxkhaleghi@gmail.com
# blog-firebase
