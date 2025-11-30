document.addEventListener( 'DOMContentLoaded', function(){

    let IDT_previous_section = "none";
    let IDT_section = "start";
    let IDT_div;
    let IDT_click_elements;

    function IDT_replace_html( s ){

        return s.replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, "&");

    }

    function IDT_goto( node_key ){
        IDT_previous_section = IDT_section;
        IDT_section = node_key;
        IDT_render_node();
    }

    function IDT_render_node(){

        const IDT_NODE = IDT_TREE[ IDT_section ];
        IDT_div.innerHTML = "";

        if( IDT_NODE["args"]["title"] !== "undefined" )
            IDT_div.innerHTML += "<span class='IDT_title'>" + IDT_NODE["args"]["title"] + "</span>";

        if( IDT_TYPES !== 'undefined' && IDT_TYPES[ IDT_NODE[ "type" ] ]['render'] !== 'undefined' ){
            IDT_TYPES[ IDT_NODE[ "type" ] ]['render']();
        }
    }

    function IDT_bind_click_elements( callback = _IDT_prepare_goto ){

        for( let i = 0; i < IDT_click_elements.length; i++ ){
            IDT_click_elements[i].addEventListener( 'click', callback, false )
        }

    }

    function IDT_unbind_click_elements( callback = _IDT_prepare_goto ){

        for( let i = 0; i < IDT_click_elements.length; i++ ){
            IDT_click_elements[i].removeEventListener( 'click', callback );
        }
        IDT_click_elements = null;

    }

    function _IDT_prepare_goto( event ){

        let IDT_pre_section = "none";
        const IDT_NODE = IDT_TREE[ IDT_section ];

        if( IDT_NODE['type'] === 'question' ){
            IDT_unbind_click_elements();
            let IDT_answer_id = this.getAttribute( 'data-answer-id' );

            IDT_pre_section = IDT_NODE['answers'][ IDT_answer_id ]["to"];

        }

        IDT_goto( IDT_pre_section );

    }

    function IDT( div_container = "idt_container" ){

        if( IDT_TREE === 'undefined' ) {
            console.error( "No JSON defined." );
            return;
        }

        console.log( IDT_TREE );

        IDT_div = document.getElementById( div_container );
        if( IDT_div === "undefined" ){
            console.error( "DIV not defined" )
            return;
        }

        IDT_render_node();

    }

    const IDT_TYPES = {
        "question": {
            "render": () => {
                const IDT_NODE = IDT_TREE[ IDT_section ];
                IDT_div.innerHTML +=
                    "<div class='IDT_question'>" +
                        "<span class='IDT_question_title'>" +
                            IDT_replace_html( IDT_NODE["text"] ) +
                    "   </span>" +
                    "</div>" +
                    "<div class='IDT_question_answers'>";

                    let IDT_answer_id = 0;

                    IDT_NODE["answers"].forEach( ( IDT_ANSWER ) => {

                        IDT_div.innerHTML += `<button class="idt_answer" style="background-color:${IDT_ANSWER['args']['color'] ?? 'inherit'}" data-answer-id="${IDT_answer_id++}">${IDT_ANSWER['args']['title']}</button>`

                    });

                IDT_div.innerHTML += '</div>';

                IDT_click_elements = document.getElementsByClassName( 'idt_answer' );
                IDT_bind_click_elements();
            }
        },
        "leaf": {
            "render": () => {
                const IDT_NODE = IDT_TREE[ IDT_section ];
                IDT_div.innerHTML += "<div class='IDT_leaf'>" +
                        "<span class='IDT_leaf_text'>" +
                            IDT_NODE["text"] +
                        "</span>" +
                    "</div>";
            }
        }
    }

    IDT();

});

