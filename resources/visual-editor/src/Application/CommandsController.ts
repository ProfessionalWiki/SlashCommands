import type { CommandsPopup } from '../Widgets/CommandsPopup.ts';
import { CommandsAnnotation } from '../Annotations/CommandsAnnotation.ts';
import { OpenCommandsPopupCommand } from '../Commands/OpenCommandsPopupCommand.ts';
import { CloseCommandsPopupCommand } from '../Commands/CloseCommandsPopupCommand.ts';
import { FragmentResolver } from './Resolvers/FragmentResolver.ts';
import { CommandsResolver } from './Resolvers/CommandsResolver.ts';

export const EXECUTE_SYMBOL = '/';

export class CommandsController {

	private readonly executeSymbol: string = EXECUTE_SYMBOL;
	private readonly className: string = 'commands-popup-wrap';

	public constructor(
		public readonly popup: CommandsPopup,
		public readonly fragmentResolver: FragmentResolver,
		public readonly commandsResolver: CommandsResolver
	) {}

	public setUp(): void {
		const annotation = new CommandsAnnotation(
			this.popup.getInstance(),
			this.className
		);
		annotation.setUp();

		const openPopupCommand = new OpenCommandsPopupCommand(
			this.popup,
			this.executeSymbol,
			this.fragmentResolver,
			this.commandsResolver
		);
		openPopupCommand.setUp();

		const closePopupCommand = new CloseCommandsPopupCommand(
			this.popup,
			this.fragmentResolver
		);
		closePopupCommand.setUp();
	}
}
