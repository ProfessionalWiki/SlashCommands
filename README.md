# Slash Commands

**Table of Contents**

- [Installation](#installation)
- [PHP Configuration](#php-configuration)
- [Development](#development)
- [Release notes](#release-notes)

## Installation

Platform requirements:

* [PHP] 8.1 or later (tested up to 8.1)
* [MediaWiki] 1.39 or later (tested up to 1.39)

The recommended way to install Slash Commands is using [Composer] with
[MediaWiki's built-in support for Composer][Composer install].

On the commandline, go to your wikis root directory. Then run these two commands:

```shell script
COMPOSER=composer.local.json composer require --no-update professional-wiki/slash-commands:~1.0
```
```shell script
composer update professional-wiki/slash-commands --no-dev -o
```

Then enable the extension by adding the following to the bottom of your wikis [LocalSettings.php] file:

```php
wfLoadExtension( 'SlashCommands' );
```

You can verify the extension was enabled successfully by opening your wikis Special:Version page.

## PHP Configuration

Configuration can be changed via [LocalSettings.php].

## Development

### Initial setup

Use https://github.com/ProfessionalWiki/NeoWiki-Docker

### Compiling TypeScript

You can use the `Makefile` by running make commands in the `SlashCommands` directory.

* `make js`: Run TypeScript compiler

### Running tests and CI checks

You can use the `Makefile` by running make commands in the `SlashCommands` directory.

* `make ci`: Run everything
* `make test`: Run all tests
* `make cs`: Run all style checks and static analysis
* `make lint`: Run all style checks and static analysis (locally)
* `make lint-docker`: Run all style checks and static analysis (Docker)

Alternatively, you can execute commands from the MediaWiki root directory:

* PHPUnit: `php tests/phpunit/phpunit.php -c extensions/SlashCommands/`
* Style checks: `vendor/bin/phpcs -p -s --standard=extensions/SlashCommands/phpcs.xml`
* PHPStan: `vendor/bin/phpstan analyse --configuration=extensions/SlashCommands/phpstan.neon --memory-limit=2G`
* Psalm: `php vendor/bin/psalm --config=extensions/SlashCommands/psalm.xml`
* Stylesheet and JavaScript linting: `npm run test`

### Visual Editor development

* Setup node environment: `make visual-editor-install`
* Build the assets: `make visual-editor-build`
* Lint (and reformat): `make visual-editor-lint`

## Release notes

### Version 1.0.0 - not yet released

* TODO
* Internationalization support
* Support for PHP from 8.1 up to 8.2
* Support for MediaWiki 1.39

[Professional.Wiki]: https://professional.wiki
[MediaWiki]: https://www.mediawiki.org
[PHP]: https://www.php.net
[Composer]: https://getcomposer.org
[Composer install]: https://professional.wiki/en/articles/installing-mediawiki-extensions-with-composer
[LocalSettings.php]: https://www.pro.wiki/help/mediawiki-localsettings-php-guide
