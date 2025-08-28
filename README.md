# GIS.ai Parallelized Data-to-Profit Engine

Event-driven microservices stack for ingesting, parsing, valuating, and serving GIS data for commercial use.

## Architecture

- Stateless microservices communicating via NATS JetStream
- Internal-only network; Traefik exposes ports 80/443 with ACME TLS
- Postgres+PostGIS for metadata, MinIO object storage, Redis Streams for transient data
- Vector tiles served via TileServer-GL; static HTML via Nginx API Gateway

## Quick start

1. Copy environment template and edit values:
   ```bash
   cp env.template .env
   ```
2. Create ACME storage file with secure permissions:
   ```bash
   touch acme.json && chmod 600 acme.json
   ```
3. Build and start:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

## CI/CD (GitLab)

On push to main:
- Test: runs placeholder tests via docker-compose.test.yml
- Build: builds and pushes images using docker compose
- Deploy: ships docker-compose.prod.yml to remote host and performs zero-downtime update

## Services

- `traefik`: reverse proxy, TLS via Let's Encrypt
- `api-gateway`: Nginx serving static HTML and proxying to microservices
- `nats-server`, `redis`, `postgres` (PostGIS), `minio`, `searxng`, `tor-proxy`
- Ingestion: `deepweb-scraper`, `searxng-agent`, `ai-provider-poller`
- Processing: `unstructured-data-parser`, `valuation-engine`, `geojson-optimizer`
- Output: `dynamic-content-generator`, `vector-tile-server`

## Notes

- GeoJSON best practices: serve with `application/geo+json`, simplify and gzip assets, and prefer vector tiles for maps.
- Adjust DNS to point `${DOMAIN}` to your host's fixed public IP.

