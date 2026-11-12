import './main.scss';
import { CommandsController } from './Application/CommandsController';
import { CommandsPopup } from './Widgets/CommandsPopup';
import { FragmentResolver } from './Application/Resolvers/FragmentResolver';
import { CommandsResolver } from './Application/Resolvers/CommandsResolver';
import { CommandRegistry } from '@/Commands/CommandRegistry';

window.ve.slashCommands = {
	CommandRegistry: new CommandRegistry(),
};

/**
 * Setup commands list popup
 */
const fragmentResolver = new FragmentResolver();
const commandsResolver = new CommandsResolver(
	ve.slashCommands.CommandRegistry.getCommandList(),
	ve.slashCommands.CommandRegistry.getInitialCommandList(),
);
const popupObject = new CommandsPopup( fragmentResolver, commandsResolver );
( new CommandsController( popupObject, fragmentResolver, commandsResolver ) ).setUp();

// A top-level async arrow function would make the build wrap this module in a
// CommonJS shim that ends in `export`, which ResourceLoader cannot load.
async function onActivationComplete(): Promise<void> {
	await popupObject.setContent();
	fragmentResolver.setSurface();
}

mw.hook( 've.activationComplete' ).add( onActivationComplete );
