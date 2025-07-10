const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');
const ss = require('simple-statistics');
const { argv } = require('node:process');

module.exports = function(core) {
    core.targets = {};
    core.sorted_results = [];
    core.started_dt = 0;
    core.seconds = 30;
    core.warmup = 5;
    core.over = false;
    core.do_test = () => {
        const filePath = './targets.json';

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log('targets.json: The file does not exist.');
                return;
            }
            console.log('targets.json: The file exists.');
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                let targets = JSON.parse(data);
                console.log("Loaded " + Object.keys(targets).length + " targets");
                core.targets = targets;
                core.start_test();
            } catch (err) {
                console.error(err);
            }
        });
    };
    core.start_test = () => {
        const args = argv.slice(2);
        if (args.length > 0) {
            let arg = args.shift();
            let numeric = parseInt(arg);
            if (numeric > 0) {
                core.seconds = numeric;
            }
            if (args.length > 0) {
                arg = args.shift();
                numeric = parseInt(arg);
                if (numeric > 0) {
                    core.warmup = numeric;
                }
            }
        }
        console.log("Starting the test!");
        core.started_dt = Date.now();
        console.log("Current time: " + core.started_dt + ", the test will be over in " + core.seconds + " seconds from now!");
        console.log("Warmup: " + core.warmup);
        setTimeout(core.check_time, 1000);
        for (const index in core.targets) {
            core.test_target(index);
        }
    };
    core.test_target = (index) => {
        const target = core.targets[index];
        if (target.disabled) {
            return;
        }
        if (target.attempts === undefined) {
            target.attempts = 0;
        }
        if (target.success === undefined) {
            target.success = 0;
        }
        if (target.failure === undefined) {
            target.failure = 0;
        }
        const total_elapsed = Math.floor((Date.now() - core.started_dt) / 1000);
        target.attempts++;

        let number = target.attempts;
        const hash = crypto.createHash('md5').update(number.toString()).digest('hex');
        const start = Date.now();
        axios.get(target.url + "?number=" + number).then(response => {
            const elapsed = Date.now() - start;
            if (core.over) {
                // if it's over - it's over
                return;
            }
            const data = response.data;
            if (data == hash) {
                //console.log(index, " - success");
                if (total_elapsed > core.warmup) {
                    target.times = target.times || [];
                    target.times.push(elapsed);
                    target.success++;
                }

            } else {
                //console.log(index, " - failure");
                if (total_elapsed > core.warmup) {
                    target.failure++;
                }
            }
            setTimeout(core.test_target, 100, index);
        }).catch(error => {
            if (core.over) {
                // if it's over - it's over
                return;
            }
            //console.log(index, " - failure (axios exception)");
            if (total_elapsed > core.warmup) {
                target.failure++;
            }
            setTimeout(core.test_target, 100, index);
        });
    };
    core.stats_for = (times) => {
        if (!times || !times.length) return null;

        const sorted = [...times].sort((a, b) => a - b);
        const average = times.reduce((sum, val) => sum + val, 0) / times.length;

        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];

        const counts = {};
        times.forEach(val => counts[val] = (counts[val] || 0) + 1);
        const maxCount = Math.max(...Object.values(counts));
        const mode = Object.entries(counts)
            .filter(([_, c]) => c === maxCount)
            .map(([v]) => Number(v));

        const stddev = Math.sqrt(
            times.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / times.length
        );

        const percentile = (p) => {
            const index = Math.floor((p / 100) * sorted.length);
            return sorted[index];
        };

        const strata = [];
        const step = Math.floor(sorted.length / 10);
        for (let i = 0; i < 10; i++) {
            const slice = sorted.slice(i * step, (i + 1) * step);
            if (slice.length === 0) continue;
            strata.push({
                label: `${i * 10}-${(i + 1) * 10}%`,
                min: slice[0],
                max: slice[slice.length - 1],
                avg: (slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(2),
            });
        }

        return {
            average: average.toFixed(2),
            median,
            mode,
            stddev: stddev.toFixed(2),
            p90: percentile(90),
            p99: percentile(99),
            strata
        };
    };
    core.generate_results = (target) => {
        lines = [];
        lines.push(`## ${target.name}`);
        lines.push('');
        lines.push(`- **URL**: \`${target.url}\``);
        lines.push(`- **Total Requests**: ${target.attempts}`);
        lines.push(`- **Successes**: ${target.success}`);
        lines.push(`- **Failures**: ${target.failure}`);
        lines.push('');

        const stats = target.stats;

        if (stats) {
            lines.push(`### Response Time Statistics (ms)`);
            lines.push('');
            lines.push(`- **Average**: ${stats.average}`);
            lines.push(`- **Median**: ${stats.median}`);
            lines.push(`- **Mode**: ${stats.mode.join(', ')}`);
            lines.push(`- **Standard Deviation**: ${stats.stddev}`);
            lines.push(`- **90th Percentile**: ${stats.p90}`);
            lines.push(`- **99th Percentile**: ${stats.p99}`);
            lines.push('');
            lines.push(`#### Response Time Strata`);
            lines.push('');
            lines.push(`| Percentile Range | Min | Max | Avg |`);
            lines.push(`|------------------|-----|-----|-----|`);
            for (const s of stats.strata) {
                lines.push(`| ${s.label} | ${s.min} | ${s.max} | ${s.avg} |`);
            }
        } else {
            lines.push(`_No timing data available._`);
        }

        lines.push('');
        lines.push('---');
        lines.push('');

        return lines.join('\n');
    };
    core.quick_results = () => {
        core.sorted_results = Object.entries(core.targets)
            .sort(([, a], [, b]) => b.success - a.success);
        lines = [];
        lines.push('');
        lines.push(`## Top-Performing Web Frameworks`);
        lines.push('');
        lines.push(`| Framework | Successes | Failures | Response time mode |`);
        lines.push(`|-----------|-----------|----------|--------------------|`);
        //console.log(core.sorted_results);
        for (const x of core.sorted_results) {
            const target = x[1];
            const stats = core.stats_for(target.times);
            target.stats = stats;
            //console.log("stats", stats,target.times, target);
            lines.push(`| ${target.name} | ${target.success} | ${target.failure} | ${stats.mode.join(', ')} |`);
        }
        lines.push('');
        lines.push('---');
        lines.push('');
        return lines.join('\n');
    };

    core.check_time = () => {
        if (core.over) {
            return;
        }
        setTimeout(core.check_time, 1000);
        const elapsed = Date.now() - core.started_dt;
        const seconds = Math.floor(elapsed / 1000);
        let wu = "";
        if (elapsed/1000 <= core.warmup) {
            wu = " (warmup)";
        }
        console.log(seconds + " of " + core.seconds + wu);

        if (elapsed >= core.seconds * 1000) {
            core.over = true;
            console.log("The test is over!");
            console.log("Results", core.targets);
            console.log(core.quick_results());
            for (const index in core.targets) {
                const target = core.targets[index];
                if (target.disabled) {
                    continue;
                }
                console.log(core.generate_results(target));
            }
        }
    };
}
