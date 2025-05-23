# Full Stack Application Review & Adjustment Checklist

This checklist covers integration between your frontend (`public/html/index.html`), backend (Express API), static assets, and deployment readiness. Review and apply these recommendations to ensure your application is fully functional and ready to host.

---

## 1. **Frontend–Backend Integration**

- **API Endpoints:**

  - Ensure all product data, cart, auth, and order actions in your frontend JavaScript (`/js/*.js`) are making requests to the correct backend endpoints (e.g., `/api/products`, `/api/cart`, `/api/auth`, `/api/orders`).
  - If your product cards are static in HTML, consider fetching them dynamically from `/api/products` for real data.

- **Image URLs:**

  - Product images use `/api/placeholder/200/150`.
    - If this is a real endpoint, ensure it's implemented in your backend.
    - If not, replace with actual image URLs or implement a placeholder endpoint.

- **AJAX/Fetch Calls:**
  - Review all JS files for fetch/XHR calls. Ensure URLs match your Express routes and handle CORS if frontend and backend are on different domains during development.

---

## 2. **Static Assets**

- **CSS/JS Paths:**

  - All CSS and JS files are referenced as `../css/...` and `../js/...`.
    - Ensure your Express static middleware serves these correctly:
      ```js
      app.use(express.static(path.join(__dirname, "public")));
      ```
    - Your directory structure should be:
      ```
      /public
        /html
        /css
        /js
        /images (optional)
      ```
    - Accessing `/css/styles.css` in the browser should work.

- **Images:**
  - If you have product images, place them in `/public/images` and reference as `/images/filename.jpg`.

---

## 3. **Backend API**

- **Route Registration:**

  - All routes (`auth`, `products`, `cart`, `orders`, `hello`) should be registered in `server.js`:
    ```js
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/hello", helloRoutes);
    ```

- **Controllers:**

  - Each route should have a corresponding controller handling business logic and DB interaction.

- **Error Handling:**

  - Ensure your error middleware is last:
    ```js
    app.use(errorHandler);
    ```

- **Database Connection:**
  - Confirm `connectDB()` uses only one URI and proper options.

---

## 4. **Environment Variables**

- `.env` should include:
  ```
  MONGO_URI=mongodb://localhost:27017/your-db
  PORT=5000
  NODE_ENV=development
  CORS_ORIGIN=http://localhost:3000
  ```

---

## 5. **Testing**

- **Automated Tests:**

  - Use Jest + Supertest for backend API testing.
  - Example test for `/api/hello` is provided in `/tests/api.test.js`.

- **Manual Testing:**
  - Use Postman or browser to test endpoints like `/api/hello`, `/api/products`, etc.

---

## 6. **Production Readiness**

- **Static File Serving:**

  - For SPA routing, ensure this is last in your route chain:
    ```js
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });
    ```

- **Security:**

  - Consider using `helmet` for HTTP headers.
  - Sanitize user input in API endpoints.

- **Logging:**

  - Use `morgan` in development, consider more robust logging in production.

- **CORS:**
  - Set `CORS_ORIGIN` to your production frontend domain when deploying.

---

## 7. **Deployment**

- **Dependencies:**

  - Ensure all dependencies are listed in `package.json`.
  - Use `npm install --production` on your server.

- **Start Script:**

  - `"start": "node server.js"` in `package.json`.

- **Environment Variables:**
  - Set all required variables on your host (Heroku, Render, etc).

---

## 8. **Frontend Enhancements (Optional)**

- **Dynamic Product Loading:**

  - Replace static product cards with JS that fetches from `/api/products`.

- **Cart/Order Functionality:**

  - Ensure cart and order buttons trigger API calls and update UI accordingly.

- **Authentication:**
  - Implement login/register modals and connect to `/api/auth`.

---

## 9. **Common Issues to Check**

- Broken asset links (CSS/JS/images not loading).
- API requests failing due to wrong URLs or CORS.
- MongoDB connection errors.
- Unhandled promise rejections or uncaught exceptions.
- Missing or misconfigured `.env` file.

---

## 10. **Final Checklist**

- [ ] All static assets load in browser.
- [ ] All API endpoints respond as expected.
- [ ] Database connects without errors.
- [ ] Cart, order, and auth flows work end-to-end.
- [ ] App runs with `npm start` and is ready for deployment.

---

**If you want code samples for any of the above (e.g., dynamic product loading, placeholder image endpoint, etc.), just ask!**
