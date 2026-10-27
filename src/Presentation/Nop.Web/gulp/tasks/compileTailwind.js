/**
 * Gulp task: compileTailwind
 * 
 * Compiles Tailwind CSS utilities from the theme's input file.
 * Uses child_process to invoke npx tailwindcss since the Gulp
 * ecosystem doesn't have an official Tailwind v3 Gulp plugin.
 * 
 * Usage:
 *   gulp compileTailwind
 *   gulp compileTailwind --watch
 */

import { execSync } from 'child_process';
import gulp from 'gulp';

const inputFile  = 'Themes/ModernStore/Content/css/tailwind-input.css';
const outputFile = 'Themes/ModernStore/Content/css/tailwind.css';
const configFile = 'tailwind.config.cjs';

/**
 * One-time Tailwind compilation (minified for production).
 */
export function compileTailwind(done) {
  try {
    execSync(
      `npx tailwindcss -c ${configFile} -i ${inputFile} -o ${outputFile} --minify`,
      { stdio: 'inherit' }
    );
  } catch (err) {
    console.error('Tailwind compilation failed:', err.message);
  }
  done();
}

/**
 * Watch mode: recompile whenever views or input file change.
 */
export function watchTailwind() {
  gulp.watch(
    [
      'Views/**/*.cshtml',
      'Themes/**/*.cshtml',
      'Areas/**/*.cshtml',
      `${inputFile}`,
    ],
    compileTailwind
  );
}

export default compileTailwind;
