# MapDevineur - Project Documentation

## Summary
MapDevineur is a GeoGuesser-inspired web application that challenges players to identify locations based on Google Street View imagery. Players participate in 5-round game sessions with a 1-minute timer per round, earning points based on guess accuracy and remaining time. The application features user authentication, a global leaderboard system, and comprehensive documentation for users.

**Tech Stack:**
- **Frontend:** React + JavaScript + Vite
- **Backend:** PHP + Laravel
- **Database:** MySQL/PostgreSQL (via Laravel)
- **APIs:** Google Maps JavaScript API, Google Street View API
- **Environment:** Local development (no cloud deployment initially)

## Project Requirements
### Prerequisites
- Node.js (v18 or higher)
- PHP (v8.1 or higher)
- Composer
- MySQL or PostgreSQL
- Google Maps API key

### Functional Requirements
#### Core Gameplay
- 5-round game sessions per playthrough
- 1-minute timer per round
- Google Street View integration for location display
- Interactive map for player guesses
- Distance-based scoring system
- Time bonus calculation
- 25 pre-selected locations in the database
- End-game score summary

#### User Management
- User registration (username + password)
- User login/logout
- Session management
- Password hashing and security

#### Leaderboard System
- Global leaderboard displaying top scores
- Score persistence to database
- User ranking by score
- Display username and score

#### Documentation
- FAQ page
- Tutorial/How-to-Play page
- Clear navigation to documentation

### Non-Functional Requirements
- Responsive design for desktop and mobile
- Fast page load times
- Smooth Street View interaction
- Intuitive UI/UX
- Secure authentication
- Local development environment setup

### Goals
1. Create a fully functional GeoGuesser clone
2. Implement unique, polished UI/UX design
3. Ensure smooth gameplay experience
4. Build secure user authentication system
5. Establish working leaderboard functionality
6. Provide comprehensive user documentation

## To-Do List
### Phase 1: Project Setup & Planning
- [x] Initialize Git repository
- [x] Set up Vite + React project structure
- [ ] Initialize Laravel backend project
- [ ] Configure database connection (MySQL/PostgreSQL)
- [x] Obtain Google Maps API key
- [ ] Configure API key in both frontend and backend
- [ ] Set up environment variables (.env files)
- [ ] Install necessary dependencies (React Router, Axios, etc.)
- [ ] Design database schema
- [ ] Create UI/UX wireframes and mockups

### Phase 2: Database & Backend Setup
- [ ] Create database migrations:
  - Users table
  - Games table
  - Game rounds table
  - Locations table
  - Leaderboard/scores table
- [ ] Seed locations table with 25 locations (coordinates + metadata)
- [ ] Create User model and authentication logic
- [ ] Implement API routes:
  - User registration endpoint
  - User login endpoint
  - User logout endpoint
  - Get random locations endpoint
  - Submit game score endpoint
  - Get leaderboard endpoint
- [ ] Implement authentication middleware
- [ ] Set up CORS configuration
- [ ] Test all API endpoints

### Phase 3: Frontend - Authentication
- [ ] Create landing/home page
- [ ] Design and build registration form
- [ ] Design and build login form
- [ ] Implement form validation
- [ ] Connect registration to backend API
- [ ] Connect login to backend API
- [ ] Implement authentication state management
- [ ] Create protected routes
- [ ] Add logout functionality
- [ ] Handle authentication errors gracefully

### Phase 4: Frontend - Game Logic
- [ ] Create game start screen
- [ ] Design game interface layout
- [ ] Integrate Google Street View component
- [ ] Integrate Google Maps component for guessing
- [ ] Implement round timer (1 minute countdown)
- [ ] Create guess submission functionality
- [ ] Calculate distance between guess and actual location
- [ ] Implement scoring algorithm (distance + time bonus)
- [ ] Display round results
- [ ] Track score across 5 rounds
- [ ] Create end-game summary screen
- [ ] Submit final score to backend

### Phase 5: Frontend - Leaderboard
- [ ] Design leaderboard page
- [ ] Fetch leaderboard data from API
- [ ] Display rankings with usernames and scores
- [ ] Add pagination or limit to top N players
- [ ] Implement real-time or refresh functionality
- [ ] Style leaderboard table/cards

### Phase 6: Frontend - Documentation
- [ ] Create FAQ page
- [ ] Write FAQ content (common questions and answers)
- [ ] Create tutorial/how-to-play page
- [ ] Add gameplay instructions with visuals
- [ ] Create navigation menu with links to documentation
- [ ] Ensure documentation is easily accessible

### Phase 7: UI/UX Polish
- [ ] Design custom color scheme and branding
- [ ] Create consistent component styling
- [ ] Add loading states and spinners
- [ ] Implement error messages and notifications
- [ ] Add animations and transitions
- [ ] Ensure responsive design (mobile, tablet, desktop)
- [ ] Test user flow from registration to gameplay
- [ ] Optimize Street View and Maps performance

