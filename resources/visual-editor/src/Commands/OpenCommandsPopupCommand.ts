import { CommandsPopup } from '../Widgets/CommandsPopup';
import {
	CommandsStore,
	REPLACE_FRAGMENT,
	START_FRAGMENT, WRAP_BLOCK_ID
} from '../Stores/CommandsStore';
import { FragmentResolver } from '../Application/Resolvers/FragmentResolver';
import { CommandsResolver } from '../Application/Resolvers/CommandsResolver';

interface EventObject extends Event {
	target: HTMLElement;
	keyCode: number;
}

interface OpenFn extends Function {
	(): void;
	super: any;
}

type Position = {
	top: number|null;
	bottom: number|null;
	left: number;
};

export const OPEN_COMMANDS_POPUP = 'openCommandsPopup';

export class OpenCommandsPopupCommand {

	private readonly commandName: string = OPEN_COMMANDS_POPUP;
	private readonly popup: OO.ui.PopupWidget;
	private ID: string;
	private surface: typeof ve.ui.Surface;
	private currentElementIndex = 0;

	public constructor(
		private readonly popupObject: CommandsPopup,
		private readonly executeSymbol: string,
		private readonly fragmentResolver: FragmentResolver,
		public readonly commandsResolver: CommandsResolver
	) {
		this.popup = popupObject.getInstance();
	}

	public setUp(): void {
		const commandName = this.commandName;
		const executeSymbol = this.executeSymbol;

		const CommandsPopupCommand = <OpenFn> function VeUiCommandsPopupCommand() {
			CommandsPopupCommand.super.call(
				this,
				commandName
			);
		};
		OO.inheritClass( CommandsPopupCommand, ve.ui.Command );

		CommandsPopupCommand.prototype.execute = ( surface: typeof ve.ui.Surface ): boolean => {
			if ( this.popup.isVisible() ) {
				return false;
			}

			this.surface = surface;
			this.setID();

			setTimeout( () => {
				this.wrapCommandRunningSymbol();
				this.showPopup();
				this.bindEvents();
				this.commandsResolver.focusFirstCommand( this.popup );
				this.unwrapCommandRunningSymbol();
			} );

			return true;
		};

		ve.ui.commandRegistry.register( new CommandsPopupCommand() );

		ve.ui.sequenceRegistry.register(
			new ve.ui.Sequence(
				commandName,
				commandName,
				executeSymbol
			)
		);
	}

	private setID(): void {
		const idName = 'commands-popup-';
		const uID = this.makeID( 7 );

		this.ID = '#' + idName + uID;
		CommandsStore.set( WRAP_BLOCK_ID, idName + uID );
	}

	private makeID( length ): string {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while ( counter < length ) {
			result += characters.charAt( Math.floor( Math.random() * charactersLength ) );
			counter += 1;
		}
		return result;
	}

	private wrapCommandRunningSymbol(): void {

		const surfaceModel = this.surface.getModel();
		const currentFragment = surfaceModel.getFragment();
		CommandsStore.set( START_FRAGMENT, currentFragment );

		const replaceFragment = surfaceModel.getLinearFragment( new ve.Range(
			currentFragment.selection.range.end - 1,
			currentFragment.selection.range.end
		) );

		replaceFragment.annotateContent( 'set', 'textStyle/userInput' );
		CommandsStore.set( REPLACE_FRAGMENT, replaceFragment );
	}

	private showPopup(): void {

		this.popup.toggle( true );

		const wrapEl = $( document ).find( '.insert-commands-list-wrap' );
		const elPosition = this.calculatePosition();

		wrapEl.css( {
			top: elPosition.top ? elPosition.top + 'px' : 'unset',
			bottom: elPosition.bottom ? elPosition.bottom + 'px' : 'unset',
			left: elPosition.left + 'px'
		} );
		wrapEl.find( '.oo-ui-popupWidget-body' ).scrollTop( 0 );
		this.currentElementIndex = 0;
	}

	private calculatePosition(): Position {
		const popupHeight = 330;
		const topRowHeight = 17;
		const bottomRowHeight = 20;
		const documentEl = $( document );
		const windowHeight = $( window ).height();
		const scrollTop = documentEl.scrollTop();
		const position = documentEl.find( this.ID ).last().offset();

		const top = position.top - scrollTop + topRowHeight;
		const bottom = windowHeight - top + bottomRowHeight;

		if ( bottom < popupHeight ) {
			return {
				top: null,
				bottom: bottom,
				left: position.left
			};
		}

		return {
			top: top,
			bottom: null,
			left: position.left
		};
	}

