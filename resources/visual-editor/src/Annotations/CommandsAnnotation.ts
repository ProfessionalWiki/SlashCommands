import { CommandsStore, WRAP_BLOCK_ID } from '../Stores/CommandsStore.ts';
import { CommandsPopupWidget } from '../Widgets/Factories/CommandsPopupFactory.ts';

interface AnnotationFn extends Function {
	(): void;
	static: {
		name?: string;
		tagName?: string;
		matchTagNames?: string[];
	};
	super: any;
}

export class CommandsAnnotation {

	private readonly tagName: string = 'span';
	private readonly name: string = 'textStyle/userInput';

	public constructor(
		private readonly popup: CommandsPopupWidget,
		private readonly className: string
	) {}

	public setUp(): void {
		this.setCeAnnotation();
		this.setDmAnnotation();
	}

	private setCeAnnotation(): void {
		const className = this.className;

		const Annotation = <AnnotationFn> function VeCeCommandsAnnotation( ...args ): void {
			Annotation.super.apply( this, args );
			this.$element.addClass( className );
		};

		OO.inheritClass( Annotation, ve.ce.TextStyleAnnotation );
		Annotation.static.name = this.name;
		Annotation.static.tagName = this.tagName;
		ve.ce.annotationFactory.register( Annotation );

		Annotation.prototype.getContentContainer = function () {
			const ID = CommandsStore.get( WRAP_BLOCK_ID );
			if ( ID ) {
				this.$element.attr( 'id', ID );
			}
			return this.$element[ 0 ];
		};
	}

	private setDmAnnotation(): void {
		const Annotation = <AnnotationFn> function VeDmCommandsAnnotation( ...args ): void {
			Annotation.super.apply( this, args );
		};
		OO.inheritClass( Annotation, ve.dm.TextStyleAnnotation );
		Annotation.static.name = this.name;
		Annotation.static.matchTagNames = [ this.tagName ];
		ve.dm.modelRegistry.register( Annotation );
	}
}
