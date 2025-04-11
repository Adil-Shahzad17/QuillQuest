# Quill Quest ✍️

![JavaScript](https://img.shields.io/badge/-JavaScript-333333?style=flat&logo=javascript)
![React](https://img.shields.io/badge/-React-333333?style=flat&logo=react)
[![Appwrite](https://img.shields.io/badge/appwrite-black?logo=appwrite&logoColor=FD366E)](https://appwrite.io)
![React](https://img.shields.io/badge/-TanStack%20Query-F16E29?style=flat&logo=react)

QuillQuest is a blogging platform that makes it easy for writers to create, manage, and publish their posts. It allows users to add, view, update, and delete content easily. The platform is powered by Appwrite, which handles the backend services, providing all the tools needed to run the app.

---

### **Project Access** ✅

The Project is **Live** at: **[Quill Quest](https://quill-quest-tau.vercel.app/)**

---

## **Features** 🚀

- **Full CRUD Operations:**

  - Create, edit, and delete blog posts.
  - User Profile Management.

- **Authentication:**
  - Secure login/signup with Appwrite Auth.
  - Sign in using Email OTP ( One Time Password ).
  - User profile management.
- ## **Key Features🔑**

  - **Search Functionality with Category Filters:**

    - Allow users to search and filter content based on post categories.

  - **Ifinite Pagination Scroll:**

    - Users can manually load additional content by clicking the "Load More" button, ensuring a smooth browsing experience.

  - **User Profile Interface:**

    - A user profile page where users can view and edit their personal information and preferences.

  - **Public User Profiles:**
    - A public-facing profile view, enabling users to visit and explore other users' profiles, similar to platforms like Instagram or Facebook.

- **UI/UX:**
  - Responsive design.
  - Clean and Simple interface.

---

## **Technologies Used** 💻

**1**. **Frontend:** 🖼️

- React.js + Vite
- Tailwind CSS
- React Router, Redux Toolkit
- Tanstack
- Shadcn

**2**. **Backend Services:** ⚙️

Appwrite (Backend-as-a-Service)

- Authentication
- Database
- Storage

---

## 🛠️ **Getting Started**

### Prerequisites

- React.js version 19.0.0
- Tailwind version 3.4.17
- Appwrite account (free tier sufficient)

## ⚙️ **Installation**

**1**. **Clone the repository:**

```bash
git clone https://github.com/Adil-Shahzad17/QuillQuest.git
cd QuillQuest
```

**2**. **Install dependencies:** 📥

```bash
npm install
```

Visit the **_package.json_** file to view other dependencies used in this project.

**3**. **Appwrite Setup:** 🧰

- Create a new Appwrite project.
- Set up Authentication.
- Enable Email/Password & Email OTP.

**A**. **Create Database:** 🛢️

Create 2 collections with respective attributes:

| POST_COLLECTION | USER_COLLECTION |
| --------------- | --------------- |
| user_Id         | user_name       |
| title           | user_image      |
| headline        | user_bio        |
| post_image      |                 |
| category        |                 |
| content         |                 |

**B**. **Create Storage with 2 bucket's to store images:** 🌆

Create 2 bucket's for storing images:

- POST_BUCKET
- USER-BUCKET

Allow JPG, PNG, and JPEG as **Allowed File Extensions** in each bucket settings.

---

### 🚨📢 **Note** :

Remember to set **Permission**. Allow **_Role: Any_** to only read, and **_Role: All Users_** to create, read, update, and delete in both **collection** and **bucket** settings.

---

**4**. **Configure Environment Variables:** </>

- Create a .env file in the root directory:

```
VITE_APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID = project_id
VVITE_APPWRITE_DATABASE = database_id
VITE_APPWRITE_COLLECTION_POST = collection_post_id
VITE_APPWRITE_COLLECTION_USER = collection_user_id
VITE_APPWRITE_BUCKET_POST = bucket_post_id
VITE_APPWRITE_BUCKET_USER = bucket_user_id
```

---

**5**. **Run the development server:** ⚡

After installing all the dependencies successfully and configurations, it's time to run the project.

```bash
npm run dev
```

---

### 🤝 **Contributing:**

Contributions are **welcome!**
Please follow these steps:

- Fork the project.
- Create your feature branch `git checkout -b feature/AmazingFeature`
- Commit your changes `git commit -m "Add some AmazingFeature"`
- Push to the branch `git push origin feature/AmazingFeature`
- Open a Pull Request.

Please follow the **code of conduct**.

---

### 🙏 **Acknowledgements**

- React community for excellent documentation and support.
- Appwrite team for the fantastic BaaS platform.
- The TanStack team for creating a powerful tool.

---
