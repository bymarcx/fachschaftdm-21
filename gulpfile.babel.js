import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import del from 'del';
import webpack from 'webpack-stream';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import zip from "gulp-zip";
import info from "./package.json";
import replace from "gulp-replace";
import named from 'vinyl-named';

const PRODUCTION = yargs.argv.prod;

// *** COMPRESS OUR SCSS STYLES *** //
export const CompressStyles = () => {
    return src(['src/scss/bundle.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(PRODUCTION, postcss([ autoprefixer ])))
        .pipe(gulpif(PRODUCTION, cleanCss({compatibility:'ie8'})))
        .pipe(dest('dist/css'));
}

// *** BUNDLE OUR SCRIPTS *** //
export const BundleScripts = () => {
    return src(['src/js/FooterJS/bundleFooter.js', 'src/js/HeaderJS/bundleHeader.js'])
        .pipe(named())
        .pipe(webpack({
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            },
            mode: PRODUCTION ? 'production' : 'development',
            devtool: !PRODUCTION ? 'inline-source-map' : false,
            output: {
                filename: '[name].js'
            },
        }))
        .pipe(dest('dist/js'));
}

// *** COPY OUR SOURCE FILES WHICH ARE NOT SCSS OR JS  *** //
export const copySrcFiles = () => {
    return src(['src/**/*','!src/{js,scss}','!src/{js,scss}/**/*'])
        .pipe(dest('dist'));
}

// *** DELETE OUR DIST FOLDER *** //
export const cleanDist = () => del(['dist']);

// *** WATCH FOR CHANGES IN OUR SCSS OR JS FOLDER *** //
export const watchForChanges = () => {
    watch('src/scss/**/*.scss', CompressStyles);
    watch('src/js/**/*.js',BundleScripts);
    watch(['src/**/*','!src/{img,js,scss}','!src/{img,js,scss}/**/*'], copySrcFiles);
}

// *** COMPRESS ALL FILES FOR PRODUCTION *** //
export const compress = () => {
    return src([
        "**/*",
        "!node_modules{,/**}",
        "!bundled{,/**}",
        "!src{,/**}",
        "!.babelrc",
        "!.gitignore",
        "!gulpfile.babel.js",
        "!package.json",
        "!package-lock.json",
    ])
        .pipe(zip(`${info.name}.zip`))
        .pipe(dest('bundled'));
};

// *** TIME TO RUN EVERYTHING *** //
export const dev = series(cleanDist, parallel(CompressStyles, copySrcFiles, BundleScripts), watchForChanges)
export const build = series(cleanDist, parallel(CompressStyles, copySrcFiles, BundleScripts), compress)
export default dev;