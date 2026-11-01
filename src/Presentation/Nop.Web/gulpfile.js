'use strict'

import gulp from 'gulp';
import { prepareCldr } from './gulp/tasks/prepareCldr.js';
import copyDependencies from './gulp/tasks/copyDependencies.js';
import clean from './gulp/tasks/clean.js';

// Default task: clean, copy npm deps, prepare CLDR data
gulp.task('default',
  gulp.series(clean, copyDependencies, prepareCldr)
);
