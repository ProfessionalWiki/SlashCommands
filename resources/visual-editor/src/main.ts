import './main.scss';
import { CommandsController } from './Application/CommandsController.ts';
import { CommandsPopup } from './Widgets/CommandsPopup.ts';
import { FragmentResolver } from './Application/Resolvers/FragmentResolver.ts';
import { CommandsResolver } from './Application/Resolvers/CommandsResolver.ts';

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