### Phase 8: Testing & Debugging
- [ ] Test user registration and login flows
- [ ] Test game session (all 5 rounds)
- [ ] Verify scoring calculations
- [ ] Test leaderboard updates
- [ ] Check API error handling
- [ ] Test on different browsers
- [ ] Test on different screen sizes
- [ ] Fix any bugs or issues found
- [ ] Perform security audit (SQL injection, XSS, etc.)

### Phase 9: Documentation & Final Touches
- [ ] Write README.md for the project
- [ ] Document API endpoints
- [ ] Add code comments where necessary
- [ ] Create setup instructions for local development
- [ ] Prepare demo data for testing
- [ ] Final code cleanup and refactoring


## Project Structure
### Frontend Structure (React + Vite)

```
mapdevineur-frontend/
├── public/
│   └── assets/
│       ├── images/
│       └── icons/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── Game/
│   │   │   ├── StreetView.jsx
│   │   │   ├── GuessMap.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── RoundResult.jsx
│   │   │   └── GameSummary.jsx
│   │   ├── Leaderboard/
│   │   │   └── LeaderboardTable.jsx
│   │   ├── Documentation/
│   │   │   ├── FAQ.jsx
│   │   │   └── Tutorial.jsx
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navigation.jsx
│   │   └── Common/
│   │       ├── Button.jsx
│   │       ├── LoadingSpinner.jsx
│   │       └── ErrorMessage.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Game.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── FAQ.jsx
│   │   └── Tutorial.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── gameService.js
│   │   └── leaderboardService.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useGame.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   ├── scoring.js
│   │   ├── distance.js
│   │   └── validation.js
│   ├── styles/
│   │   ├── global.css
│   │   └── components/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

### Backend Structure (Laravel + PHP)
```
mapdevineur-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── GameController.php
│   │   │   ├── LocationController.php
│   │   │   └── LeaderboardController.php
│   │   ├── Middleware/
│   │   │   └── Authenticate.php
│   │   └── Requests/
│   │       ├── RegisterRequest.php
│   │       ├── LoginRequest.php
│   │       └── ScoreSubmissionRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Game.php
│   │   ├── GameRound.php
│   │   ├── Location.php
│   │   └── Score.php
│   └── Services/
│       ├── GameService.php
│       └── ScoringService.php
├── database/
│   ├── migrations/
│   │   ├── create_users_table.php
│   │   ├── create_locations_table.php
│   │   ├── create_games_table.php
│   │   ├── create_game_rounds_table.php
│   │   └── create_scores_table.php
│   └── seeders/
│       └── LocationSeeder.php
├── routes/
│   ├── api.php
│   └── web.php
├── config/
│   ├── database.php
│   ├── cors.php
│   └── auth.php
├── .env
├── .gitignore
├── composer.json
└── README.md
```

### Database Schema
#### users
- id (primary key)
- username (unique, string)
- password (hashed, string)
- created_at (timestamp)
- updated_at (timestamp)

#### locations
- id (primary key)
- name (string, optional)
- latitude (decimal)
- longitude (decimal)
- country (string, optional)
- difficulty (enum: easy/medium/hard, optional)
- created_at (timestamp)
- updated_at (timestamp)

#### games
- id (primary key)
- user_id (foreign key → users.id)
- total_score (integer)
- completed_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)

#### game_rounds
- id (primary key)
- game_id (foreign key → games.id)
- location_id (foreign key → locations.id)
- round_number (integer, 1-5)
- guess_latitude (decimal)
- guess_longitude (decimal)
- distance (decimal, in km)
- time_taken (integer, in seconds)
- round_score (integer)
- created_at (timestamp)
- updated_at (timestamp)

#### scores (leaderboard)
- id (primary key)
- user_id (foreign key → users.id)
- game_id (foreign key → games.id)
- score (integer)
- created_at (timestamp)


## API Endpoints Reference
### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user info

### Game
- `GET /api/locations/random` - Get 5 random locations for game
- `POST /api/games` - Create new game session
- `POST /api/games/{id}/rounds` - Submit round guess
- `POST /api/games/{id}/complete` - Complete game and submit final score

### Leaderboard
- `GET /api/leaderboard` - Get top scores (paginated)
- `GET /api/leaderboard/user/{id}` - Get user's best scores


## Notes
- **Google Maps API:** Requires both Maps JavaScript API and Street View API to be enabled
- **Scoring Logic:** Score = (base points based on distance) + (time bonus based on remaining seconds)
- **Security:** Implement CSRF protection, input validation, and SQL injection prevention
- **Performance:** Consider caching leaderboard data and optimizing database queries
- **Future Enhancements:** Multiplayer mode, custom map creation, difficulty levels, achievements
