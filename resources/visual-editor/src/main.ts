import './main.scss';
import { CommandsController } from './Application/CommandsController';
import { CommandsPopup } from './Widgets/CommandsPopup';
import { FragmentResolver } from './Application/Resolvers/FragmentResolver';
import { CommandsResolver } from './Application/Resolvers/CommandsResolver';
import { CommandRegistry } from '@/Commands/CommandRegistry';

window.ve.slashCommands = {
	CommandRegistry: new CommandRegistry()
};

/**
 * Setup commands list popup
 */
const fragmentResolver = new FragmentResolver();
const commandsResolver = new CommandsResolver( ve.slashCommands.CommandRegistry );
const popupObject = new CommandsPopup( fragmentResolver, commandsResolver );
( new CommandsController( popupObject, fragmentResolver, commandsResolver ) ).setUp();

mw.hook( 've.activationComplete' ).add( async function () {
	await popupObject.setContent();
	fragmentResolver.setSurface();
} );

// import './modified-main';
