# 📅 Calendar App

A role-based calendar application built with **Next.js** that allows registration and login for **teachers** and **students**. Users can add, edit, delete, and filter events with role-based visibility.

---

## 🚀 Features

- **👥 Role-Based Authentication**
  - **Student**: Can view and manage only their own events.
  - **Teacher**: Can create global events visible to all students.

- **📝 Authentication System**
  - Registration and login with role selection (Teacher or Student).

- **📆 Event Management**
  - Create, edit, and delete events.
  - **Student events** are private to the creator.
  - **Teacher events** are public to all students.

- **🔍 Event Filters**
  - **All Events**: View all events accessible to the user.
  - **My Events**: View only events created by the logged-in user.
  - **Global Events**: View events created by teachers.

---

## 🛠 Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL / MySQL (via Prisma ORM)
- **Authentication**: NextAuth.js or custom JWT
- **Deployment**: Vercel / Render / Railway

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/calendar-app.git
cd calendar-app

```

### **2. Install Dependencies**
```sh
npm install
```

### **3. Configure environment variables**
```sh
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

```

### **4. Set up the database (if using Prisma)**
```sh
npx prisma migrate dev --name init
npx prisma generate
```

### **5. Run the Development Server**
```sh
npm run dev
```
Now, open your browser and visit **`http://localhost:3000`** to access the website. 🚀  

## **Screenshots**

**Signup Page**
![image](https://github.com/user-attachments/assets/e2645c0a-ea61-48bc-9b7d-a7ab08ce6d0b)

**Login Page**
![image](https://github.com/user-attachments/assets/8259345e-b2e0-4d20-a4ab-57eb428d1f12)


![image](https://github.com/user-attachments/assets/22dec178-460f-4106-9215-0c34b30eb4a0)

![image](https://github.com/user-attachments/assets/06ddb7b9-9484-416d-905e-4b6d5dbf2ddf)

![image](https://github.com/user-attachments/assets/0d4f0bec-80f6-4f5a-a22f-7df92a9d9039)

![image](https://github.com/user-attachments/assets/a910ffe2-2819-411a-8da8-14caa16d298b)

