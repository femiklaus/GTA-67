# GTA 67

A browser-based GTA-inspired arcade car driving game built with Next.js and React for the Unlayer React Editor Challenge.

## Live Demo

**Live:** `https://gta-67-miami-drive.vercel.app`

## About the Project

GTA 67 is a GTA-inspired browser driving game built around a simple arcade driving loop. The goal is to drive as far as possible, avoid obstacles, collect coins, and achieve a high score.

The game was built by **Oluwafemi and Shola Emmanuel** for the Unlayer React Editor Challenge. A key part of the project is the integration of the **Unlayer React Image Editor**, which is used as part of the character/avatar experience before entering the game.

## Features

- GTA-inspired arcade driving experience
- Browser-based gameplay
- Unlayer React Image Editor integration
- Character/avatar image customization
- Two-lane road system
- Keyboard controls
- Increasing obstacle complexity
- Coin collection
- Score tracking
- Live leaderboard
- Player ranking
- Dashboard
- Pause and resume gameplay
- Responsive interface
- Full-screen game experience
- 3D game environment with cars, buildings, trees, and other roadside objects

## Unlayer React Image Editor

The **Unlayer React Image Editor** is a core part of the project.

Players can use the image editor to customize their character/avatar image before playing. The edited image is then used as part of the player's game experience.

This integration was included specifically for the **Unlayer React Editor Challenge**.

## Gameplay

GTA 67 uses a simple arcade-style driving system. Players drive along a repeating road, avoid obstacles, collect coins, and try to achieve the highest score possible.

The road becomes more challenging as the player progresses. Obstacles become more complex and coins become less frequent.



## Live Leaderboard

The game includes a live leaderboard where players can see their score and ranking against other players. The landing page also displays the current top scores.

## Dashboard

The project includes a dashboard for the player's game experience. The paused game state allows the player to resume the current game or view the dashboard without restarting the run.



## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Three.js**
- **GSAP**
- **Unlayer React Image Editor**
- **MongoDB**

Next.js powers the application and React interface. Three.js is used for the 3D game environment and assets. GSAP is used for animation and motion where required. MongoDB is used for leaderboard and score data.

## Project Structure

The project is organized around the Next.js application and the game/configuration code.



##  Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git

Check your installed versions:

```bash
node -v
npm -v
git --version
```

### Installation

Clone the repository:

```bash
git clone https://github.com/femiklaus/GTA-67
```

Move into the project directory:

```bash
cd GTA-67
```

Install the dependencies:

```bash
npm install
```

###  Environment Variables

If the project requires environment variables, create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add the required environment variables to the file.

For example:

```env
MONGODB_URI=your_mongodb_connection_string
```

Do not commit `.env.local` or any private credentials to the repository.

###  Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

##  Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

##  Development

During development, test:

- Movement
- Obstacle collisions
- Coin collection
- Scoring
- Pause/resume
- Leaderboard submission
- Avatar/image editor flow
- Different screen sizes

## Responsive Design

The game is designed to work across different viewport sizes:

- Desktop
- Laptop
- Tablet
- Mobile

The interface uses the available screen space for a full-screen game experience.

##  Core Game Rules

- Drive along the road and avoid obstacles.
- Collect coins and increase your score.
- The road continues as a repeating loop.
- Difficulty increases as you progress.
- Hitting an obstacle ends the run.
- Scores can be submitted to the live leaderboard.

## Goal

Drive further, avoid crashing, get a higher score, and compete for a higher leaderboard position.

## Contributors

Built by:

- **Oluwafemi**
-  **Shola Emmanuel**

Built for the **Unlayer React Editor Challenge**.


## Links

**Live Game:** `https://gta-67-miami-drive.vercel.app`


