export abstract class Control {

    name: string|undefined;
    protected current_node: any;

    constructor( name: string) {
        this.name = name;
    }

    /**
     * Must return HTML string.
     */
    abstract def_button(): string;
    abstract def_events(): void;

}