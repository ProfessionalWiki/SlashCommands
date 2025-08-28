# Slash Commands

MediaWiki extension that adds "slash commands" to the Visual Editor.

[![Image](https://github.com/user-attachments/assets/63d28c5d-99a2-45eb-b311-31ece4b6a50a)](https://professional.wiki/en/extension/slash-commands)

[Professional Wiki] created this extension and provides [MediaWiki Development], [MediaWiki Hosting],
and [MediaWiki Consulting] services.

**Table of Contents**

- [Usage documentation](https://professional.wiki/en/extension/slash-commands#Usage)
- [Installation](#installation)
- [Development](#development)
- [Release notes](#release-notes)

## Installation

Platform requirements:

* [MediaWiki] 1.39 or later (tested with 1.39)
* [VisualEditor] 1.39 or later (tested with 1.39)
* [PHP] is NOT used by this extension, so its version does not matter

Installation instructions:

* Clone extension into `extensions/SlashCommands/`
* Add `wfLoadExtension( 'SlashCommands' );` to [LocalSettings.php]

## Development

* Setup node environment: `make visual-editor-install`
* Build the assets: `make visual-editor-build`
* Lint (and reformat): `make visual-editor-lint`
* To add production assets to git: `make add-production-assets`

## Release notes

### Version 1.1.0 - 2023-08-16

* Added link and other commands
* Added plugin system for registering custom slash commands
* Fixed UI bugs

### Version 1.0.0 - 2023-06-15

Initial release — [Release announcement](https://www.pro.wiki/news/Slash-Commands-MediaWiki)

* Support for MediaWiki 1.39
* Support for PHP 7.4 and above
* Slash command menu with formatting, list, and insert commands

[Professional Wiki]: https://professional.wiki
[MediaWiki Hosting]: https://pro.wiki
[MediaWiki Development]: https://professional.wiki/en/mediawiki-development
[MediaWiki Consulting]: https://professional.wiki/en/mediawiki-consulting-services
[MediaWiki]: https://www.mediawiki.org
[VisualEditor]: https://www.mediawiki.org/wiki/Extension:VisualEditor
[PHP]: https://www.php.net
[LocalSettings.php]: https://www.pro.wiki/help/mediawiki-localsettings-php-guide
