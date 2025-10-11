# Dr. Nader Hammad Clinic - Booking System

A modern, full-stack clinic booking application built with the T3 Stack (Next.js, TypeScript, tRPC, Prisma, Tailwind CSS).

## Features

- 🎨 Beautiful UI with custom color palette (#0A1931, #B3CFE5, #4A7FA7, #1A3D63, #F6FAFD)
- 📅 Interactive calendar booking system with real-time availability
- 🔒 Type-safe API with tRPC
- 💾 PostgreSQL database with Prisma ORM
- 📱 Responsive design for all devices
- ✅ Form validation with Zod and React Hook Form
- 🎯 Multi-step booking process
- ⏰ Automated time slot generation (30-minute intervals)
- 🚫 Conflict detection for double bookings

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:

Update `.env` file with your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/clinic_booking"
```

Replace `user`, `password`, `localhost:5432`, and `clinic_booking` with your actual database credentials.

### Database Setup

1. Push the schema to your database:
```bash
npm run db:push
```

2. Seed the database with sample services:
```bash
npm run db:seed
```

This will create 6 medical services:
- General Consultation (30 min - $100)
- Follow-up Visit (20 min - $60)
- Pediatric Care (30 min - $90)
- Vaccination (15 min - $50)
- Physical Examination (45 min - $150)
- Chronic Disease Management (40 min - $120)

### Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
clinic-booking/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding script
├── src/
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   └── textarea.tsx
│   │   └── BookingForm.tsx    # Main booking form component
│   ├── pages/
│   │   └── index.tsx          # Landing page
│   ├── server/
│   │   └── api/
│   │       ├── routers/
│   │       │   ├── service.ts # Service API routes
│   │       │   └── booking.ts # Booking API routes
│   │       └── root.ts        # Main tRPC router
│   ├── styles/
│   │   └── globals.css        # Global styles with color palette
│   └── lib/
│       └── utils.ts           # Utility functions
├── tailwind.config.ts         # Tailwind configuration
└── package.json
```

## Database Schema

### Service Model
- `id`: Unique identifier
- `name`: Service name
- `description`: Optional description
- `duration`: Duration in minutes
- `price`: Optional price (Decimal)
- `active`: Active status
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

### Booking Model
- `id`: Unique identifier
- `serviceId`: Related service
- `firstName`: Patient first name
- `lastName`: Patient last name
- `email`: Patient email
- `phone`: Patient phone number
- `date`: Booking date
- `startTime`: Appointment start time
- `endTime`: Appointment end time
- `notes`: Optional notes
- `status`: PENDING | CONFIRMED | CANCELLED | COMPLETED
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

## API Routes (tRPC)

### Service Routes
- `service.getAll` - Get all active services
- `service.getById` - Get service by ID
- `service.create` - Create new service

### Booking Routes
- `booking.create` - Create new booking (with conflict detection)
- `booking.getAvailableSlots` - Get available time slots for a service/date
- `booking.getByEmail` - Get bookings by email
- `booking.updateStatus` - Update booking status

## Available Scripts

- `npm run dev` - Start development server with Turbo
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run typecheck` - Run TypeScript type checking

## Features in Detail

### Booking Flow

1. **Select Service**: Choose from available medical services
2. **Pick Date & Time**:
   - Calendar view for date selection
   - Real-time available time slots (9 AM - 5 PM, 30-min intervals)
   - Automatic conflict detection
3. **Enter Information**:
   - Personal details (name, email, phone)
   - Optional notes
   - Booking summary review

### Time Slot Management

- Working hours: 9 AM to 5 PM
- Slot intervals: 30 minutes
- Duration-based slot blocking (e.g., 45-min service blocks appropriate slots)
- Real-time conflict checking prevents double bookings

### Color Palette

Custom medical-themed color scheme:
- **Primary Dark**: #0A1931 - Main headers, important elements
- **Primary**: #1A3D63 - Secondary elements
- **Primary Light**: #4A7FA7 - Accents, hover states
- **Accent**: #B3CFE5 - Backgrounds, cards
- **Accent Light**: #F6FAFD - Page backgrounds

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: tRPC
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Radix UI primitives
- **Date Handling**: date-fns
- **Calendar**: react-day-picker

## Production Deployment

### Environment Variables

For production, ensure these are set:
```env
DATABASE_URL="your-production-postgresql-url"
```

### Build & Deploy

```bash
npm run build
npm run start
```

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available)

---

Built with the [T3 Stack](https://create.t3.gg/)
