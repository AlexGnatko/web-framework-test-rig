# PHP Web Frameworks Performance Test Results

## Test run

I ran the test locally in Docker. My PC is an AMD Ryzen 5 7600X 6-Core Processor at 4.70 GHz with 64GB RAM.

The settings were as set in this GitHub repository (read Dockerfiles).

The duration of the test was **130** seconds with a **10-second** warm-up.

## Top-Performing Web Frameworks

Of course, the top of the list is `Plain PHP`, because the
best framework is no framework.

| Framework              | Successes | Failures | Response time (mode*) |
|------------------------|-----------|----------|-----------------------|
| Plain PHP              | 1012 | 0        | 2                     |
| EMPS (fast controller) | 884 | 0        | 18                    |
| Lumen**                | 837 | 0        | 8                     |
| EMPS (regular)         | 779 | 0        | 33                    |
| Slim                   | 441 | 0        | 120                   |
| Laravel                | 254 | 5***     | 76                    |
| Wordpress****          | 239 | 0        | 281                   |

\* mode means the most frequent response time

\** Lumen actually outperformed EMPS (fast), but it had some
awful sudden drops in performance for some reason. It performed
much better when there was no setting for `pm.max_requests`
in `php-fpm`. Lumen certainly performs better if the `php-fpm`
worker never dies/restarts.

\*** Laravel is notorious for refusing to respond to requests when
a certain cap in the number of requests from a host is reached. That
HTTP request throttling is enabled from the box, I didn't turn it off.

\**** yes, this isn't really a web application framework, but
it's included here for dramatic effect.

---

## Plain PHP

- **URL**: `http://emps.test/plain.php`
- **Total Requests**: 1112
- **Successes**: 1012
- **Failures**: 0

### Response Time Statistics (ms)

- **Average**: 5.58
- **Median**: 2
- **Mode**: 2
- **Standard Deviation**: 19.23
- **90th Percentile**: 5
- **99th Percentile**: 72

#### Response Time Strata

| Percentile Range | Min | Max | Avg |
|------------------|-----|-----|-----|
| 0-10% | 0 | 1 | 0.99 |
| 10-20% | 1 | 2 | 1.04 |
| 20-30% | 2 | 2 | 2.00 |
| 30-40% | 2 | 2 | 2.00 |
| 40-50% | 2 | 2 | 2.00 |
| 50-60% | 2 | 2 | 2.00 |
| 60-70% | 2 | 3 | 2.66 |
| 70-80% | 3 | 3 | 3.00 |
| 80-90% | 3 | 5 | 3.64 |
| 90-100% | 5 | 202 | 31.44 |

> Surely, if the best part is no part, then the best framework
> is no framework. At least performance-wise.

---

## EMPS (fast controller)

- **URL**: `http://emps.test/test/`
- **Total Requests**: 973
- **Successes**: 884
- **Failures**: 0

### Response Time Statistics (ms)

- **Average**: 22.28
- **Median**: 18
- **Mode**: 18
- **Standard Deviation**: 46.36
- **90th Percentile**: 23
- **99th Percentile**: 134

#### Response Time Strata

| Percentile Range | Min | Max | Avg |
|------------------|-----|-----|-----|
| 0-10% | 10 | 15 | 13.26 |
| 10-20% | 15 | 16 | 15.31 |
| 20-30% | 16 | 17 | 16.19 |
| 30-40% | 17 | 17 | 17.00 |
| 40-50% | 17 | 18 | 17.92 |
| 50-60% | 18 | 19 | 18.55 |
| 60-70% | 19 | 20 | 19.44 |
| 70-80% | 20 | 21 | 20.51 |
| 80-90% | 21 | 23 | 22.08 |
| 90-100% | 23 | 170 | 40.48 |

> EMPS6 in "fast" mode. It means that the `test` controller is included
> into the `EMPS_FAST` list, meaning that EMPS skips some unneeded 
> initializations if the request URI starts with `/test/`.
---

## EMPS (regular)

- **URL**: `http://emps.test/test-slow/`
- **Total Requests**: 856
- **Successes**: 779
- **Failures**: 0

### Response Time Statistics (ms)

- **Average**: 41.56
- **Median**: 35
- **Mode**: 33
- **Standard Deviation**: 85.87
- **90th Percentile**: 43
- **99th Percentile**: 165

#### Response Time Strata

| Percentile Range | Min | Max | Avg |
|------------------|-----|-----|-----|
| 0-10% | 25 | 30 | 28.13 |
| 10-20% | 30 | 31 | 30.65 |
| 20-30% | 31 | 33 | 32.23 |
| 30-40% | 33 | 34 | 33.19 |
| 40-50% | 34 | 35 | 34.21 |
| 50-60% | 35 | 36 | 35.40 |
| 60-70% | 36 | 38 | 36.70 |
| 70-80% | 38 | 40 | 38.60 |
| 80-90% | 40 | 42 | 40.81 |
| 90-100% | 42 | 120 | 49.53 |

