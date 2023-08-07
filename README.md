# Slash Commands

MediaWiki extension that adds "slash commands" to the Visual Editor.

**Table of Contents**

- [Installation](#installation)
- [Development](#development)
- [Release notes](#release-notes)

## Installation

Platform requirements:

* [MediaWiki] 1.39 or later (tested with 1.39)
* [PHP] is NOT used by this extension, so its version does not matter

Installation instructions:

* Clone extension into `extensions/SlashCommands/`
* Add `wfLoadExtension( 'SlashCommands' );` to `LocalSettings.php`

## Development

* Setup node environment: `make visual-editor-install`
* Build the assets: `make visual-editor-build`
* Lint (and reformat): `make visual-editor-lint`
* To add production assets to git: `make add-production-assets`

## Release notes

### Version 1.0.0 - 2023-06-15

Initial release

* Support for MediaWiki 1.39
* Support for PHP 7.4 and above
* Slash command menu with formatting, list, and insert commands

[Professional.Wiki]: https://professional.wiki
[MediaWiki]: https://www.mediawiki.org
[PHP]: https://www.php.net
[Composer]: https://getcomposer.org
[Composer install]: https://professional.wiki/en/articles/installing-mediawiki-extensions-with-composer
[LocalSettings.php]: https://www.pro.wiki/help/mediawiki-localsettings-php-guide
