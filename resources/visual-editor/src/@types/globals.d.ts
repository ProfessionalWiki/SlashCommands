/* eslint-disable */
/// <reference types="jquery" />
/// <reference types="types-mediawiki" />
/// <reference types="oojs-ui" />
/* eslint-enable */

import type { MediaWiki } from './mediawiki/MwWindow';

declare global {
	interface Window {
		mw: MediaWiki;
	}

	// TODO: no types for VisualEditor
	namespace ve {
		namespace ui {
			const Surface: any;
			const commandRegistry: any;
			const sequenceRegistry: any;
			const Command: any;
			const Sequence: any;
			const Trigger: any;
			const triggerRegistry: any;
			const CommandsTool: any;
			const toolFactory: any;
			const Tool: any;
		}

		namespace dm {
			const SurfaceFragment: any;
			const modelRegistry: any;
			const TextStyleAnnotation: any;
		}

		namespace ce {
			const annotationFactory: any;
			const TextStyleAnnotation: any;
		}
		const Range: any;
		const init: any;
	}
}
