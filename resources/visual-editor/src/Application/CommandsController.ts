import type { CommandsPopup } from '../Widgets/CommandsPopup';
import { CommandsAnnotation } from '../Annotations/CommandsAnnotation';
import { OpenCommandsPopupCommand } from '../Commands/OpenCommandsPopupCommand';
import { CloseCommandsPopupCommand } from '../Commands/CloseCommandsPopupCommand';
import { FragmentResolver } from './Resolvers/FragmentResolver';
import { CommandsResolver } from './Resolvers/CommandsResolver';

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
