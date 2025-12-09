/**
 * Export data from Supabase
 * Run: node scripts/export-from-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get credentials from environment or prompt
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
  console.error('❌ Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  console.error('Example: VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/export-from-supabase.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function exportData() {
  console.log('📦 Exporting data from Supabase...\n');

  try {
    // Fetch all leads
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    console.log(`✅ Found ${leads.length} records\n`);

    // Create SQL INSERT statements
    const sqlStatements = leads.map(lead => {
      const values = [
        lead.name ? `'${lead.name.replace(/'/g, "''")}'` : 'NULL',
        lead.phone ? `'${lead.phone}'` : 'NULL',
        lead.meeting_date ? `'${lead.meeting_date}'` : 'NULL',
        lead.meeting_time ? `'${lead.meeting_time}'` : 'NULL',
        lead.status ? `'${lead.status}'` : "'pending'",
        lead.notes ? `'${lead.notes.replace(/'/g, "''")}'` : 'NULL',
        lead.calendar_event_id ? `'${lead.calendar_event_id}'` : 'NULL',
        lead.created_at ? `'${lead.created_at}'` : 'CURRENT_TIMESTAMP',
        lead.updated_at ? `'${lead.updated_at}'` : 'CURRENT_TIMESTAMP'
      ];

      return `INSERT INTO leads (name, phone, meeting_date, meeting_time, status, notes, calendar_event_id, created_at, updated_at)\nVALUES (${values.join(', ')});`;
    });

    // Write to file
    const outputDir = path.join(__dirname, '../data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const sqlFile = path.join(outputDir, 'import-data.sql');
    const jsonFile = path.join(outputDir, 'backup.json');

    // Write SQL file
    const sqlContent = `-- Data exported from Supabase on ${new Date().toISOString()}
-- Total records: ${leads.length}

${sqlStatements.join('\n\n')}

-- Update sequence to avoid ID conflicts
SELECT setval('leads_id_seq', (SELECT MAX(id) FROM leads));
`;

    fs.writeFileSync(sqlFile, sqlContent, 'utf8');
    console.log(`✅ SQL export saved to: ${sqlFile}`);

    // Write JSON backup
    fs.writeFileSync(jsonFile, JSON.stringify(leads, null, 2), 'utf8');
    console.log(`✅ JSON backup saved to: ${jsonFile}`);

    // Print sample data
    console.log('\n📊 Sample data:');
    console.log(JSON.stringify(leads.slice(0, 2), null, 2));

    console.log('\n✨ Export complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Copy import-data.sql to your server');
    console.log('2. Run: docker exec -i circle-buro-db psql -U circle_user -d circle_buro < import-data.sql');

  } catch (error) {
    console.error('❌ Error exporting data:', error.message);
    process.exit(1);
  }
}

exportData();
