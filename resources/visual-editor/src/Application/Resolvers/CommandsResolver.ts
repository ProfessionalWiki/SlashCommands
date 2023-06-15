import { CommandsStore, SLASH_COMMANDS_LIST } from '../../Stores/CommandsStore.ts';
import { CommandsPopup, NO_RESULTS } from '../../Widgets/CommandsPopup.ts';
import { FragmentResolver } from './FragmentResolver.ts';

export interface Command {
	command: string;
	icon: string;
	title: string;
	visible: boolean;
}
export class CommandsResolver {

	public async getCommands( callback: ( commands: Command[] ) => void, search = '' ): Promise<void> {
		let insertCommands = CommandsStore.get( SLASH_COMMANDS_LIST );

		if ( !insertCommands || insertCommands.lenght ) {
			CommandsStore.set( SLASH_COMMANDS_LIST, this.getCommandsFromTheToolbar() );
		}

		insertCommands = await CommandsStore.get( SLASH_COMMANDS_LIST );

		callback( this.filterCommands( [ ...insertCommands ], search ) );
	}

	private getCommandsFromTheToolbar(): Promise<Command[]> {
		return new Promise( ( resolve ) => {
			setTimeout( () => {
				const commandsList = [];

				for ( const groupName of [ 'style', 'insert', 'structure' ] ) {
					const tools = ve.init.target.toolbar.groupsByName[ groupName ].tools;

					Object.keys( tools ).forEach( function ( key ): void {
						const item = tools[ key ];
						if ( item.disabled === false ) {
							commandsList.push( {
								command: key,
								icon: item.icon,
								title: item.title,
								visible: true
							} );
						}
					} );
				}

				resolve( commandsList );
			} );
		} );
	}

	public filterCommands( insertCommands: Command[], search: string ): Command[] {
		if ( search ) {
			insertCommands = insertCommands.filter( ( item ) => {
				return item.title.toLowerCase().includes( search.toLowerCase() );
			} );
		}

		return insertCommands;
	}

	public executeCommandWithElement(
		popup: OO.ui.PopupWidget,
		e: { target: HTMLElement },
		fragmentResolver: FragmentResolver,
		element: HTMLElement = null
	): boolean {
		const currentElement: HTMLElement = element || e.target;

		if ( !OO.ui.contains( popup.$element.get(), currentElement, true ) ) {
			return;
		}

		const $targetEl = $( currentElement );
		const $targetElParent = $targetEl.parents( `.${CommandsPopup.getCommandClassName()}` );

		if (
			$targetEl.hasClass( CommandsPopup.getCommandClassName() ) ||
			$targetElParent.length
		) {
			const className = CommandsPopup.getCommandClassName();
			const $el = $targetEl.hasClass( className ) ? $targetEl : $targetElParent;

			const commandsRegistry = this.getAllCommands();
			const commandName = $el.data( 'command' );

			if ( commandName === NO_RESULTS ) {
				return false;
			}

			if ( Object.prototype.hasOwnProperty.call( commandsRegistry, commandName ) ) {
				const surface = ve.init.target.getSurface();

				if ( fragmentResolver.isSearchFragmentExist() ) {
					fragmentResolver.removeSearchFragment();
				}

				popup.toggle( false );

				setTimeout( () => {
					commandsRegistry[ commandName ].execute( surface );
				} );
			}
		}
		return true;
	}

	private getAllCommands(): object {
		return ve.ui.commandRegistry.registry;
	}

}