> Regular EMPS6 with no optimizations or skipped initializations.

---

## Laravel

- **URL**: `http://laravel.test/test/`
- **Total Requests**: 287
- **Successes**: 254
- **Failures**: 5

### Response Time Statistics (ms)

- **Average**: 352.03
- **Median**: 76
- **Mode**: 76
- **Standard Deviation**: 760.87
- **90th Percentile**: 1615
- **99th Percentile**: 4729

#### Response Time Strata

| Percentile Range | Min | Max | Avg |
|------------------|-----|-----|-----|
| 0-10% | 35 | 63 | 46.60 |
| 10-20% | 64 | 69 | 67.04 |
| 20-30% | 69 | 71 | 69.84 |
| 30-40% | 71 | 74 | 73.08 |
| 40-50% | 74 | 76 | 75.36 |
| 50-60% | 76 | 79 | 77.60 |
| 60-70% | 79 | 83 | 80.80 |
| 70-80% | 83 | 90 | 86.00 |
| 80-90% | 91 | 1599 | 588.00 |
| 90-100% | 1601 | 1796 | 1666.68 |

> Just a regular Laravel setup out of the box.

---

## Lumen

- **URL**: `http://lumen.test/test/`
- **Total Requests**: 923
- **Successes**: 837
- **Failures**: 0

### Response Time Statistics (ms)

- **Average**: 32.93
- **Median**: 9
- **Mode**: 8
- **Standard Deviation**: 155.96
- **90th Percentile**: 13
- **99th Percentile**: 419

#### Response Time Strata

| Percentile Range | Min | Max | Avg |
|------------------|-----|-----|-----|
| 0-10% | 4 | 6 | 5.61 |
| 10-20% | 6 | 8 | 7.14 |
| 20-30% | 8 | 8 | 8.00 |
| 30-40% | 8 | 9 | 8.12 |
| 40-50% | 9 | 9 | 9.00 |
| 50-60% | 9 | 10 | 9.10 |
| 60-70% | 10 | 10 | 10.00 |
| 70-80% | 10 | 11 | 10.19 |
| 80-90% | 11 | 12 | 11.23 |
| 90-100% | 13 | 428 | 164.41 |

> Just a regular Lumen setup out of the box. This is really fast,
> it mostly outperformed EMPS in fast mode. But Lumen is only
> good for HTTP APIs and microservices, you wouldn't be able to
> create a meaningful website or a web app with it. Besides that,
> the authors are currently recommending to avoid using Lumen for
> new projects.

---

## Slim

- **URL**: `http://slim.test/test/`
- **Total Requests**: 488
- **Successes**: 441
- **Failures**: 0

### Response Time Statistics (ms)

- **Average**: 157.92
- **Median**: 117
- **Mode**: 120
- **Standard Deviation**: 213.30
- **90th Percentile**: 145
- **99th Percentile**: 488

#### Response Time Strata

| Percentile Range | Min | Max | Avg |
|------------------|-----|-----|-----|
| 0-10% | 92 | 104 | 100.34 |
| 10-20% | 104 | 108 | 106.59 |
| 20-30% | 108 | 111 | 109.77 |
| 30-40% | 111 | 114 | 112.52 |
| 40-50% | 114 | 117 | 115.41 |
| 50-60% | 117 | 120 | 118.34 |
| 60-70% | 120 | 122 | 120.82 |
| 70-80% | 122 | 128 | 124.34 |
| 80-90% | 128 | 145 | 134.64 |
| 90-100% | 145 | 1543 | 457.36 |

> This is a real discouragement, a framework named "Slim" that is
> supposed to be slim, is ahead of only Wordpress.

---

## Wordpress

- **URL**: `http://wordpress.test/test/`
- **Total Requests**: 263
- **Successes**: 239
- **Failures**: 0

### Response Time Statistics (ms)

- **Average**: 395.40
- **Median**: 284
- **Mode**: 281
- **Standard Deviation**: 448.05
- **90th Percentile**: 689
- **99th Percentile**: 3432

#### Response Time Strata

| Percentile Range | Min | Max | Avg |
|------------------|-----|-----|-----|
| 0-10% | 111 | 260 | 185.00 |
| 10-20% | 260 | 267 | 263.30 |
| 20-30% | 268 | 275 | 271.17 |
| 30-40% | 275 | 280 | 276.87 |
| 40-50% | 280 | 282 | 281.13 |
| 50-60% | 282 | 287 | 285.04 |
| 60-70% | 289 | 298 | 293.30 |
| 70-80% | 299 | 326 | 311.39 |
| 80-90% | 327 | 664 | 437.70 |
| 90-100% | 669 | 760 | 708.26 |

> This is expected. On every request, this CMS reads its InnoDB database
> to check dozens of settings, plugins, themes, etc. This really
> takes some time, even for the simplest of requests.

---