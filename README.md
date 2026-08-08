# 🌾 AgroNex - Empowering the Future of Farming with AI

A comprehensive, AI-driven agricultural platform designed to revolutionize farming practices. By leveraging cutting-edge machine learning and computer vision, AgroNex provides farmers and agricultural enthusiasts with actionable insights to maximize yield, detect diseases early, and adapt to shifting weather patterns.


### ✨ Features
---

- **Crop Recommendation AI:** Intelligently recommends the best crops to plant based on soil metrics and environmental factors using advanced machine learning models
- **Plant Disease Detection:** Upload an image of a plant leaf, and our advanced computer vision model will instantly identify potential diseases and suggest remedies
- **Weather & Yield Forecasting:** Utilizes historical data for time-series forecasting, helping you anticipate weather changes and predict crop yields
- **Interactive Dashboards:** Beautiful, dynamic data visualizations built for an engaging user experience
- **Secure Authentication:** JWT-based secure user authentication and session management

### 🚀 How to Use
---

#### Getting Started

1. **Clone the Repository**
   - Open your terminal and run `git clone https://github.com/yourusername/AgroNex.git`
   - Navigate into the directory with `cd AgroNex`

2. **Backend Setup**
   - Create a virtual environment: `python -m venv venv`
   - Activate it (`venv\Scripts\activate` on Windows, `source venv/bin/activate` on macOS/Linux)
   - Install dependencies: `pip install -r requirements.txt`
   - Start the server: `cd backend` then `python manage.py runserver`

3. **Frontend Setup**
   - Open a new terminal and navigate to the frontend folder: `cd frontend`
   - Install node modules: `npm install`
   - Start the Vite development server: `npm run dev`

4. **Access the Platform**
   - Open your browser and navigate to the frontend URL (usually `http://localhost:5173`)
   - The backend API will be running on `http://127.0.0.1:8000`

### 📝 Requirements
---

- [Node.js](https://nodejs.org/) (v18 or higher) for the frontend
- [Python](https://www.python.org/) (v3.10 or higher) for the backend
- [MongoDB](https://www.mongodb.com/) (Running locally or a MongoDB Atlas cluster)

### 🛠️ Setup
---

#### Using Python Virtual Environment (Backend)

```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run server
cd backend
python manage.py runserver
```

#### Using NPM/Vite (Frontend)

```bash
# Navigate to frontend and install
cd frontend
npm install

# Run the development server
npm run dev
```

### 📁 Project Structure
---

```text
AgroNex/
├── backend/               # Django Backend Application
│   ├── api/               # Core business logic & AI models
│   ├── core/              # Django project settings
|   ├── schemes/           # Background tasks & schemes
│   ├── requirements.txt   # Backend dependencies
│   └── manage.py          # Django entry point
├── frontend/              # React + Vite Frontend Application
│   ├── src/               # React components and pages
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind styling rules
├── requirements.txt       # Python dependencies
└── README.md              # This file
```

### ⚙️ Technical Details
---

- **Frontend Framework:** `React 19` + `Vite` with `Tailwind CSS` and `Framer Motion` for styling and animations
- **Data Visualization:** `Chart.js` & `React-Chartjs-2` for interactive charts
- **Backend Framework:** `Django 5` & `Django REST Framework` for building robust APIs
- **Database:** `MongoDB` integrated via `PyMongo`
- **AI & Machine Learning:** `Scikit-Learn`, `Prophet`, `Pandas`, and `NumPy` for intelligent data processing and predictions

### 🔧 Customization
---

To configure your environment variables:

1. Create a `.env` file in the root backend directory
2. Add your required secret keys and MongoDB connection URI:

```text
MONGODB_URI="mongodb+srv://your-cluster-url"
SECRET_KEY="your-django-secret-key"
```

### 📄 Notes
---

- Ensure your MongoDB instance is running before starting the backend server to avoid connection timeouts
- API requests from the frontend are typically routed to `localhost:8000` during development

### 📄 License
---

This project is open source and available for personal and educational use.

### 🤝 Contributing
---

Feel free to fork this project and submit pull requests for any improvements!

Enjoy farming with AI! 🌾
