import { CommandsPopup, NO_RESULTS } from '../../Widgets/CommandsPopup';
import { FragmentResolver } from './FragmentResolver';
import type { CommandRegistryInterface, Command } from '@/Commands/CommandRegistry';

export class CommandsResolver {

	public constructor( private readonly commandRegistry: CommandRegistryInterface ) {
	}

	public getCommands( search = '' ): Map<string, Command> {
		if ( search.length ) {
			return this.filterCommands(
				this.commandRegistry.getCommandList(),
				search.toLowerCase()
			);
		}

		return this.commandRegistry.getInitialCommandList();
	}

	private filterCommands(
		commandList: Map<string, Command>,
		search: string
	): Map<string, Command> {
		return new Map(
			[ ...commandList ]
				.filter( ( [ , command ] ) => {
					return command.label.toLowerCase().includes( search );
				} )
				.sort( ( [ , commandA ], [ , commandB ] ): number => {
					if (
						commandA.label.toLowerCase().startsWith( search ) &&
						commandB.label.toLowerCase().startsWith( search )
					) {
						return 0;
					}
					if ( commandB.label.toLowerCase().startsWith( search ) ) {
						return 1;
					}
					return -1;
				} )
		);
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
