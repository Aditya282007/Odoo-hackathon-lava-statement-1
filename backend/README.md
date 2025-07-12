# SkillSync Backend API

A comprehensive Node.js backend for a skill-sharing collaboration platform built with Express.js, MongoDB, and TypeScript.

## 🚀 Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **User Management**: Profile management with skill-based search
- **Collaboration Requests**: Send, accept, reject collaboration requests
- **Real-time Chat**: Message system between accepted collaborators
- **XP & Badge System**: Gamification with experience points and badges
- **Reporting System**: User reporting with admin moderation
- **Admin Panel**: User management and report handling

## 📦 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcrypt, helmet, CORS, rate limiting
- **Validation**: Custom middleware validation

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env` and update the values:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/skillsync
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   ```

3. **Start MongoDB**:
   Make sure MongoDB is running on your system.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### User Endpoints

#### GET /api/user/me
Get current user profile (requires authentication).

#### PUT /api/user/me
Update user profile (requires authentication).

**Request Body**:
```json
{
  "name": "John Doe",
  "skills": ["React", "Node.js"],
  "bio": "Full-stack developer",
  "isPublic": true
}
```

#### GET /api/user/search?skills=react,nodejs
Search users by skills (requires authentication).

### Collaboration Request Endpoints

#### POST /api/request/:toUserId
Send collaboration request (requires authentication).

#### GET /api/request/received
Get received requests (requires authentication).

#### GET /api/request/sent
Get sent requests (requires authentication).

#### POST /api/request/:requestId/accept
Accept collaboration request (requires authentication).

#### POST /api/request/:requestId/reject
Reject collaboration request (requires authentication).

### Chat Endpoints

#### POST /api/chat/:userId
Send message to user (requires authentication and accepted collaboration).

**Request Body**:
```json
{
  "message": "Hello! Let's start working on our project."
}
```

#### GET /api/chat/:userId
Get chat history with user (requires authentication and accepted collaboration).

### Report Endpoints

#### POST /api/report/:reportedUserId
Report a user (requires authentication).

**Request Body**:
```json
{
  "reason": "Inappropriate behavior",
  "message": "User was being disrespectful during our collaboration."
}
```

### Admin Endpoints (Admin access required)

#### GET /api/admin/users
Get all users.

#### GET /api/admin/reports
Get all reports.

#### PUT /api/admin/user/:id/block
Block a user.

#### PUT /api/admin/user/:id/unblock
Unblock a user.

## 🏗️ Database Schema

### User Model
```typescript
{
  name: string;
  email: string;
  phone: string;
  password: string;
  photo?: string;
  skills: string[];
  bio?: string;
  isPublic: boolean;
  xp: number;
  badge: string;
  isBlocked: boolean;
}
```

### Request Model
```typescript
{
  from: ObjectId;
  to: ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
}
```

### Chat Model
```typescript
{
  from: ObjectId;
  to: ObjectId;
  message: string;
  timestamp: Date;
}
```

### Report Model
```typescript
{
  fromUser: ObjectId;
  toUser: ObjectId;
  reason: string;
  message: string;
  timestamp: Date;
}
```

## 🎮 XP & Badge System

- **Novice**: 0-100 XP
- **Contributor**: 100-300 XP
- **Mentor**: 300-600 XP
- **Expert**: 600+ XP

Users earn 50 XP when their collaboration request is accepted.

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Admin-only routes protection

## 🚀 Deployment

1. Build the project: `npm run build`
2. Set production environment variables
3. Start the server: `npm start`

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/skillsync` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.