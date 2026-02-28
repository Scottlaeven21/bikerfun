import * as dotenv from 'dotenv';
import { resolve } from 'path';
import nodemailer from 'nodemailer';

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function testEmailConfig() {
  console.log('🔍 Checking SMTP Email Configuration...\n');

  // Check environment variables
  const hasHost = !!process.env.SMTP_HOST;
  const hasPort = !!process.env.SMTP_PORT;
  const hasUser = !!process.env.SMTP_USER;
  const hasPassword = !!process.env.SMTP_PASSWORD;
  const hasFromEmail = !!process.env.SMTP_FROM_EMAIL;
  const hasToEmail = !!process.env.SMTP_TO_EMAIL;

  console.log('📋 SMTP Environment Variables:');
  console.log(`   SMTP_HOST: ${hasHost ? '✅ ' + process.env.SMTP_HOST : '❌ Missing'}`);
  console.log(`   SMTP_PORT: ${hasPort ? '✅ ' + process.env.SMTP_PORT : '❌ Missing'}`);
  console.log(`   SMTP_SECURE: ${process.env.SMTP_SECURE || 'false'} (true voor 465, false voor 587)`);
  console.log(`   SMTP_USER: ${hasUser ? '✅ ' + process.env.SMTP_USER : '❌ Missing'}`);
  console.log(`   SMTP_PASSWORD: ${hasPassword ? '✅ ••••••••' : '❌ Missing'}`);
  console.log(`   SMTP_FROM_EMAIL: ${hasFromEmail ? '✅ ' + process.env.SMTP_FROM_EMAIL : '❌ Missing'}`);
  console.log(`   SMTP_TO_EMAIL: ${hasToEmail ? '✅ ' + process.env.SMTP_TO_EMAIL : '❌ Missing'}`);
  
  if (!hasHost || !hasPort || !hasUser || !hasPassword) {
    console.log('\n❌ SMTP credentials ontbreken!');
    console.log('\n📝 Vraag de IT\'er om de StackMail SMTP gegevens:');
    console.log('   - SMTP Host (bijv. smtp.stackmail.com)');
    console.log('   - SMTP Port (meestal 587)');
    console.log('   - SMTP User (bijv. info@bikerfun.nl)');
    console.log('   - SMTP Password (wachtwoord van email account)');
    console.log('\nZie STACKMAIL_SMTP_SETUP.md voor volledige instructies.');
    return;
  }

  // Test SMTP connection
  console.log('\n🧪 Testing SMTP Connection...');
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.SMTP_TO_EMAIL,
      subject: 'Test Email - Bikerfun Contact Form (StackMail SMTP)',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #f5c80d;">✅ SMTP Test Geslaagd!</h2>
          <p>Dit is een test email vanuit de Bikerfun website via <strong>StackMail SMTP</strong>.</p>
          <p>Als je deze email ontvangt, is de SMTP configuratie correct!</p>
          <hr style="border: 1px solid #f5c80d; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            SMTP Host: ${process.env.SMTP_HOST}<br>
            SMTP Port: ${process.env.SMTP_PORT}<br>
            From: ${process.env.SMTP_FROM_EMAIL}<br>
            To: ${process.env.SMTP_TO_EMAIL}
          </p>
        </div>
      `,
    });

    console.log('✅ Test email verzonden!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`\n💡 Check je inbox (${process.env.SMTP_TO_EMAIL}) voor de test email.`);
  } catch (err) {
    console.error('\n❌ SMTP Error:', err);
    console.log('\n🔧 Mogelijke oorzaken:');
    console.log('   - Onjuiste SMTP credentials');
    console.log('   - Verkeerde host of port');
    console.log('   - Firewall blokkeert verbinding');
    console.log('   - Email account niet actief');
  }
}

testEmailConfig();
