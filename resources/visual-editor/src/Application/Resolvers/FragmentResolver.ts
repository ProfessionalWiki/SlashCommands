import { CommandsStore, SEARCH_FRAGMENT, START_FRAGMENT } from '../../Stores/CommandsStore';
import { EXECUTE_SYMBOL } from '../CommandsController';

export interface Range {
	start: number;
	end: number;
}

export class FragmentResolver {

	private surface: typeof ve.ui.Surface;

	public constructor() {
		this.surface = ve.init.target?.getSurface();
	}

	public setSurface(): void {
		this.surface = ve.init.target?.getSurface();
	}

	public isOutsideSearchRange(
		currentFragment: typeof ve.dm.SurfaceFragment,
		includingExecSymbol = false
	): boolean {
		const searchRange = this.getSearchRange();
		const currStart = currentFragment.selection.range.start + ( includingExecSymbol ? 1 : 0 );
		const currEnd = currentFragment.selection.range.end;

		return currStart < searchRange.start || currEnd > searchRange.end ||
			( currStart === searchRange.start && searchRange.start === searchRange.end );
	}

	public isSearchFragmentExist(): boolean {
		return CommandsStore.get( START_FRAGMENT ) !== null;
	}

	public isSearchFragmentEmpty(): boolean {
		const searchRange = this.getSearchRange();
		return searchRange.start === searchRange.end;
	}

	public getSearchRange(): Range {
		const startFragment = CommandsStore.get( START_FRAGMENT );
		const searchFragment = CommandsStore.get( SEARCH_FRAGMENT );

		return {
			start: startFragment.selection.range.start,
			end: startFragment.selection.range.start +
				( searchFragment ? searchFragment.length : 0 )
		};
	}

	public getSearchText(): string {
		if ( !this.isSearchFragmentExist() ) {
			return '';
		}

		const searchRate = this.getSearchRange();
		const searchFragment = this.getFragment( searchRate );

		return searchFragment.getText( true );
	}

	public getFragment( range: Range ): typeof ve.dm.SurfaceFragment {
		return this.surface.getModel().getLinearFragment( new ve.Range(
			range.start,
			range.end
		) );
	}

	public replaceSearchFragment(): void {
		const searchRange = this.getSearchRange();
		const searchFragment = this.getFragment( {
			start: searchRange.start - 1,
			end: searchRange.end
		} );

		if ( searchFragment !== null ) {
			const commandString = EXECUTE_SYMBOL + this.getSearchText();
			if ( searchFragment.getText( true ) === commandString ) {
				const currentFragment = this.surface.getModel().getFragment();
				searchFragment.removeContent();
				searchFragment.insertContent( commandString );

				this.setCursorAfterReplacing( currentFragment, searchRange );
			}
		}
	}

	private setCursorAfterReplacing(
		currentFragment: typeof ve.dm.SurfaceFragment,
		searchRate: Range
	): void {
		const cursorRange = {
			start: searchRate.end,
			end: searchRate.end
		};

		if (
			currentFragment &&
			currentFragment.selection.range.end > searchRate.end
		) {
			cursorRange.start = cursorRange.end = currentFragment.selection.range.end;
		}

		const cursorFragment = this.getFragment( cursorRange );
		cursorFragment.select();
	}

	public removeSearchFragment(): void {
		const searchRate = this.getSearchRange();
		const searchRateStart = searchRate.start - 1;
		const searchFragment = this.getFragment( {
			start: searchRateStart,
			end: searchRate.end
		} );

		if ( searchFragment !== null ) {
			const commandString = EXECUTE_SYMBOL + this.getSearchText();
			if ( searchFragment.getText( true ) === commandString ) {
				searchFragment.removeContent();

				const cursorFragment = this.getFragment( {
					start: searchRateStart,
					end: searchRateStart
				} );
				cursorFragment.select();
			}
		}
	}
}
