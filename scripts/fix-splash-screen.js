#!/usr/bin/env node

/**
 * Fix Splash Screen Script
 *
 * This script adds proper padding to the splash screen logo to prevent
 * it from being cut off on different screen sizes.
 *
 * Usage: node scripts/fix-splash-screen.js
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const SPLASH_INPUT = path.join(ASSETS_DIR, 'splash-icon.png');
const SPLASH_BACKUP = path.join(ASSETS_DIR, 'splash-icon.backup.png');
const SPLASH_OUTPUT = path.join(ASSETS_DIR, 'splash-icon-fixed.png');

console.log('🎨 REAUX Labs Splash Screen Fixer\n');
console.log('='.repeat(50));

// Check if sharp is installed
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ sharp library detected');
} catch (error) {
  console.log('❌ sharp library not found');
  console.log('\n📦 Installing sharp...\n');

  const { execSync } = require('child_process');
  try {
    execSync('npm install --no-save sharp', { stdio: 'inherit' });
    sharp = require('sharp');
    console.log('\n✅ sharp installed successfully');
  } catch (installError) {
    console.error('\n❌ Failed to install sharp');
    console.log('\nPlease install it manually:');
    console.log('  npm install --save-dev sharp');
    console.log('\nThen run this script again.');
    process.exit(1);
  }
}

console.log('='.repeat(50));
console.log('\n');

async function fixSplashScreen() {
  try {
    // Check if input file exists
    if (!fs.existsSync(SPLASH_INPUT)) {
      console.error(`❌ Input file not found: ${SPLASH_INPUT}`);
      process.exit(1);
    }

    console.log('📖 Reading original splash screen...');
    const metadata = await sharp(SPLASH_INPUT).metadata();
    console.log(`   Original size: ${metadata.width}x${metadata.height}px`);

    // Create backup
    console.log('\n💾 Creating backup...');
    if (!fs.existsSync(SPLASH_BACKUP)) {
      fs.copyFileSync(SPLASH_INPUT, SPLASH_BACKUP);
      console.log(`   Backup saved to: splash-icon.backup.png`);
    } else {
      console.log('   Backup already exists, skipping...');
    }

    // Calculate new dimensions with padding
    // We'll keep the canvas size but scale down the logo by 75% (leaving 12.5% padding on each side)
    const canvasWidth = metadata.width;
    const canvasHeight = metadata.height;
    const logoScale = 0.75; // Logo will be 75% of canvas size
    const logoWidth = Math.round(canvasWidth * logoScale);
    const logoHeight = Math.round(canvasHeight * logoScale);

    console.log('\n🎨 Creating padded splash screen...');
    console.log(`   Canvas size: ${canvasWidth}x${canvasHeight}px`);
    console.log(`   Logo size: ${logoWidth}x${logoHeight}px (${logoScale * 100}% of canvas)`);
    console.log(`   Padding: ${Math.round((1 - logoScale) / 2 * 100)}% on each side`);

    // Read the original image, resize it, and composite it onto a dark background
    const resizedLogo = await sharp(SPLASH_INPUT)
      .resize(logoWidth, logoHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    // Create a dark background and composite the resized logo centered
    await sharp({
      create: {
        width: canvasWidth,
        height: canvasHeight,
        channels: 3,
        background: { r: 28, g: 28, b: 13 } // #1c1c0d
      }
    })
      .composite([{
        input: resizedLogo,
        gravity: 'center'
      }])
      .png()
      .toFile(SPLASH_OUTPUT);

    console.log(`\n✅ Fixed splash screen created: splash-icon-fixed.png`);
    console.log('\n📝 Next steps:');
    console.log('   1. Review the fixed image: assets/splash-icon-fixed.png');
    console.log('   2. If it looks good, replace the original:');
    console.log('      mv assets/splash-icon-fixed.png assets/splash-icon.png');
    console.log('   3. Rebuild the app:');
    console.log('      npx expo prebuild --clean');
    console.log('      npm run android  (or npm run ios)');
    console.log('\n💡 Tip: You can restore the backup anytime:');
    console.log('      mv assets/splash-icon.backup.png assets/splash-icon.png');

  } catch (error) {
    console.error('\n❌ Error processing splash screen:', error.message);
    process.exit(1);
  }
}

// Alternative: Manual instructions if something fails
function showManualInstructions() {
  console.log('\n📋 Manual Fix Instructions:');
  console.log('='.repeat(50));
  console.log('\nIf the automated script fails, you can fix manually:');
  console.log('\n1. Open your design tool (Figma, Photoshop, etc.)');
  console.log('2. Create a new canvas:');
  console.log('   - Size: 2048x2048px (square)');
  console.log('   - Background: #1c1c0d (dark)');
  console.log('\n3. Place your REAUX LABS logo:');
  console.log('   - Center it on the canvas');
  console.log('   - Scale to ~75% of canvas width');
  console.log('   - Ensure 250-300px padding on all sides');
  console.log('   - Make sure L, A, B, S are fully visible');
  console.log('   - TM symbol should be within safe area');
  console.log('\n4. Export as PNG:');
  console.log('   - Name: splash-icon.png');
  console.log('   - Save to: assets/splash-icon.png');
  console.log('\n5. Rebuild:');
  console.log('   - npx expo prebuild --clean');
  console.log('   - npm run android (or npm run ios)');
  console.log('\n' + '='.repeat(50));
}

// Run the script
console.log('🚀 Starting splash screen fix...\n');
fixSplashScreen()
  .then(() => {
    console.log('\n✨ Done!\n');
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error.message);
    showManualInstructions();
    process.exit(1);
  });
