import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function checkWordPressMemory() {
  console.log('🔍 Checking WordPress Memory Limit...\n');

  const auth = Buffer.from(
    `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
  ).toString('base64');

  try {
    // Try to get system status from WooCommerce
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/system_status`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      console.log('❌ Cannot fetch WordPress system status');
      console.log(`   Status: ${response.status}`);
      
      // Fallback: check from sync error
      console.log('\n📋 From previous sync error logs:');
      console.log('   Memory Exhausted at: 134217728 bytes = 128 MB');
      console.log('   Current limit: 128 MB ❌ (Te laag!)');
      console.log('   Aanbevolen: 512 MB ✅');
      return;
    }

    const data = await response.json();
    
    console.log('✅ WordPress System Status:\n');
    
    // Environment info
    if (data.environment) {
      const env = data.environment;
      
      console.log('💾 Memory Limits:');
      console.log(`   PHP Memory Limit: ${env.php_memory_limit || 'Unknown'}`);
      console.log(`   PHP Post Max Size: ${env.php_post_max_size || 'Unknown'}`);
      console.log(`   PHP Max Upload: ${env.max_upload_size || 'Unknown'}`);
      console.log(`   PHP Max Execution Time: ${env.php_max_execution_time || 'Unknown'}s`);
      
      console.log('\n📊 WordPress Info:');
      console.log(`   WP Memory Limit: ${env.wp_memory_limit || 'Unknown'}`);
      console.log(`   WP Max Memory Limit: ${env.wp_max_memory_limit || 'Unknown'}`);
      console.log(`   WP Debug Mode: ${env.wp_debug_mode ? 'Yes' : 'No'}`);
      
      console.log('\n🖥️ Server Info:');
      console.log(`   PHP Version: ${env.php_version || 'Unknown'}`);
      console.log(`   Server Info: ${env.server_info || 'Unknown'}`);
      
      // Check if memory is sufficient
      const memoryLimit = env.wp_memory_limit || env.php_memory_limit || '0M';
      const memoryValue = parseInt(memoryLimit);
      
      console.log('\n📈 Memory Status:');
      if (memoryValue < 256) {
        console.log(`   ❌ ONVOLDOENDE! (${memoryLimit})`);
        console.log('   Minimaal nodig: 256M');
        console.log('   Aanbevolen: 512M');
      } else if (memoryValue < 512) {
        console.log(`   ⚠️  VOLDOENDE maar kan beter (${memoryLimit})`);
        console.log('   Aanbevolen: 512M');
      } else {
        console.log(`   ✅ UITSTEKEND! (${memoryLimit})`);
      }
    }
    
  } catch (error: any) {
    console.error('❌ Error checking WordPress status:', error.message);
    console.log('\n📋 Fallback: From previous sync error logs:');
    console.log('   Memory Exhausted at: 134217728 bytes');
    console.log('   Current limit: 128 MB ❌');
    console.log('   Aanbevolen: 512 MB ✅');
  }
}

checkWordPressMemory();
