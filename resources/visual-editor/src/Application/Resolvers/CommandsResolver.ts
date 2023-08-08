import { CommandsPopup, NO_RESULTS } from '../../Widgets/CommandsPopup';
import { FragmentResolver } from './FragmentResolver';

export interface Command {
	command: string;
	icon: string;
	title: string;
}

interface Config {
	Predefined: Command[];
	Additional: Command[];
}

export class CommandsResolver {

	public getCommands( search = '' ): Command[] {
		return this.filterCommands(
			this.getConfiguredCommands( search ),
			search
		);
	}

	private getConfiguredCommands( search: string ): Command[] {
		if ( search.length ) {
			return this.getCombinedCommands();
		}

		return this.getPredefinedCommands();
	}

	private getPredefinedCommands(): Command[] {
		const config = mw.config.get( 'SlashCommands' ) as Config;
		return config?.Predefined ?? [];
	}

	private getCombinedCommands(): Command[] {
		const config = mw.config.get( 'SlashCommands' ) as Config;
		const predefinedCommands = this.getPredefinedCommands();
		const additionalCommands = config?.Additional ?? [];

		return [ ...predefinedCommands, ...additionalCommands ];
	}

	public filterCommands( insertCommands: Command[], search: string ): Command[] {
		if ( search ) {
			insertCommands = insertCommands.filter( ( item ) => {
				return item.title.toLowerCase().includes( search.toLowerCase() );
			} ).sort( ( a, b ): number => {
				if ( a.command.startsWith( search ) && b.command.startsWith( search ) ) {
					return 0;
				}
				if ( b.command.startsWith( search ) ) {
					return 1;
				}
				return -1;
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

	public focusFirstCommand( popup: OO.ui.PopupWidget ): void {
		setTimeout( () => {
			const elements = popup.$body.find( '.commands-list .insert-command' );
			elements.removeClass( 'selected' );
			elements.first().addClass( 'selected' );
		} );
	}
}
