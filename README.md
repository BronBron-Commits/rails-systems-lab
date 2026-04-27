# Fleet Maintenance Intelligence Dashboard

Rails API + React Frontend

---

## Overview

This project is a full-stack fleet maintenance system designed to simulate and manage machine faults, work orders, and operational insights for heavy equipment environments (e.g. construction, mining, logistics).

It combines:

* **Rails (API backend)** for data modeling, persistence, and analytics
* **React (frontend)** for a real-time operations dashboard
* **Simulated fault generation** to mimic real-world machine behavior
* **Insight aggregation** to transform raw faults into actionable data

The result is a system that resembles internal tooling used by industrial companies to monitor equipment health and optimize maintenance workflows.

---

## Key Features

### 1. Fleet Work Order System

* Create, update, and delete machine work orders
* Track:

  * Machine name
  * Model (e.g. Cat 966M, Cat D6)
  * Location (site-based)
  * Operating hours
  * Issue + description
* Status lifecycle:

  * Open
  * In Progress
  * Completed

---

### 2. Fault Simulation Engine

* Generates realistic machine faults using real equipment types
* Produces high-volume datasets for testing and analysis
* Mimics real operational environments with:

  * Site distribution
  * Model distribution
  * Priority scoring

---

### 3. Operational Dashboard

The React frontend provides a **command center UI**:

#### KPI Metrics

* Total faults
* Open work
* Completed work
* Critical issues

#### Data Visualizations

* Faults by machine model (bar chart)
* Faults by site (pie chart)

#### Critical Fault Feed

* Highlights high-priority issues in real time

#### Work Order Queue

* Editable table-style interface
* Status updates
* Priority tracking

---

### 4. Insights API

Backend aggregation endpoint:

```
GET /api/insights
```

Provides:

* Totals
* Status breakdown
* Fault distribution by:

  * Model
  * Location

Used by frontend charts and KPI panels.

---

## Tech Stack

### Backend

* Ruby on Rails 8
* SQLite (default)
* ActiveRecord
* REST API

### Frontend

* React (Vite)
* TailwindCSS
* Recharts (data visualization)

---

## Project Structure

```
rails-systems-lab/
├── app/
│   ├── controllers/api/
│   ├── models/
│   └── views/
├── config/
├── db/
├── lib/tasks/           # simulation scripts
├── frontend/            # React app
│   ├── src/
│   └── package.json
```

---

## Setup

### 1. Clone Repo

```bash
git clone git@github.com:BronBron-Commits/rails-systems-lab.git
cd rails-systems-lab
```

---

### 2. Backend Setup

```bash
bundle install
rails db:migrate
rails server -b 0.0.0.0
```

API runs on:

```
http://localhost:3000
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## Simulation

Generate realistic fleet faults:

```bash
bundle exec rails fleet:generate_faults COUNT=50
```

This populates the database with machine work orders.

---

## API Endpoints

### Notes (Work Orders)

```
GET    /api/notes
POST   /api/notes
PATCH  /api/notes/:id
DELETE /api/notes/:id
```

---

### Insights

```
GET /api/insights
```

Returns aggregated data used by dashboard charts.

---

## Current Capabilities

* Simulated industrial-scale dataset
* Interactive dashboard UI
* Real-time status updates
* Insight generation from raw fault data

---

## Future Improvements

* Real-time updates (WebSockets / ActionCable)
* Technician assignment system
* Predictive maintenance (ML / scoring)
* Time-series analytics (trend tracking)
* Authentication / multi-user roles
* 3D fleet visualization (optional Three.js integration)

---

## Purpose

This project demonstrates how a simple CRUD system can evolve into:

* A **data-driven operational tool**
* A **simulation environment**
* A **decision-support dashboard**

It reflects patterns used in real-world fleet management and industrial monitoring systems.

---

## Author

BronBron-Commits

---

## License

MIT (or specify as needed)
