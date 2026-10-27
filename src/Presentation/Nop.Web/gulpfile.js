'use strict'

import gulp from 'gulp';
import { prepareCldr } from './gulp/tasks/prepareCldr.js';
import copyDependencies from './gulp/tasks/copyDependencies.js';
import clean from './gulp/tasks/clean.js';
import { compileTailwind, watchTailwind } from './gulp/tasks/compileTailwind.js';

// Default task: clean, copy npm deps, prepare CLDR data, then compile Tailwind
gulp.task('default', 
  gulp.series(clean, copyDependencies, prepareCldr, compileTailwind)
);

// Build CSS only (faster, skips npm copy)
gulp.task('build:css', compileTailwind);

// Watch mode for Tailwind (run alongside dotnet watch)
gulp.task('watch:css', gulp.series(compileTailwind, watchTailwind));
