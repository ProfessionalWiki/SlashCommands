export interface Command {
	name: string;
	icon?: string;
	label?: string;
}

export interface CommandRegistryInterface {
	registerCommand( command: Command ): void;
	getCommandList(): Map<string, Command>;
	getInitialCommandList(): Map<string, Command>;
	deleteCommand( name: string ): void;
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

	private commandExcluded( name: string ): boolean {
		return this.excludedCommands.includes( name );
	}

	private commandGloballyRegistered( name: string ): boolean {
		return Object.prototype.hasOwnProperty.call( ve.ui.commandRegistry.registry, name );
	}

	private addCommand( command: Command ): void {
		if ( !this.commandExcluded( command.name ) ) {
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
		let label;
		try {
			label = ve.ui?.toolFactory?.registry?.[ commandName ]?.static?.title();
		} catch ( e ) {}
		return label ?? commandName.charAt( 0 ).toUpperCase() + commandName.slice( 1 );
	}

	public registerCommand( command: Command ): void {
		if ( !command.name ) {
			throw new Error( 'The command name is required' );
		}

		if ( !this.commandGloballyRegistered( command.name ) ) {
			throw new Error( `The command with name "${command.name}" is not globally registered, see "ve.ui.commandRegistry" for details` );
		}

		this.addCommand( command );
	}

	public getCommandList(): Map<string, Command> {
		return this.commandList;
	}

	public getInitialCommandList(): Map<string, Command> {
		return new Map(
			[ ...this.commandList ].filter( ( [ name ] ) => this.initialCommands.includes( name ) )
		);
	}

	public deleteCommand( name: string ): void {
		const command = this.commandList.get( name );
		if ( !command ) {
			throw new Error( `The command with name "${name}" does not exist` );
		}

		this.commandList.delete( name );
	}
}
