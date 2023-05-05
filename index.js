const program = require('commander');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const mkdirp = require('mkdirp');

program
    .command('archive <dir>')
    .action((dir) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                throw err;
            }
            let movedCount = 0;
            console.info(`${files.length} files found.`);
            const thisYear = dayjs().year();
            files.forEach(fileName => {
                const filePath = path.join(dir, fileName);
                const stat = fs.statSync(filePath);
                if (stat.isFile()) {
                    const fileLastModifiedYear = dayjs(stat.mtime).year();
                    if (thisYear !== fileLastModifiedYear) {
                        const archiveDir = path.join(dir, `${fileLastModifiedYear}`);
                        mkdirp.sync(archiveDir);
                        fs.renameSync(
                            filePath,
                            path.join(archiveDir, fileName)
                        );
                        ++movedCount;
                    }
                }
            });
            console.info(`${movedCount} files archived.`);
        });
    });

program
    .parse(process.argv);
