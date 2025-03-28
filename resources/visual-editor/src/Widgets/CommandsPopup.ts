import {
	COMMANDS_LIST_LENGHT,
	CommandsStore, COUNT_NO_RESULTS_TRYING,
	REPLACE_FRAGMENT, SEARCH_FRAGMENT, START_FRAGMENT, WRAP_BLOCK_ID
} from '../Stores/CommandsStore';
import { CommandsPopupFactory, CommandsPopupWidget } from './Factories/CommandsPopupFactory';
import { FragmentResolver } from '../Application/Resolvers/FragmentResolver';
import { CommandsResolver } from '../Application/Resolvers/CommandsResolver';
import { Command } from '@/Commands/CommandRegistry';

const COMMAND_CLASS_NAME = 'insert-command';
export const NO_RESULTS = 'no-results';

export class CommandsPopup {

	private readonly popup: OO.ui.PopupWidget;
	private readonly className: string = 'insert-commands-list-wrap';
	public readonly commandClassName: string = COMMAND_CLASS_NAME;

	public constructor(
		private readonly fragmentResolver: FragmentResolver,
		private readonly commandsResolver: CommandsResolver
	) {
		this.popup = CommandsPopupFactory.create( {
			$content: $( '<div class="commands-list"></div>' ),
			classes: [ this.className ],
			hideCloseButton: true,
			anchor: false,
			autoClose: true,
			autoFlip: true,
			position: 'after',
			verticalPosition: 'above',
			hideWhenOutOfView: true,
			width: 210
		}, commandsResolver, fragmentResolver );

		this.setClosingHookHandler().then();

		document.body.appendChild( this.popup.$element[ 0 ] );
	}

	public getInstance(): CommandsPopupWidget {
		return this.popup;
	}

	public static getCommandClassName(): string {
		return COMMAND_CLASS_NAME;
	}

	public async setClosingHookHandler(): Promise<void> {
		this.popup.on( 'closing', async (): Promise<void> => {
			await this.clearContent();
		} );
	}

	private async clearContent(): Promise<void> {
		await this.setContent();

		const surface = ve.init.target?.getSurface();
		const editableEl = surface.$element.find( '.ve-ce-rootNode[contenteditable="true"]' );
		editableEl.off( 'keydown' );
		$( window ).unbind( 'scroll' );
		$( document ).off( 'mousemove', '.insert-command' );

		CommandsStore.clear( START_FRAGMENT );
		CommandsStore.clear( REPLACE_FRAGMENT );
		CommandsStore.clear( SEARCH_FRAGMENT );
		CommandsStore.clear( WRAP_BLOCK_ID );
		CommandsStore.set( COMMANDS_LIST_LENGHT, 0 );
		CommandsStore.set( COUNT_NO_RESULTS_TRYING, 0 );
	}

	public setContent(): void {
		this.setBodyHtml( this.commandsResolver.getCommands() );
	}

	private setBodyHtml( commandsList: Map<string, Command> ): void {
		const content = this.getCommandElTemplate( commandsList );
		this.popup.$body.find( '.commands-list' ).html( content );
	}

	public updateContent( search: string ): void {
		this.updateBodyHtml( this.commandsResolver.getCommands( search ) );
	}

	private updateBodyHtml( commandsList: Map<string, Command> ): void {
		let content = '';

		if ( !commandsList.size ) {
			content = `<span class="${this.commandClassName}" role="button" data-command="${NO_RESULTS}">No results</span>`;
			const countNoResultsTrying = CommandsStore.get( COUNT_NO_RESULTS_TRYING );
			CommandsStore.set( COUNT_NO_RESULTS_TRYING, ( countNoResultsTrying + 1 ) );
		} else {
			content = this.getCommandElTemplate( commandsList );
		}

		CommandsStore.set( COMMANDS_LIST_LENGHT, commandsList.size );

		this.popup.$body.find( '.commands-list' ).html( content );
		this.popup.$body.scrollTop( 0 );
	}

	public getCommandElTemplate( commandsList: Map<string, Command> ): string {
		let content = '';
		let index = 0;
		commandsList.forEach( function ( commandData: Command ): void {
			content += `<span class="${COMMAND_CLASS_NAME}" tabindex="${index}" role="button" data-command="${commandData.name}">
					<span class="oo-ui-iconElement-icon oo-ui-icon-${commandData.icon || 'noIcon'}"></span>
					<span class="oo-ui-tool-title">${commandData.label}</span>
				</span>`;
			index++;
		} );

		return content;
	}
}
