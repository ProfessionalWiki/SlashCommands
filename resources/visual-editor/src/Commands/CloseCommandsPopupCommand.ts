import { CommandsPopup } from '../Widgets/CommandsPopup.ts';
import { CommandsStore, COUNT_NO_RESULTS_TRYING } from '../Stores/CommandsStore.ts';
import { FragmentResolver } from '../Application/Resolvers/FragmentResolver.ts';

interface CloseFn extends Function {
	(): void;
	super: any;
}
export class CloseCommandsPopupCommand {

	private readonly commandName: string = 'closeCommandsPopup';

	public constructor(
		private readonly popup: CommandsPopup,
		private readonly fragmentResolver: FragmentResolver
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

			this.closePopup( surface );

			return true;
		};

		ve.ui.commandRegistry.register( new ClosePopupCommand() );

		ve.ui.sequenceRegistry.register(
			new ve.ui.Sequence(
				commandName,
				commandName,
				/.$/,
				0
			)
		);
	}

	private closePopup( surface: typeof ve.ui.Surface ): boolean {
		const currentFragment = surface.getModel().getFragment();
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
		return !this.fragmentResolver.isSearchFragmentExist() ||
			this.fragmentResolver.isOutsideSearchRange( currentFragment );
	}

	private isNoResultsTyping(): boolean {
		const countNoResultsTrying = CommandsStore.get( COUNT_NO_RESULTS_TRYING );
		const searchText = this.fragmentResolver.getSearchText();

		return ( countNoResultsTrying > 3 && searchText.length > 0 ) ||
			( searchText.length > 1 && searchText.slice( -2 ) === '  ' );
	}
}
