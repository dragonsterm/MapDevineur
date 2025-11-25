<div align="center">

# 🌍 MapDevineur

### Next-Gen Geography Game Experience

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<p align="center">
  <i>Challenge your geography knowledge with stunning Street View locations from around the world</i>
</p>

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation) • [Contributors](#-contributors)

</div>

---

## 📖 About

**MapDevineur** is a modern GeoGuesser-inspired web application that challenges players to identify locations based on Google Street View imagery. Built with cutting-edge technologies, it offers an immersive gaming experience with real-time scoring, global leaderboards, and comprehensive user profiles.

### 🎯 Key Highlights

- 🗺️ **5-Round Game Sessions** - Test your skills across multiple challenging locations
- ⏱️ **1-Minute Timer** - Race against time for bonus points
- 🏆 **Global Leaderboard** - Compete with players worldwide
- 👤 **User Profiles** - Track your progress and customize your avatar
- 🎨 **Modern UI/UX** - Built with Tailwind CSS for a polished experience
- 🔒 **Secure Authentication** - Laravel Sanctum-powered session management

---

## ✨ Features

### 🎮 Core Gameplay
- Interactive Google Street View integration
- Distance-based scoring algorithm
- Time bonus calculations
- 25+ pre-selected worldwide locations
- Real-time round results

### 👥 User Management
- Secure registration and login
- Profile customization with avatars
- Password reset functionality
- Session persistence

### 🏅 Leaderboard System
- Global rankings
- Personal best scores
- User profile links
- Real-time updates

### 📚 Documentation
- Comprehensive FAQ
- Interactive tutorials
- Game mechanics guide

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.1.1 + Vite 7.1.7
- **Styling:** Tailwind CSS 4.1.17
- **Routing:** React Router DOM 7.9.5
- **HTTP Client:** Axios 1.13.2
- **Maps:** Google Maps JavaScript API

### Backend
- **Framework:** Laravel 12.0
- **Authentication:** Laravel Sanctum 4.0
- **Database:** MySQL/PostgreSQL
- **API:** RESTful Architecture

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **PHP** (v8.1 or higher)
- **Composer** (PHP package manager)
- **MySQL** or **PostgreSQL**
- **Google Maps API Key** ([Get one here](https://developers.google.com/maps/documentation/javascript/get-api-key))

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/dragonsterm/MapDevineur.git
cd MapDevineur
```

### 2️⃣ Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
composer install
```

#### Environment Configuration
Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
APP_NAME=MapDevineur
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mapdevineur
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=
SESSION_SECURE_COOKIE=false
SESSION_SAME_SITE=lax

FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173

GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

#### Generate Application Key
```bash
php artisan key:generate
```

#### Run Migrations
```bash
php artisan migrate
```

#### Seed Database
```bash
php artisan db:seed --class=LocationSeeder
```

#### Start Laravel Server
```bash
php artisan serve
```

The backend will run at `http://localhost:8000`

---

### 3️⃣ Frontend Setup

Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Update the `.env` file:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_BASE_URL=http://localhost:8000
```

#### Start Development Server
```bash
npm run dev
```

The frontend will run at `http://localhost:5173`

---

## 🎮 Usage

1. **Open your browser** and navigate to `http://localhost:5173`
2. **Register** a new account or **Login** if you already have one
3. **Create your profile** with a display name, country, and avatar
4. **Click "Play Now"** to start a new game
5. **Explore** the Street View location and make your guess on the map
6. **Submit** your guess before time runs out
7. **Complete** all 5 rounds to see your final score
8. **Check** the leaderboard to see how you rank globally!

---

## 📁 Project Structure

```
MapDevineur/
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API & utility services
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   └── styles/          # CSS and styling files
│   ├── public/              # Static assets
│   └── package.json
│
└── backend/                 # Laravel Backend
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/ # API controllers
    │   │   └── Middleware/  # Custom middleware
    │   └── Models/          # Eloquent models
    ├── database/
    │   ├── migrations/      # Database migrations
    │   └── seeders/         # Database seeders
    ├── routes/
    │   ├── api.php          # API routes
    │   └── web.php          # Web routes
    └── composer.json
```

---

## 🗺️ API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user

### Game
- `GET /api/locations/random` - Get random locations
- `POST /api/games` - Create new game session
- `POST /api/games/{id}/rounds` - Submit round guess
- `POST /api/games/{id}/complete` - Complete game

### Leaderboard
- `GET /api/leaderboard` - Get top scores
- `GET /api/leaderboard/user/{id}` - Get user scores

### Profile
- `GET /api/game-profile` - Get current user profile
- `POST /api/game-profile` - Create profile
- `PUT /api/game-profile` - Update profile
- `DELETE /api/game-profile` - Delete account

---

## 🎨 Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `password` - Hashed password
- `timestamps`

### Locations Table
- `id` - Primary key
- `name` - Location name
- `latitude` - Decimal(10,8)
- `longitude` - Decimal(11,8)
- `country` - Country name
- `difficulty` - Enum(easy/medium/hard)
- `timestamps`

### Games Table
- `id` - Primary key
- `user_id` - Foreign key → users.id
- `total_score` - Integer
- `completed_at` - Timestamp
- `timestamps`

### Game Rounds Table
- `id` - Primary key
- `game_id` - Foreign key → games.id
- `location_id` - Foreign key → locations.id
- `round_number` - Integer(1-5)
- `guess_latitude` - Decimal
- `guess_longitude` - Decimal
- `distance` - Decimal (km)
- `time_taken` - Integer (seconds)
- `round_score` - Integer
- `timestamps`

### Scores Table
- `id` - Primary key
- `user_id` - Foreign key → users.id
- `game_id` - Foreign key → games.id
- `score` - Integer
- `timestamps`

### Game Profiles Table
- `id` - Primary key
- `user_id` - Foreign key → users.id
- `display_name` - String
- `country` - String
- `gender` - Enum(male/female/not specify)
- `bio` - Text (nullable)
- `date_of_birth` - Date (nullable)
- `avatar` - String
- `timestamps`

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
php artisan test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
If port 8000 or 5173 is already in use:
```bash
# Backend - use different port
php artisan serve --port=8001

# Frontend - update vite.config.js port
```

#### Database Connection Error
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `mapdevineur` exists

#### Google Maps Not Loading
- Verify your API key is valid
- Enable required APIs in Google Cloud Console:
  - Maps JavaScript API
  - Street View Static API
  - Places API

#### CORS Issues
- Ensure `SANCTUM_STATEFUL_DOMAINS` includes `localhost:5173`
- Check `config/cors.php` settings

---

## 📚 Documentation

For detailed documentation, visit:
- [How to Play Guide](http://localhost:5173/docs)
- [FAQ Section](http://localhost:5173/docs#faq)
- [API Reference](IMPORTANTREAD.md)

---

## 🎓 Academic Information

**Course:** Praktikum Pemrograman Web IF-G
**Institution:** Universitas Pembangunan Nasional "Veteran" Yogyakarta
**Academic Year:** 2024/2025

### 📝 Assignment Details
This project was developed as a practical assignment to demonstrate:
- Full-stack web development skills
- Modern JavaScript framework implementation
- RESTful API design and integration
- Database management and optimization
- User authentication and authorization
- Responsive UI/UX design principles

---

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/identicons/dragonsterm.png" width="100px;" alt="Jauza Ilham"/>
      <br />
      <sub><b>Jauza Ilham Mahardika Putra</b></sub>
      <br />
      <sub>Full-Stack Developer</sub>
    </td>
    <td align="center">
      <img src="https://github.com/identicons/dimas.png" width="100px;" alt="Dimas Hafid"/>
      <br />
      <sub><b>Dimas Hafid Fathoni</b></sub>
      <br />
      <sub>Full-Stack Developer</sub>
    </td>
  </tr>
</table>

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Maps Platform** - For providing Street View and Maps APIs
- **Laravel Community** - For the excellent PHP framework
- **React Team** - For the powerful UI library
- **Tailwind CSS** - For the utility-first CSS framework
- **UPN "Veteran" Yogyakarta** - For the opportunity to build this project

---

## 🔗 Links

- **GitHub Repository:** [https://github.com/dragonsterm/MapDevineur](https://github.com/dragonsterm/MapDevineur)
- **Live Demo:** Coming Soon
- **Documentation:** [IMPORTANTREAD.md](IMPORTANTREAD.md)

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Documentation](#-documentation)
3. Open an issue on GitHub
4. Contact the development team

---

<div align="center">

### 🌟 If you find this project useful, please give it a star!

Made with ❤️ by Jauza Ilham & Dimas Hafid

**© 2025 MapDevineur Project. All Rights Reserved.**

</div>
