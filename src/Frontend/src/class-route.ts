import { IDT_Render, IDT_TYPES } from "./globals";

export class Route {

    prev_section_stack: string[] = []
    private section: string|undefined

    constructor(
        starting_section: string = 'start'
    ){
        this.change_section( starting_section );
    }

    change_section(
        section_name: string
    ){
        this.section = section_name;
    }

    current_section(): string|undefined {
        return this.section;
    }

    goto = ( e: Event|null = null )=> {

        let IDT_section: string = "none";
        let current_node: any = IDT_TREE[ this.current_section() ];

        if( typeof IDT_TYPES[ current_node['type'] ] != 'undefined' )
            IDT_section = IDT_TYPES[ current_node['type'] ].prepare_goto( e, IDT_section );

        this._goto( IDT_section );

    }

    _goto( section_name: string ){
        this.change_section( section_name );
        IDT_Render.render();
    }

}