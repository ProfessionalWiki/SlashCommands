import './main.scss';
import { CommandsController } from './Application/CommandsController';
import { CommandsPopup } from './Widgets/CommandsPopup';
import { FragmentResolver } from './Application/Resolvers/FragmentResolver';
import { CommandsResolver } from './Application/Resolvers/CommandsResolver';
import { CommandManager } from '@/Commands/CommandManager';

ve.slashCommands = {
	CommandManager: new CommandManager()
}

/**
 * Setup commands list popup
 */
const fragmentResolver = new FragmentResolver();
const commandsResolver = new CommandsResolver();
const popupObject = new CommandsPopup( fragmentResolver, commandsResolver );
( new CommandsController( popupObject, fragmentResolver, commandsResolver ) ).setUp();

mw.hook( 've.activationComplete' ).add( async function () {
	await popupObject.setContent();
	fragmentResolver.setSurface();
} );
