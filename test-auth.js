const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  console.log("Mencoba mendaftar...");
  const testEmail = `test_${Date.now()}@example.com`;
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: 'password123',
    options: {
      data: {
        full_name: 'Test Nama'
      }
    }
  });

  if (error) {
    console.error("❌ ERROR SIGNUP:");
    console.error(JSON.stringify(error, null, 2));
    console.error("Message:", error.message);
  } else {
    console.log("✅ BERHASIL DAFTAR! ID:", data?.user?.id);
  }
}

testSignup();
