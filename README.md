# Slash Commands

MediaWiki extension that adds "slash commands" to the Visual Editor.

**Table of Contents**

- [Installation](#installation)
- [Development](#development)
- [Release notes](#release-notes)

## Installation

Platform requirements:

* [PHP] 7.4 or later (tested with 8.1)
* [MediaWiki] 1.39 or later (tested with 1.39)

Installation instructions:

* Clone extension into `extensions/SlashCommands/`
* Add `wfLoadExtension( 'SlashCommands' );` to `LocalSettings.php`

## Development

* Setup node environment: `make visual-editor-install`
* Build the assets: `make visual-editor-build`
* Lint (and reformat): `make visual-editor-lint`
* To add production assets to git: `make add-production-assets`

## Release notes

### Version 1.0.0 - not yet released

* TODO

[Professional.Wiki]: https://professional.wiki
[MediaWiki]: https://www.mediawiki.org
[PHP]: https://www.php.net
[Composer]: https://getcomposer.org
[Composer install]: https://professional.wiki/en/articles/installing-mediawiki-extensions-with-composer
[LocalSettings.php]: https://www.pro.wiki/help/mediawiki-localsettings-php-guide
