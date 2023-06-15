import { CommandsResolver } from '../../Application/Resolvers/CommandsResolver.ts';
import { FragmentResolver } from '../../Application/Resolvers/FragmentResolver.ts';

export interface CommandsPopupWidget extends OO.ui.PopupWidget {}

interface PopupFn extends Function {
	( params: object ): void;
	super: any;
}

export class CommandsPopupFactory {

	public static create(
		params: object,
		commandsResolver: CommandsResolver,
		fragmentResolver: FragmentResolver
	): OO.ui.PopupWidget {

		const CommandsPopup = <PopupFn> function OoUiCommandsPopup( config ): void {
			CommandsPopup.super.call(
				this,
				config
			);
		};
		OO.inheritClass( CommandsPopup, OO.ui.PopupWidget );

		CommandsPopup.prototype.onDocumentMouseDown = function ( e ): void {
			if ( this.isVisible() ) {
				if ( !OO.ui.contains( this.$element.find( '.commands-list' ).get(), e.target, true ) ) {
					this.toggle( false );
				}
				commandsResolver.executeCommandWithElement( this, e, fragmentResolver );
			}
		};

		return new CommandsPopup( params );
	}
}
