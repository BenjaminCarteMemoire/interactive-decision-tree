import { IDT_Route } from "../globals";

export abstract class Type {

    name: string|undefined;
    protected current_node: any;
    abstract render(): void;

    constructor( name: string ) {

        this.name = name;

    }

    set_current_node(){

        this.current_node = IDT_TREE[ IDT_Route.current_section() ];

    }

    prepare_goto( e: Event|null, pre_section: string ): string {

        return pre_section;

    }

}