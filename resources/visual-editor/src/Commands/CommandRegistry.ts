export interface Command {
	name: string;
	icon?: string;
	label?: string;
}

export interface CommandRegistryInterface {
	getCommandList(): Map<string, Command>;
	getInitialCommandList(): Map<string, Command>;
}

export class CommandRegistry {
	private readonly commandList: Map<string, Command>;
	private readonly initialCommands = [
		'bold', 'italic', 'underline', 'strikethrough', 'big', 'small', 'code',
		'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6',
		'table', 'gallery', 'comment', 'link'
	] as string[];
	private readonly excludedCommands = [
		'showSave', 'linkNoExpand', 'numberWrapOnce', 'bulletWrapOnce', 'autolinkUrl',
		'delete', 'backspace', 'submit', 'cancel', 'focusContext', 'insertTable',
		'deleteTable', 'insertRowBefore', 'moveRowBefore', 'insertRowAfter', 'moveRowAfter',
		'deleteRow', 'insertColumnBefore', 'moveColumnBefore', 'deleteColumn', 'tableCellHeader',
		'tableCellData', 'enterTableCell', 'exitTableCell', 'mergeCells', 'mwLanguageVariant-disabled',
		'mwLanguageVariant-filter', 'mwLanguageVariant-name', 'mwLanguageVariant-twoway',
		'mwLanguageVariant-oneway', 'mwNonBreakingSpace', 'autolinkMagicLink', 'mwPre', 'showChanges',
		'saveMinoredit', 'saveWatchthis', 'transclusionFromSequence', 'alienExtension', 'transclusion',
		'syntaxhighlightDialog'
	] as string[];

	public constructor() {
		if ( !ve?.ui?.commandRegistry?.registry ) {
			throw new Error( 'CommandRegistry is not available in this extension, see "ve.ui.commandRegistry" for details' );
		}

		this.commandList = new Map();
		this.addGlobalCommands();
	}

	private addGlobalCommands(): void {
		for ( const name in ve.ui.commandRegistry.registry ) {
			const command = ve.ui.commandRegistry.registry[ name ];
			if ( command.action && command.method ) {
				this.addCommand( { name } );
			}
		}
	}

	private commandExists( name: string ): boolean {
		return this.commandList.has( name );
	}

	private commandExcluded( name: string ): boolean {
		return this.excludedCommands.includes( name )
	}

	private addCommand( command: Command ): void {
		if ( !this.commandExists(command.name) && !this.commandExcluded(command.name) ) {
			this.commandList.set( command.name, {
				name: command.name,
				icon: command.icon ?? this.getCommandIcon( command.name ),
				label: command.label ?? this.getCommandLabel( command.name )
			} );
		}
	}

	private getCommandIcon( commandName: string ): string {
		const icon = ve.ui?.toolFactory?.registry?.[ commandName ]?.static?.icon;
		if ( icon !== undefined ) {
			return icon;
		}
		return ve.ui?.contextItemFactory?.registry?.[ commandName ]?.static?.icon ?? 'noIcon';
	}

	private getCommandLabel( commandName: string ): string {
		return ve.ui?.toolFactory?.registry?.[ commandName ]?.static?.title() ??
			( commandName.charAt( 0 ).toUpperCase() + commandName.slice( 1 ) );
	}

	public getCommandList(): Map<string, Command> {
		return this.commandList;
	}

	public getInitialCommandList(): Map<string, Command> {
		return new Map(
			[ ...this.commandList ].filter( ( [ name ] ) => this.initialCommands.includes( name ) )
		);
	}
}
