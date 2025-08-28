/*
  Placeholder GeoJSON optimizer.
  Reads env, simulates processing, and writes a health artifact to /site.
*/

const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function main() {
  const natsUrl = process.env.NATS_URL || 'nats://nats-server:4222';
  const minioEndpoint = process.env.MINIO_ENDPOINT || 'http://minio:9000';
  const postgresDsn = process.env.POSTGRES_DSN || 'postgresql://user:pass@postgres:5432/db';

  const siteDir = '/site';
  ensureDirectoryExists(siteDir);

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    natsUrl,
    minioEndpoint,
    postgresDsnMasked: postgresDsn.replace(/:(?:[^:@/]+)@/, '://***:***@'),
  };

  const outFile = path.join(siteDir, 'geojson-optimizer-health.json');
  fs.writeFileSync(outFile, JSON.stringify(health, null, 2));
  console.log(`Wrote ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});







