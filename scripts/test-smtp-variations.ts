import * as dotenv from 'dotenv';
import { resolve } from 'path';
import nodemailer from 'nodemailer';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const password = process.env.SMTP_PASSWORD!;
const host = 'smtp.stackmail.com';

async function testVariation(config: any, label: string) {
  console.log(`\n🧪 Testing: ${label}`);
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   User: ${config.auth.user}`);
  
  const transporter = nodemailer.createTransport(config);
  
  try {
    await transporter.verify();
    console.log(`   ✅ SUCCESS! This configuration works!`);
    return true;
  } catch (err: any) {
    console.log(`   ❌ Failed: ${err.message}`);
    return false;
  }
}

async function testAllVariations() {
  console.log('🔍 Testing verschillende SMTP configuraties...');
  
  const variations = [
    {
      label: 'Port 465 SSL + info@bikerfun.nl',
      config: {
        host,
        port: 465,
        secure: true,
        auth: { user: 'info@bikerfun.nl', pass: password },
      },
    },
    {
      label: 'Port 465 SSL + alleen "info"',
      config: {
        host,
        port: 465,
        secure: true,
        auth: { user: 'info', pass: password },
      },
    },
    {
      label: 'Port 587 STARTTLS + info@bikerfun.nl',
      config: {
        host,
        port: 587,
        secure: false,
        auth: { user: 'info@bikerfun.nl', pass: password },
      },
    },
    {
      label: 'Port 587 STARTTLS + alleen "info"',
      config: {
        host,
        port: 587,
        secure: false,
        auth: { user: 'info', pass: password },
      },
    },
  ];
  
  for (const variation of variations) {
    const success = await testVariation(variation.config, variation.label);
    if (success) {
      console.log(`\n🎉 GEVONDEN! Gebruik deze configuratie:\n`);
      console.log(`SMTP_HOST=${variation.config.host}`);
      console.log(`SMTP_PORT=${variation.config.port}`);
      console.log(`SMTP_SECURE=${variation.config.secure}`);
      console.log(`SMTP_USER=${variation.config.auth.user}`);
      break;
    }
  }
  
  console.log('\n📝 Als geen enkele werkt, vraag IT\'er:');
  console.log('   - Is SMTP verzenden vanaf externe servers toegestaan?');
  console.log('   - Moet er een apart "application password" gebruikt worden?');
  console.log('   - Is er IP whitelisting vereist?');
}

testAllVariations();
