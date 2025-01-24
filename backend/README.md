# Project Setup Instructions

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
docker compose up -d --build
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

### 6. Verify Setup

1. Confirm the database user and permissions are set correctly by running queries in the `psql` shell.
2. Verify the application is running as expected.

---

## Notes

- Ensure that the `.env` file contains all required variables before starting the containers.
- Use the same password and username as mentioned in the SQL commands or update them according to your project requirements.
