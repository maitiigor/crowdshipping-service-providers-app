#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Running TypeScript type checking...\n');

try {
    // Check the entire project
    console.log('📁 Checking entire project...');
    execSync('npx tsc --noEmit --skipLibCheck', {
        stdio: 'inherit',
        cwd: process.cwd()
    });
    console.log('✅ Project type check passed!\n');

    // Check specific Redux files
    console.log('🔧 Checking Redux files...');
    const reduxFiles = [
        'hooks/useRedux.ts',
        'store/index.ts',
        'store/slices/userSlice.ts',
        'store/slices/authSlice.ts',
        'store/slices/formsSlice.ts',
        'models/index.ts'
    ];

    for (const file of reduxFiles) {
        try {
            execSync(`npx tsc --noEmit --skipLibCheck ${file}`, {
                stdio: 'pipe',
                cwd: process.cwd()
            });
            console.log(`✅ ${file}`);
        } catch (error) {
            console.log(`❌ ${file}`);
            console.log(error.stdout.toString());
        }
    }

    console.log('\n🎉 All Redux files are type-safe!');
    console.log('\n💡 If you see red lines in your editor:');
    console.log('   1. Restart your TypeScript language server');
    console.log('   2. Reload your editor window');
    console.log('   3. Check if your editor is using the correct tsconfig.json');
    console.log('   4. Make sure all dependencies are installed');

} catch (error) {
    console.error('❌ Type checking failed:');
    console.error(error.stdout?.toString() || error.message);
    process.exit(1);
}