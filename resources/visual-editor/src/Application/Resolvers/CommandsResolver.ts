import { CommandsPopup, NO_RESULTS } from '../../Widgets/CommandsPopup';
import { FragmentResolver } from './FragmentResolver';

export interface Command {
	command: string;
	icon: string;
	title: string;
	visible: boolean;
}
export class CommandsResolver {

	public async getCommands( search = '' ): Promise<Command[]> {
		return this.filterCommands(
			await this.getCommandsFromVisualEditor( search ),
			search
		);
	}

	private async getCommandsFromVisualEditor( search: string ): Promise<Command[]> {
		if ( search.length ) {
			return this.getAllCommandsFromVisualEditor();
		}

		return await this.getCommandsFromTheToolbar();
	}

	private getAllCommandsFromVisualEditor(): Command[] {
		const commandList = [];
		const allCommands = this.getAllCommands();

		for ( const allCommandsKey in allCommands ) {
			const command = allCommands[ allCommandsKey ];
			commandList.push( {
				command: allCommandsKey,
				icon: this.getCommandIcon( allCommandsKey ),
				title: command.name,
				visible: true
			} );
		}

		return commandList;
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

				return false;
			}
		}
		return true;
	}

	private getAllCommands(): object {
		return ve.ui.commandRegistry.registry;
	}

	private getCommandIcon( commandName: string ): string {
		return ve.ui.contextItemFactory.registry?.[ commandName ]?.static?.icon ?? 'noIcon';
	}

	public focusFirstCommand( popup: OO.ui.PopupWidget ): void {
		setTimeout( () => {
			const elements = popup.$body.find( '.commands-list .insert-command' );
			elements.removeClass( 'selected' );
			elements.first().addClass( 'selected' );
		} );
	}
}
