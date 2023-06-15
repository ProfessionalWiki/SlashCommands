export const START_FRAGMENT = 'startFragment';
export const REPLACE_FRAGMENT = 'replaceFragment';
export const SEARCH_FRAGMENT = 'searchFragment';
export const INSERT_COMMANDS_LIST = 'insertCommandsList';
export const COMMANDS_LIST_LENGHT = 'commandsListLenght';
export const COUNT_NO_RESULTS_TRYING = 'countNoResultsTrying';
export const WRAP_BLOCK_ID = 'wrapBlockID';

export interface CommandsStoreObject {
	get( key: string ): typeof ve.dm.SurfaceFragment|number|string;
	set( key: string, fragment: typeof ve.dm.SurfaceFragment|number|string ): void;
	clear( key: string ): void;
}

export const CommandsStore: CommandsStoreObject = ( function createStore() {
	const state = {
		startFragment: null,
		replaceFragment: null,
		searchFragment: null,
		insertCommandsList: null,
		wrapBlockID: null,
		commandsListLenght: 0,
		countNoResultsTrying: 0
	};

	function get( key: string ): typeof ve.dm.SurfaceFragment {
		if ( Object.prototype.hasOwnProperty.call( state, key ) ) {
			return state[ key ];
		}
		return null;
	}

	function set( key: string, fragment: typeof ve.dm.SurfaceFragment ): void {
		if ( !Object.prototype.hasOwnProperty.call( state, key ) ) {
			throw new Error( 'Store does not have the value key' );
		}
		state[ key ] = fragment;
	}

	function clear( key: string ): void {
		if ( !Object.prototype.hasOwnProperty.call( state, key ) ) {
			throw new Error( 'Store does not have the value key' );
		}
		state[ key ] = null;
	}

	return {
		get,
		set,
		clear
	};
}() );
