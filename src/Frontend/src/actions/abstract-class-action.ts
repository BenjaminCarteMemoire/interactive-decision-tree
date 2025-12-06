export abstract class Action {

    name: string|undefined;
    protected current_node: any;

    constructor(
        name: string,
    ){
        this.name = name;
    }

    abstract render( current_node: any ): void;

    prepare_goto( e: Event|null, pre_section: string ): string {

        return pre_section;

    }

}