# Equipment Reservation System

A complete **Equipment Reservation System** built with **vanilla HTML/CSS** frontend and **Node.js/Express.js** backend with **MySQL database**.

## 🏢 Features

- ✅ **Equipment Management** - Browse, search, and view detailed equipment information
- ✅ **Reservation System** - Create, track, and manage equipment reservations
- ✅ **User Dashboard** - View personal reservations and history
- ✅ **Admin Panel** - Manage all reservations and system overview
- ✅ **Real-time Status** - Live server and database status monitoring
- ✅ **Modern UI/UX** - Responsive design with professional interface
- ✅ **MySQL Integration** - Full database integration with comprehensive schema
- ✅ **Security Features** - Rate limiting, CORS, Helmet security headers

## 🗄️ Database Schema

The system uses a comprehensive MySQL database with the following tables:
- **Users & Roles** - User management with role-based access
- **Equipment & Categories** - Equipment catalog with categorization
- **Reservations & Status** - Reservation management with status tracking
- **Maintenance Records** - Equipment maintenance history
- **Audit Logs** - System activity tracking

## 📁 Project Structure

```
equipment-reservation-system/
├── server.js                  # Express.js server with security middleware
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables
├── config/
│   └── database.js            # MySQL database configuration
├── controllers/               # Business logic layer
│   ├── dataController.js      # Equipment management operations
│   ├── reservationController.js # Reservation CRUD operations
│   └── healthController.js    # System health monitoring
├── routes/                    # Route definitions layer
│   ├── api.js                 # API endpoint routes
│   └── index.js               # Main page routes
├── models/                    # Data access layer
│   ├── dataModel.js           # Equipment model (MySQL queries)
│   ├── reservationModel.js    # Reservation model
│   └── userModel.js           # User management model
├── middleware/                # Custom middleware
│   └── errorHandler.js        # Error handling, logging, validation
├── public/                    # Frontend files
│   ├── index.html             # Modern SPA interface
│   ├── styles.css             # Professional CSS styling
│   └── script.js              # Interactive JavaScript application
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **npm** (comes with Node.js)

### Database Setup

1. **Create the MySQL database:**
   ```sql
   CREATE DATABASE equipment_reservation_system;
   ```

2. **Run the provided schema script** (included in your request) to create all tables and sample data

3. **Update database credentials** in `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=equipment_reservation_system
   ```

### Installation

1. **Clone or download this project**
2. **Navigate to the project directory**
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Configure environment variables:**
   - Copy `.env` file and update database credentials
   - Set JWT_SECRET for security

### Running the Application

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The application will be available at: **http://localhost:3000**

## 🔗 API Endpoints

### Health & System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server and database status check |
| GET | `/api/system/status` | Detailed system status and statistics |

### Equipment Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/equipment` | Get available equipment |
| GET | `/api/equipment/all` | Get all equipment with pagination |
| GET | `/api/equipment/search?q=term` | Search equipment by name/description |
| GET | `/api/equipment/categories` | Get equipment categories |
| GET | `/api/equipment/:id` | Get single equipment details |

### Reservations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reservations` | Get all reservations (with filters) |
| POST | `/api/reservations` | Create new reservation |
| GET | `/api/reservations/my` | Get current user reservations |
| GET | `/api/reservations/statuses` | Get available reservation statuses |
| GET | `/api/reservations/:id` | Get single reservation |
| PUT | `/api/reservations/:id/status` | Update reservation status |

### Example API Usage

**Search equipment:**
```javascript
fetch('/api/equipment/search?q=camera&category=1')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Create reservation:**
```javascript
fetch('/api/reservations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    equipment_id: 1,
    start_date: '2025-07-25T09:00:00',
    end_date: '2025-07-25T17:00:00',
    purpose: 'Photography project'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🎨 Frontend Features

- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🔍 Smart Search** - Real-time equipment search with category filters
- **📋 Reservation Management** - Intuitive reservation creation and tracking
- **⚙️ Admin Dashboard** - Comprehensive admin panel with system statistics
- **🎯 Interactive UI** - Modal dialogs, notifications, and smooth animations
- **🏷️ Status Indicators** - Visual status badges for equipment and reservations

## 🛡️ Backend Features

- **🏗️ MVC Architecture** - Clean separation of concerns
- **🔒 Security Middleware** - Helmet, CORS, rate limiting
- **📊 MySQL Integration** - Full database operations with connection pooling
- **🔧 Error Handling** - Comprehensive error management and logging
- **📈 System Monitoring** - Health checks and system status reporting
- **🔄 Transaction Support** - Database transactions for data integrity

## 🛠️ Development

### Adding New Features

1. **Equipment Features**: 
   - Add new endpoints in `routes/api.js`
   - Implement logic in `controllers/dataController.js`
   - Add database operations in `models/dataModel.js`

2. **Reservation Features**:
   - Extend `controllers/reservationController.js`
   - Add new database methods in `models/reservationModel.js`

3. **Frontend Features**:
   - Update UI in `public/index.html`
   - Add styling in `public/styles.css`
   - Implement functionality in `public/script.js`

### Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=equipment_reservation_system

# Security
JWT_SECRET=your_secret_key
BCRYPT_ROUNDS=12

# Server
NODE_ENV=development
PORT=3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Technologies Used

### Frontend
- **HTML5** - Semantic markup with modern structure
- **CSS3** - Custom properties, Flexbox, Grid, animations
- **Vanilla JavaScript** - ES6+ with classes, async/await, Fetch API

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework with middleware
- **MySQL2** - Database driver with promise support
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting

### Database
- **MySQL 8.0** - Relational database with InnoDB engine
- **Connection Pooling** - Optimized database connections
- **Transaction Support** - ACID compliance for data integrity

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 🔐 Security Features

- **Rate Limiting** - Prevents API abuse
- **CORS Configuration** - Secure cross-origin requests
- **Helmet Security** - Security headers protection
- **Input Validation** - Server-side data validation
- **SQL Injection Prevention** - Parameterized queries
- **Password Hashing** - bcrypt for secure password storage

## 📄 License

ISC License - Feel free to use this project as a foundation for your equipment reservation needs.

---

**🚀 Ready to manage your equipment reservations efficiently!**
