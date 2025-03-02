# PainKiller-r1chwoon

Follow these steps to set up and run the project locally using Docker and PostgreSQL.

## Steps

### 1. Configure Environment Variables

1. Rename `.env.example` to `.env`:

   ```bash
   mv .env.example .env
   ```

2. Edit the `.env` file to include your project-specific configurations.

### 2. Build and Start the Docker Containers

Run the following command to build and start the containers in detached mode:

```bash
docker compose up -d --force-recreate
```

### 3. Access the Database Container

To access the PostgreSQL database container, run:

```bash
docker exec -it painkiller-db bash
```

### 4. Connect to PostgreSQL

Once inside the container, connect to the PostgreSQL database using the following command:

```bash
psql -U painkiller -d pkdb
```

### 5. Configure Database Permissions

Run the following SQL commands to configure permissions for the `painkiller` user:

```sql
REVOKE CONNECT ON DATABASE pkdb FROM public;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
CREATE USER painkiller WITH PASSWORD '1234';
GRANT CONNECT ON DATABASE pkdb TO painkiller;
GRANT USAGE ON SCHEMA public TO painkiller;
GRANT CREATE ON SCHEMA public TO painkiller;
GRANT ALL ON DATABASE pkdb TO painkiller;
GRANT ALL ON SCHEMA public TO painkiller;
ALTER USER painkiller CREATEDB;
```

### 6. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
```

Run the following commands:

```bash
npm run db:push
```

### 7. Start the Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Start the development server:

```bash
npm run dev
```

