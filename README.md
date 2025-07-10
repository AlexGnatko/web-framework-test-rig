# PHP Web Framework Performance Test Rig

Runs anywhere in Docker, shows the performance of multiple PHP web application
frameworks:

* [EMPS6](https://github.com/AlexGnatko/EMPS6)
* Wordpress
* Laravel
* Lumen
* Slim
* Plain PHP (no framework)

> **[View the results](RESULTS.md)**

## Running locally

`git clone` this repository and run `docker-compose build` and `docker-compose up -d`.

Then, log into the shell of the `test` container and run `./setup`to
do the neccessary `npm install` and also initialize the MySQL databases
that will be needed by EMPS and Wordpress. The EMPS database can stay
empty, but the Wordpress database will have to be initialized on
Wordpress setup.

### Setting up Wordpress and the test plugin

Install a fresh copy of Wordpress into the `www/wordpress` folder.
Keep the `md5test.php` plugin - it will be required for tests.

Patch your PC's `hosts` file with `127.0.0.1 wordpress.test` and
open Wordpress setup in your browser at `http://wordpress.test:84/`.
Then, log into WP admin and enable the `MD5 Test Endpoint` plugin.

Check if `curl http://wordpress.test/test/` works (returns an MD5 hash)
in the shell of the `test` container.

### Setting up the other frameworks

I mostly copied most of them to this repository, minus the `vendor`
folders. Just go to the shell of the `php-dev` container and
run `composer install` in every folder where you can find 
`composer.json`. Check if these work:

* `curl http://laravel.test/test/`
* `curl http://lumen.test/test/`
* `curl http://slim.test/test/`

### Running the test

Just run the `./test` shell script. By default, the test duration
is 30 seconds with a 5-second warmup. You can change that by