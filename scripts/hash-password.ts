// Usage: npm run hash -- "your-admin-password"
// Prints a bcrypt hash to paste into ADMIN_PASSWORD_HASH in .env.local

import bcrypt from "bcryptjs";

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: npm run hash -- "your-admin-password"');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 10);
  console.log("\nAdd this to your .env.local:\n");
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
}

main();
