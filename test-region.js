const { Client } = require('pg');

const regions = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-west-1',
  'eu-west-2',
  'eu-central-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'sa-east-1',
  'ca-central-1'
];

const password = 'yP1BDksAG4jM21$';
const projectRef = 'krueiuosnncskgbcckkn';

async function testRegions() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    console.log(`Trying ${host}...`);
    
    const client = new Client({
      host: host,
      port: 6543,
      user: `postgres.${projectRef}`,
      password: password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 3000
    });

    try {
      await client.connect();
      console.log(`\n✅ SUCCESS! The correct region is: ${region}`);
      console.log(`Connection String: postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@${host}:6543/postgres?pgbouncer=true`);
      await client.end();
      return;
    } catch (e) {
      // console.log(`Failed for ${region}:`, e.message);
    }
  }
  console.log('\n❌ Could not connect to any common region pooler.');
}

testRegions();
