<?php

namespace ProfessionalWiki\SlashCommands\EntryPoints;

use OutputPage;

class MediaWikiHooks
{
	public static function onMakeGlobalVariablesScript( array &$vars, OutputPage $out ): void {
		global $scCommands;
		$vars['SlashCommands'] = $scCommands;
	}
}
