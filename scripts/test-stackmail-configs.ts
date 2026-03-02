import * as dotenv from 'dotenv';
import { resolve } from 'path';
import nodemailer from 'nodemailer';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const testConfigs = [
  {
    name: 'StackMail Port 465 (SSL) - Huidige config',
    host: 'smtp.stackmail.com',
    port: 465,
    secure: true,
  },
  {
    name: 'StackMail Port 587 (TLS)',
    host: 'smtp.stackmail.com',
    port: 587,
    secure: false,
  },
  {
    name: 'Domain-based SMTP Port 465 (SSL)',
    host: 'mail.bikerfun.nl',
    port: 465,
    secure: true,
  },
  {
    name: 'Domain-based SMTP Port 587 (TLS)',
    host: 'mail.bikerfun.nl',
    port: 587,
    secure: false,
  },
  {
    name: 'Direct domain SMTP Port 465',
    host: 'bikerfun.nl',
    port: 465,
    secure: true,
  },
  {
    name: 'Direct domain SMTP Port 587',
    host: 'bikerfun.nl',
    port: 587,
    secure: false,
  },
];

async function testConfig(config: typeof testConfigs[0]) {
  console.log(`\n🧪 Testing: ${config.name}`);
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Secure: ${config.secure}`);

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Voor zelfondertekende certificaten
    },
  });

  try {
    await transporter.verify();
    console.log('   ✅ CONNECTION SUCCESSFUL!');
    console.log('   ✅ This configuration works!');
    
    // Probeer een test email te sturen
    console.log('   📤 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.SMTP_TO_EMAIL,
      subject: `Test Email - ${config.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #f5c80d;">✅ SMTP Test Geslaagd!</h2>
          <p>Deze configuratie werkt:</p>
          <ul>
            <li><strong>Host:</strong> ${config.host}</li>
            <li><strong>Port:</strong> ${config.port}</li>
            <li><strong>Secure:</strong> ${config.secure}</li>
          </ul>
          <p>Gebruik deze settings in je .env.local!</p>
        </div>
      `,
    });
    console.log(`   ✅ Test email sent! Message ID: ${info.messageId}`);
    console.log(`\n🎉 SUCCESS! Use these settings in .env.local:`);
    console.log(`   SMTP_HOST=${config.host}`);
    console.log(`   SMTP_PORT=${config.port}`);
    console.log(`   SMTP_SECURE=${config.secure}`);
    return true;
  } catch (err: any) {
    console.log(`   ❌ Failed: ${err.message}`);
    if (err.code === 'EAUTH') {
      console.log('   ⚠️  Authentication failed - check username/password');
    } else if (err.code === 'ECONNREFUSED') {
      console.log('   ⚠️  Connection refused - wrong host or port');
    } else if (err.code === 'ETIMEDOUT') {
      console.log('   ⚠️  Connection timeout - host unreachable or blocked');
    }
    return false;
  }
}

async function testAllConfigs() {
  console.log('🔍 Testing StackMail SMTP Configurations...\n');
  console.log(`📧 Using credentials:`);
  console.log(`   User: ${process.env.SMTP_USER}`);
  console.log(`   Password: ${process.env.SMTP_PASSWORD ? '••••••••' : '❌ NOT SET'}`);
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log('\n❌ SMTP credentials missing in .env.local');
    process.exit(1);
  }

  let successCount = 0;

  for (const config of testConfigs) {
    const success = await testConfig(config);
    if (success) {
      successCount++;
      // Stop after first success
      break;
    }
    // Wait a bit between attempts
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(60));
  if (successCount > 0) {
    console.log('✅ Found working configuration!');
    console.log('📧 Check your inbox for the test email.');
  } else {
    console.log('❌ No working configuration found.');
    console.log('\n🔧 Next steps:');
    console.log('   1. Check StackCP for correct SMTP settings');
    console.log('   2. Verify username is: info@bikerfun.nl (not just "info")');
    console.log('   3. Try resetting the email password in StackCP');
    console.log('   4. Check if SMTP is enabled for this account');
    console.log('   5. Contact StackMail support for correct SMTP settings');
  }
}

testAllConfigs();
