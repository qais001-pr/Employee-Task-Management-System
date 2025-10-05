# 🧠 **Employee Task Management System – Backend**

A complete backend system built using **Node.js**, **Express.js**, and **MSSQL**, designed to manage employees, projects, tasks, timesheets, and comments — all with **JWT-based authentication** and **role-based access control**.

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
│   ├── departmentController.js
│   ├── projectController.js
│   ├── taskController.js
│   ├── taskTrackingController.js
│   ├── timesheetController.js
│   ├── commentController.js
│   └── roleController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── employeeRoutes.js
│   ├── departmentRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   ├── taskTrackingRoutes.js
│   ├── timesheetRoutes.js
│   ├── commentRoutes.js
│   └── roleRoutes.js
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
DB_DATABASE=EmployeeTaskDB
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
Works

Run the provided SQL script [EmployeeTaskDB.sql](https://github.com/qais001-pr/Employee-Task-Management-System/blob/main/backEnd/data/EmployeeTaskDb.sql) in **SQL Server Management Studio**  to create all required tables.

OR

use the txt file to run the queries from it on sql to create a database and tables 
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

## 🧭 **Department Routes**

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/departments` | Get all departments |
| GET | `/api/departments/:id` | Get department by ID |
| POST | `/api/departments` | Add department |
| PUT | `/api/departments/:id` | Update department |
| DELETE | `/api/departments/:id` | Delete department |

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

## 📈 **Task Tracking Routes**

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/tracking` | Get all task |
| GET | `/api/tracking/task/:id` | Get Tracking By Task ID |
| POST | `/api/tracking` | Create new task tracking |
| DELETE | `/api/tracking/:id` | Delete Task Tracking |

---

## 🕒 **Timesheet Routes**

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/timesheets` | Get all timesheets |
| GET | `/api/timesheets/:id` | Get timesheet by ID |
| POST | `/api/timesheets` | Log new timesheet |
| PUT | `/api/timesheets/:id` | Update timesheet |
| DELETE | `/api/timesheets/:id` | Delete timesheet |
| GET | `/api/timesheets/employee/:id` | TimeSheet By Employee Id |

---

## 💬 **Comment Routes**

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/comments/:taskId` | Get comments for a task |
| POST | `/api/comments` | Add new comment |
| GET | `/api/comments/task/:id` | GET comments by Task ID |
| GET | `/api/comments/employee/:id` | GET comments by Employee ID |
| PUT | `/api/comments/:id` | Update Task |
| DELETE | `/api/comments/:id` | Delete comment |

---

## 🧩 **Role Routes**

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/roles/` | Get all roles |
| POST | `/api/roles` | Create new role |
| GET | `/api/roles/1` | Get Role By Id |
| PUT | `/api/roles/1` | Update roles |
| DELETE | `/api/roles/4` | Delete roles |
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
