import type { RestResponse } from 'types-mediawiki/mw/Rest.d.ts';

/** @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-property-defaultOptions */
interface ApiOptions {
	parameters: any;
	ajax: JQuery.jqXHR;
	useUse: boolean;
}

type MwApiParameterPrimitive = string | number | boolean | undefined;
export type MwApiParameter = MwApiParameterPrimitive | readonly MwApiParameterPrimitive[];
export type MwApiParameters = Record<string, MwApiParameter>;

/** @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api */
export interface MwApi {
	get( parameters: MwApiParameters, ajaxOptions?: unknown ): JQuery.Promise<any>;
}

/** @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Rest-property-defaultOptions */
interface RestOptions {
	ajax: JQuery.jqXHR;
}

export interface MwRest {
	/** @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Rest-method-post */
	post(
		path: string,
		body: Record<string, any>,
		headers?: Record<string, any>
	): JQuery.Promise<RestResponse>;
}

export interface MediaWiki {
	/** @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user */
	user: {
		getName: () => string|null;
		getRights: ( callback?: ( rights: string[] ) => any ) => JQuery.Promise<string[]>;
	};

	/** @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util */
	util: {
		wikiScript: ( str: string ) => string;
		getUrl: ( str: string, params?: Record<string, any> ) => string;
	};

	/** @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api */
	Api: new( options?: ApiOptions ) => MwApi;

	/** @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Rest */
	Rest: new( options?: RestOptions ) => MwRest;

	/** @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-property-config */
	config: typeof mw.config;

	/** @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader */
	loader: {
		using(
			dependencies: string[] | string,
			ready?: ( require: ( module: string ) => any ) => any,
			error?: () => any
		): JQuery.Promise<any>;
	};
}
