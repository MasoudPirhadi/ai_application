# 🧠 AI Application – Django + OpenAI Based Chat System

A web-based AI chatbot system built with Django that allows users to interact with an AI assistant powered by OpenAI. The project features user authentication, chat history, and a clean, responsive UI.

## 🚀 Features

- 🔐 User Registration & Authentication
- 💬 Real-time Chat Interface with OpenAI integration
- 🧾 Chat History Storage (per-user)
- 📁 Profile Image Upload
- 📄 Template-based HTML (with sidebar, modals, header, footer)
- 🧠 AI Chat logic with OpenAI API
- 🧪 Fully structured Django app with `account_module` and `ai_module`

---

## 🧰 Tech Stack

| Layer        | Tools/Libs                   |
|--------------|------------------------------|
| Backend      | Django 4.x, SQLite3          |
| AI Model     | OpenAI API (GPT Models)      |
| Frontend     | HTML, CSS, JavaScript        |
| Templates    | Django Templating System     |
| Media & Files| File uploads, static files   |

---

## ⚙️ Installation

```bash
git clone https://github.com/MasoudPirhadi/ai_application.git
cd ai_application
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
