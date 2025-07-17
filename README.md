# 📝 Task Management App

A simple and modern task management frontend built with **Vue 3**, **Vite**, and **Bootstrap**. This app allows users to register, log in, view tasks, update task statuses, and review task history.

## 🚀 Features

- User registration and login
- Token-based authentication
- View all tasks in a list
- View detailed task information
- Update task status
- View task status history
- Responsive design using Bootstrap

## 🛠 Tech Stack

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Vue Router](https://router.vuejs.org/)

## 📁 Project Structure

```
src/
├── components/        # Reusable Vue components
├── views/             # Route-level views (Login, Register, Tasks)
├── router/            # Vue Router setup
├── assets/            # Static assets
├── App.vue            # Root component
└── main.js            # Entry point
```

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/task-app.git
cd task-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Build for production**

```bash
npm run build
```

## 🔐 Environment Variables

Create a `.env` file in the root directory for API endpoints:

```env
VITE_API_BASE_URL=https://your-api-url.com/api
```

Update the API service or fetch calls to use `import.meta.env.VITE_API_BASE_URL`.


## ✅ Todos

- [x] Auth views (login/register)
- [x] Task list and detail views
- [x] Update task status
- [x] View task status history
- [ ] Global error handling
- [ ] Add user feedback/loading indicators
- [ ] Responsive polish

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ using Vue 3 + Vite
