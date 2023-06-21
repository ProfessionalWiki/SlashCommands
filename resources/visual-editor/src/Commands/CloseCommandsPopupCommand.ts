import { CommandsPopup } from '../Widgets/CommandsPopup';
import { CommandsStore, COUNT_NO_RESULTS_TRYING, SEARCH_FRAGMENT, START_FRAGMENT } from '../Stores/CommandsStore';
import { FragmentResolver } from '../Application/Resolvers/FragmentResolver';
import { CommandsResolver } from '../Application/Resolvers/CommandsResolver';
import { EXECUTE_SYMBOL } from '../Application/CommandsController';

interface CloseFn extends Function {
	(): void;
	super: any;
}
export class CloseCommandsPopupCommand {

	private readonly commandName: string = 'closeCommandsPopup';
	private surface: typeof ve.ui.Surface;

	public constructor(
		private readonly popup: CommandsPopup,
		private readonly fragmentResolver: FragmentResolver,
		private readonly commandsResolver: CommandsResolver
	) {}

	public setUp(): void {
		const commandName = this.commandName;

		const ClosePopupCommand = <CloseFn> function VeUiCloseCommand() {
			ClosePopupCommand.super.call(
				this,
				commandName
			);
		};
		OO.inheritClass( ClosePopupCommand, ve.ui.Command );

		ClosePopupCommand.prototype.execute = ( surface: typeof ve.ui.Surface ): boolean => {

			this.surface = surface;
			this.searchCommand();
			this.closePopup();

			return true;
		};

		ve.ui.commandRegistry.register( new ClosePopupCommand() );

		ve.ui.sequenceRegistry.register(
			new ve.ui.Sequence(
				commandName,
				commandName,
				/.$/,
				0,
				{
					checkOnDelete: true
				}
			)
		);
	}

	private searchCommand(): void {
		const startFragment = CommandsStore.get( START_FRAGMENT );

		if ( startFragment ) {
			const surfaceModel = this.surface.getModel();
			const currentFragment = surfaceModel.getFragment();
			const searchFragment = surfaceModel.getLinearFragment( new ve.Range(
				startFragment.selection.range.start,
				currentFragment.selection.range.end
			) );
			const searchText = searchFragment.getText( true );

			CommandsStore.set( SEARCH_FRAGMENT, searchText );

			this.popup.updateContent( searchText );

			this.commandsResolver.focusFirstCommand( this.popup.getInstance() );
		}
	}

	private closePopup(): boolean {
		const currentFragment = this.surface.getModel().getFragment();
		const popup = this.popup.getInstance();

		if (
			currentFragment &&
			(
				this.isOutsideSearchRange( currentFragment ) ||
				this.isNoResultsTyping()
			) &&
			popup.isVisible()
		) {
			popup.toggle( false );
		}
		return true;
	}

	private isOutsideSearchRange( currentFragment: typeof ve.dm.SurfaceFragment ): boolean {
		const surfaceModel = this.surface.getModel();
		const prevFragment = surfaceModel.getLinearFragment( new ve.Range(
			currentFragment.selection.range.start - 1,
			currentFragment.selection.range.end
		) );
		const prevText = prevFragment?.getText( true );

		return ( !this.fragmentResolver.isSearchFragmentExist() ||
			this.fragmentResolver.isOutsideSearchRange( currentFragment ) ) &&
			prevText !== EXECUTE_SYMBOL;
	}

	private isNoResultsTyping(): boolean {
		const countNoResultsTrying = CommandsStore.get( COUNT_NO_RESULTS_TRYING );
		const searchText = this.fragmentResolver.getSearchText();

		return ( countNoResultsTrying > 3 && searchText.length > 0 ) ||
			( searchText.length > 1 && searchText.slice( -2 ) === '  ' );
	}
}
