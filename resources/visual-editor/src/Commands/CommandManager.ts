
export interface CommandPlugin {
	name: string;
	icon?: string;
	label?: string;
}

export interface CommandPluginManager<P> {
	registerCommand(command: P): void;
	getCommand(name: string): P;
	getCommandList(): Map<string, P>;
	getInitialCommandList(): Map<string, P>;
	deleteCommand( name: string ): void;
}

export class CommandManager implements CommandPluginManager<CommandPlugin>{
	private readonly commandList: Map<string, CommandPlugin>;
	private readonly initialCommands = [
		'bold', 'italic', 'underline', 'strikethrough', 'big', 'small', 'code',
		'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6',
		'table', 'gallery', 'comment', 'link'
	] as string[];
	private readonly excludedCommands = [
		'showSave'
	] as string[];

	constructor() {
		if ( !ve?.ui?.commandRegistry?.registry ) {
			throw new Error( 'CommandPluginManager is not available in this extension' );
		}

		this.commandList = new Map();
		this.addGlobalCommands();
	}

	private addGlobalCommands() {
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

	private commandGloballyRegistered( name: string ): boolean {
		return Object.prototype.hasOwnProperty.call( ve.ui.commandRegistry.registry, name );
	}

	private addCommand( command: CommandPlugin ): void {
		if ( !this.excludedCommands.includes( command.name ) ) {
			this.commandList.set(command.name, {
				name: command.name,
				icon: command.icon ?? this.getCommandIcon(command.name),
				label: command.label ?? this.getCommandLabel(command.name)
			});
		}
	}

	private getCommandIcon( commandName: string ): string {
		return ve.ui?.toolFactory?.registry?.[ commandName ]?.static?.icon ?? 'noIcon';
	}

	private getCommandLabel( commandName: string ): string {
		return ve.ui?.toolFactory?.registry?.[ commandName ]?.static?.title() ??
			( commandName.charAt( 0 ).toUpperCase() + commandName.slice( 1 ) );
	}

	registerCommand( command: CommandPlugin ): void {
		if ( !command.name ) {
			throw new Error( 'The command name is required' );
		}

		if ( this.commandExists( command.name ) ) {
			throw new Error( `The command with name "${command.name}" already exists` );
		}

		if ( !this.commandGloballyRegistered( command.name ) ) {
			throw new Error( `The command with name "${command.name}" is not globally registered, see "ve.ui.commandRegistry" for details` );
		}

		this.addCommand( command );
	}

	getCommand( name: string ): CommandPlugin {
		const command = this.commandList.get( name );
		if ( !command ) {
			throw new Error( `The command with name "${name}" does not exist` );
		}

		return command;
	}

	getCommandList(): Map<string, CommandPlugin> {
		return this.commandList;
	}

	getInitialCommandList(): Map<string, CommandPlugin> {
		return new Map(
			[ ...this.commandList ].filter( ( [ name]) => this.initialCommands.includes( name ) )
		)
	}

	deleteCommand( name: string ): void {
		const command = this.commandList.get( name );
		if ( !command ) {
			throw new Error( `The command with name "${name}" does not exist` );
		}

		this.commandList.delete( name );
	}
}
