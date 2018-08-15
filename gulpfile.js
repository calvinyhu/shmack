// Dependencies
const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const sass = require('gulp-sass')
const minifyCSS = require('gulp-clean-css')
const changed = require('gulp-changed')

// Tasks
const WATCH_SCSS = 'watch_scss'
const COMPILE_SCSS = 'compile-scss'

// Find files
getFiles = (dir, filter, found) => {
    const files = fs.readdirSync(dir)
    
    files.forEach(file => {
        const filename = path.join(dir, file)
        const stat = fs.lstatSync(filename)

        if (stat.isDirectory())
            getFiles(filename, filter, found)
        else if (filename.includes(filter))
            found.push(filename)
    })
}

// Get SCSS files
let scss_files = []
getFiles('./src', '.scss', scss_files)

// Compile SCSS
gulp.task(COMPILE_SCSS, () => {
    scss_files.forEach(file => {
        let dir = path.dirname(file)
        gulp.src(path.join(dir, '*.scss'))
            .pipe(sass().on('error', sass.logError))
            .pipe(minifyCSS())
            .pipe(changed(dir))
            .pipe(gulp.dest(dir))
    })
})

// Watch SCSS
gulp.task(WATCH_SCSS, () => {
    gulp.watch('./src/**/*.scss', [COMPILE_SCSS])
})

// Default task
gulp.task('default', [WATCH_SCSS])
