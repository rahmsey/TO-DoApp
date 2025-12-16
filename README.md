#  React Native To-Do App  
A clean, responsive, and fully functional task manager built with **React Native**, **Expo Router**, and **TypeScript**.  
The application includes task creation, editing states, sorting, dark/light theme support, and a demo implementation of voice-powered task input.

---

##  **Features**

###  Task Management  
- Add new tasks with optional due dates  
- Mark tasks as **complete / incomplete**  
- Delete tasks  
- Tasks automatically grouped into **Pending** and **Completed** sections  
- Smooth animated transitions using `LayoutAnimation`  

###  Sorting & Search  
- Sort tasks by:
  - **Due date**
  - **Title**
  - **Completion status**
- Real-time search bar filters tasks as you type  

###  Light & Dark Mode Support  
The UI automatically adapts based on device settings.  
Both modes are fully styled with consistent spacing, shadows, and typography.

---

##  **Screenshots**

###  **Light Mode**
![Light Mode](https://github.com/rahmsey/TO-DoApp/blob/main/white.jpg)

###  **Dark Mode**
![Dark Mode](https://github.com/rahmsey/TO-DoApp/blob/main/black.jpg)



---

## 🎤 Voice Input (Demo Mode)

The app includes a **Voice Input feature** accessible on the Add Task page.

### 🔎 Why is it in demo mode?
OpenAI Whisper requires **paid billing**, and the quota was exceeded during development.

So in the submitted version:
- The UI and animation are fully implemented  
- A clean popup explains the feature  
- No recording or API call is executed  

### 🧠 Intended Functionality (If Enabled)
Once billing is active, the button would:
- Record audio through `expo-av`
- Send audio to OpenAI Whisper
- Convert speech → text  
- Automatically split multiple tasks (example:  
  > “Pick up groceries and call mum”  
  becomes two tasks)

---

## 🧭 Navigation  
The project uses **React Navigation via Expo Router**, with only two core screens:

1. **Task List Screen** (Home)
2. **Add Task Screen**

The (+) button on the bottom-right of the Task List redirects directly to the Add Task form.

---

## 📂 **Project Structure**
todo-app/
│── app/
│   ├── tasks/
│   │   ├── index.tsx
│   │   ├── add.tsx
│   │   ├── _layout.tsx
│   ├── index.tsx
│
├── src/
│   ├── storage/
│   │   ├── taskStorage.ts
│   ├── constants/
│   │   ├── colors.ts
│   ├── types/
│       ├── Task.ts
│
├── assets/
│   └── images/
│
├── .env   (ignored in repo)
├── package.json
├── README.md


---

##  **Tech Stack**

- **React Native**
- **Expo Router**
- **TypeScript**
- **AsyncStorage (data persistence)**
- **expo-av** (voice input)
- **expo-community-datetimepicker**
- **LayoutAnimation** (smooth transitions)

---

##  Running the Project

### 1️ Install Dependencies
```bash
npm install
npx expo start
```

### 2️ Run on a Device or Simulator
Scan the QR code that appears after running:
####  Using Expo Go (Android / iOS)


## 🔗 Live Preview (Expo)

The application is published using **Expo EAS Update**, which enables instant over-the-air updates and easy previewing without requiring a full app store build.

👉 **Preview the app:**  
https://expo.dev/accounts/nn1bu/projects/todo-app/updates/4f7ec9a4-766d-4b28-8c5f-2750c8ca7e98

**Instructions**
- Open the link on a physical device and click preview 
- Launch with **Expo Go**
- The latest version of the app will load automatically