	private unwrapCommandRunningSymbol(): void {
		const surfaceModel = this.surface.getModel();
		const currentFragment = surfaceModel.getFragment();

		const replaceFragment = surfaceModel.getLinearFragment( new ve.Range(
			currentFragment.selection.range.end - 1,
			currentFragment.selection.range.end
		) );

		replaceFragment.annotateContent( 'clear', 'textStyle/userInput' );

		const cursorFragment = surfaceModel.getLinearFragment( new ve.Range(
			replaceFragment.selection.range.end,
			replaceFragment.selection.range.end
		) );
		cursorFragment.select();
	}

	private bindEvents(): void {
		this.bindKeydownEvent();
		this.bindScrollEvent();
		this.bindHoverEvent();
	}

	private bindScrollEvent(): void {
		$( window ).scroll( (): void => {
			this.popup.toggle( false );
		} );
	}

	private bindKeydownEvent(): void {
		const editableEl = this.surface.$element.find( '.ve-ce-rootNode[contenteditable="true"]' );

		editableEl.on( 'keydown', ( e: EventObject ) => {
			this.tapCommandsBlock( e );
			this.closePopup( e );
			return this.runCommand( e );
		} );
	}

	private bindHoverEvent(): void {
		$( document ).on( 'mousemove', '.insert-command', function (): void {
			const el = $( this );

			if ( !el.hasClass( 'selected' ) ) {
				$( '.insert-command' ).removeClass( 'selected' );
				el.addClass( 'selected' );
			}
		} );
	}

	private closePopup( e: EventObject ): void {
		const keys = [ 37, 39, 9 ];
		const searchFragment = this.surface.getModel().getFragment();

		if (
			e.keyCode !== undefined &&
			keys.includes( e.keyCode ) &&
			( !this.fragmentResolver.isSearchFragmentExist() ||
			this.fragmentResolver.isOutsideSearchRange( searchFragment ) ) &&
			this.popup.isVisible()
		) {
			this.popup.toggle( false );
		}
	}

	private tapCommandsBlock( e: EventObject ): void {
		const keys = [ 38, 40 ];
		const searchFragment = this.surface.getModel().getFragment();

		if (
			e.keyCode !== undefined &&
			keys.includes( e.keyCode ) &&
			this.fragmentResolver.isSearchFragmentExist() &&
			( this.fragmentResolver.isSearchFragmentEmpty() ||
			!this.fragmentResolver.isOutsideSearchRange( searchFragment, true ) ) &&
			this.popup.isVisible()
		) {
			e.preventDefault();

			const focusedElem = document.querySelector( '.commands-list>.insert-command.selected' );
			const allElems = document.querySelectorAll( '.commands-list>.insert-command' );
			const tabElements = [ ...allElems ];
			const tabElementsCount = tabElements.length - 1;

			if ( !tabElements.includes( focusedElem ) ) {
				return;
			}

			const focusIndex = tabElements.indexOf( focusedElem );
			let elemToFocus;

			if ( e.keyCode === 38 ) { // ArrowUp
				elemToFocus = tabElements[ focusIndex > 0 ? focusIndex - 1 : tabElementsCount ];
			}

			if ( e.keyCode === 40 ) { // ArrowDown
				elemToFocus = tabElements[ focusIndex < tabElementsCount ? focusIndex + 1 : 0 ];
			}

			focusedElem.classList.remove( 'selected' );
			elemToFocus.classList.add( 'selected' );

			this.addAutoScrolling( elemToFocus );
		}
	}

	private addAutoScrolling( element: Element ): void {
		const parent = element.closest( '.oo-ui-popupWidget-body' ) as HTMLElementTagNameMap['div'];
		const wrapParent = parent.querySelector( '.commands-list' ) as HTMLElementTagNameMap['div'];
		const el = element as HTMLElementTagNameMap['div'];
		const elHeight = el.offsetHeight;
		const parentHeight = parent.offsetHeight;
		const listHeight = wrapParent.offsetHeight;
		const elIndex = parseInt( el.getAttribute( 'tabindex' ) );

		if ( elIndex === 0 ) {
			parent.scrollTop = 0;
		} else if ( this.currentElementIndex === 0 && elIndex > 1 ) {
			parent.scrollTop = listHeight;
		} else if ( elIndex > this.currentElementIndex ) {
			// down moving
			if ( parentHeight < el.offsetTop + elHeight ) {
				parent.scrollTop = parent.scrollTop + elHeight;
			}
		} else if ( elIndex < this.currentElementIndex ) {
			// up moving
			parent.scrollTop = parent.scrollTop - elHeight;
		}

		this.currentElementIndex = elIndex;
	}

	private runCommand( e: EventObject ): boolean {
		const keys = [ 13 ]; // enter key

		if (
			e.keyCode !== undefined &&
			keys.includes( e.keyCode ) &&
			this.popup.isVisible()
		) {
			e.preventDefault();

			const focusElem: HTMLElement = document.querySelector( '.commands-list>.insert-command.selected' );

			return this.commandsResolver.executeCommandWithElement(
				this.popup,
				e,
				this.fragmentResolver,
				focusElem
			);
		}
		return true;
	}
}
