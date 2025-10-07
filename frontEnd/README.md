# 🧑‍💼 Employee | Task Management System

A **React Native** mobile application for managing employees and their assigned tasks efficiently.  
This system allows administrators and employees to view, assign, update, and track tasks in real time.

---

## 🚀 Features

- 👤 User Authentication (Login/Logout)  
- 🧾 Employee Profile Management  
- 📋 Task Assignment and Tracking  
- 🔔 Status Updates (Pending, In Progress, Completed)  
- 🕒 Synchronization with Backend (via API)  
- 📱 Responsive and Clean UI for Android & iOS  

---

## 🧩 Requirements

Make sure you have the following installed before proceeding:

- [Node.js](https://nodejs.org/) (v16 or above)  
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)  
- [Android Studio](https://developer.android.com/studio) or [Xcode](https://developer.apple.com/xcode/)  
- React Native CLI environment setup ([Guide Here](https://reactnative.dev/docs/environment-setup))

---

## ⚙️ Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/qais001-pr/Employee-Task-Management-System.git
cd Employee-Task-Management-System
```

### Step 2: Install Dependencies

Navigate to the front-end folder and install all packages:

```bash
cd frontEnd
npm install
# OR
yarn install
```

---

## ▶️ Running the Application

### Step 1: Start Metro Bundler

```bash
npm start
# OR
yarn start
```

### Step 2: Run on Android

```bash
npm run android
# OR
yarn android
```

### Step 3: Run on iOS (Mac only)

Make sure CocoaPods is installed:

```bash
cd ios
pod install
cd ..
npm run ios
# OR
yarn ios
```

---

## 🧠 How It Works

1. **Admin Login:** Admins can log in and manage employee records.  
2. **Employee Login:** Employees can view assigned tasks and update their progress.  
3. **Task Management:** Tasks can be created, updated, or marked as completed.  
4. **Status Sync:** All updates are reflected instantly across connected devices.

---

## 🧰 Project Structure

```
frontEnd/
│── context/
├── src/
│   ├── screens/
|     |____Admin
|     |____Mock
|     |____Employee
|     |____Auth
|     ├── navigation
|___config.js
├── App.js
├── package.json
└── README.md
```

---

## 🪲 Troubleshooting

If you face any issues:
- Ensure Metro is running before launching the app.
- Clear the React Native cache:
  ```bash
  npm start -- --reset-cache
  ```
- If Android build fails, try:
  ```bash
  cd android
  ./gradlew clean
  cd ..
  npm run android
  ```

For more help, visit the [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting).

---

## 📚 Learn More

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Axios](https://axios-http.com/docs/intro)
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

---

## 🏁 Conclusion

You’ve successfully set up and run the **Employee | Task Management System** app.  
Now start managing employees and their tasks efficiently! 🎯
