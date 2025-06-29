```markdown
# 📦 Artha Job Board – Backend

> 🟢 **Backend Deployment link:** [https://artha-mern-job-importer-be.onrender.com)  


---

## 📁 Folder Structure



---

## 📦 Tech Stack

-   **Node.js** & **Express.js** – RESTful API server
-   **MongoDB + Mongoose** – Database and schema modeling
-   **BullMQ** – Background job queue and retry logic
-   **Redis** – Persistent storage for BullMQ
-   **Socket.IO** – Real-time data updates
-   **node-cron** – Automated job import scheduling
-   **fast-xml-parser** – Convert XML job feeds to JSON
-   **dotenv** – Environment-based configuration

---

## ⚙️ .env Configuration

```yaml
PORT=3000
MONGO_URI=mongodb://localhost:27017/artha-job-board
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JOB_QUEUE_BATCH_SIZE=100
JOB_WORKER_CONCURRENCY=5
FRONTEND_URL=http://localhost:5050
````

-----

## 🔧 Features

### 1\. Job Import & Queueing

  - Fetches XML job data from Jobicy.
  - Parses XML → JSON.
  - Queues jobs into Redis via BullMQ.
  - Tracks import metadata via `ImportLog`.

### 2\. Deduplication Logic

  - Matches jobs by `url` or `externalId`.
  - Updates existing jobs or inserts new ones accordingly.

### 3\. Retry & Exponential Backoff

Jobs use automatic retry logic:

```javascript
attempts: 3,
backoff: {
  type: 'exponential',
  delay: 1000 // milliseconds
}
```

### 4\. Cron-Based Auto Import

```javascript
'0 * * * *' // Every hour at 0 minutes
```

Automatically runs import logic every hour.

### 5\. Real-time Updates via Socket.IO

Emits updates for every processed job.

Frontend receives real-time logs via:

```javascript
io.emit('importLogUpdated', updatedLog);
```

### 6\. Import Logging

Each import creates an `ImportLog` document:

  - `fileName`
  - `importDateTime`
  - `totalFetched`
  - `newJobs`
  - `updatedJobs`
  - `failedJobs`
  - `failedReasons[]`

-----

## 🔌 API Endpoints

| Method | Endpoint                    | Description                          |
| :----- | :-------------------------- | :----------------------------------- |
| `GET`  | `/api/import-history`       | List all import logs                 |
| `GET`  | `/api/import-history/:id`   | Get import log by ID                 |
| `GET`  | `/api/jobs/test-fetch`      | Preview job feed (no DB write)       |
| `GET`  | `/api/jobs/trigger-import` | Trigger a full import manually       |

-----

## 🚀 Getting Started

### 1\. Install dependencies

```bash
cd server
npm install
```

### 2\. Start MongoDB and Redis

Make sure MongoDB and Redis services are running locally.

### 3\. Start the development server

```bash
npm run dev
```

-----

## 🧪 Testing Instructions

1.  Open `/api/jobs/test-fetch` to test job parsing.
2.  Hit `/api/jobs/trigger-import` to queue jobs.
3.  Monitor MongoDB’s `import_logs` collection.
4.  Open frontend `/import-history` to see real-time updates.

-----

## 📝 Notes

  - Transaction support needs MongoDB replica set.
  - Socket.IO has CORS enabled to allow frontend access.
  - Failed jobs are logged with error messages in `ImportLog.failedReasons`.

-----

## ✍️ Author

Diwakar Sharma
🔗 [GitHub – Diwakarsharma2216](https://github.com/Diwakarsharma2216)

```
```
