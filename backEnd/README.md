# 🧠 **Employee Task Management System – Backend**

A complete backend system built using **Node.js**, **Express.js**, and **MSSQL**, designed to manage employees, projects, tasks, with **JWT-based authentication** and **role-based access control**.

---

## 🚀 **Tech Stack**

| Layer | Technology |
|-------|-------------|
| Backend Framework | Node.js + Express.js |
| Database | Microsoft SQL Server |
| ORM / Query | mssql package |
| Authentication | JWT (JSON Web Token) |
| API Testing | Postman |
| Password Encryption | bcryptjs |

---

## 📂 **Project Structure**

```
EmployeeTaskBackend/
│
├── controller/
│   ├── authController.js
│   ├── employeeController.js
│   ├── projectController.js
│   ├── taskController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── employeeRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│
├──── connectionDb.js
│  
├── server.js
├── package.json
└── .env
```

---

## ⚙️ **Installation & Setup**

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/qais001-pr/Employee-Task-Management-System.git
cd backEnd
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Configure Environment Variables**

Create a `.env` file in the root directory:

```env
PORT=5000
DB_USER=your_sql_username
DB_PASSWORD=your_sql_password
DB_SERVER=localhost
DB_DATABASE=EmployeeTaskDatabase
JWT_SECRET=your_secret_key
```

### **4️⃣ Run the Server**

#### Production Mode:
```bash
npm start
```

Server will run at:
```
http://localhost:5000
```

---

## 🗃️ **Database Setup**
Use the txt file to run the queries from it on sql to create a database and tables 
[EmployeeTaskDb Txt File](https://github.com/qais001-pr/Employee-Task-Management-System/blob/main/backEnd/data/tableCreationQueries.txt)

---

## 🔐 **Authentication Endpoints**

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Register a new employee |
| POST | `/api/auth/login` | Employee login (returns JWT) |

**Login Response Example:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "role": "Admin"
  }
}
```

---

## 👩‍💼 **Employee Routes**

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get employee by ID |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| POST | `/api/employees/login` | Login Employee |

---


## 🏗️ **Project Routes**

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects/:id` | Get project by ID |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

---

## 🧾 **Task Routes**

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/filter/employee/:id` | Filter Tasks By Employee |
| GET | `/api/tasks/filter/project/:id` | Filter Tasks By Project |
| GET | `/api/tasks/filter/status/Completed` | Filter Tasks By Status |

---


## 🧪 **Postman Testing Guide**

### **1️⃣ Base URL**
```
http://localhost:5000/api
```

### **2️⃣ Example Test Flow**
(Full workflow for Register, Login, Create Dept, Project, Task, Comment, Timesheet)

---

## 🧱 **Error Handling**

Common responses:
```json
{
  "success": false,
  "message": "Employee not found"
}
```
or
```json
{
  "success": true,
  "data": [...]
}
```

---

## 🧤 **Security Features**

- Passwords hashed using **bcrypt**
- JWT token verification middleware
- Role-based access control (RBAC)
- SQL Injection prevention using parameterized queries

---
