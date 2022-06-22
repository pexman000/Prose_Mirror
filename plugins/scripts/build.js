//build the editor for every editor available

//-------------| [START] import section |----------------


const _executeSetup = (typeof module !== 'undefined')? require('../scripts/setup').executeSetup : executeSetup;
const ProseMirrorJS = (typeof module !== 'undefined')? require('../scripts/proseMirror').ProseMirror : ProseMirror;
const _buildMenu = (typeof module !== 'undefined')? require("./menuAddon").buildMenu : buildMenu;
const _buildSchema =(typeof module !== 'undefined')? require("./schema").buildSchema : buildSchema;
const _applyTheme =(typeof module !== 'undefined')? require("./menuAddon").applyTheme : applyTheme;


//-------------| [END] import section |----------------



const editorsArray = document.querySelectorAll("[prosemirror-editor]");//query all editor on the document

/**
 * Build the complite editor from an HTML div with the attributes:
 * * = optional
 *  - prosemirror-editor="editor_name"
 *  - prosemirror-theme="dark/light/auto"*
 *  - prosemirror-available-style="bold;italic;underline..."*
 *
 * @param ProseMirror
 * @param editorObj
 */
function buildEditor(ProseMirror, editorObj){

    const {model, view, state, example_setup} = ProseMirror;
    const {EditorView} = view;
    const {EditorState} = state;
    const {exampleSetup} = example_setup;

    let stylesAttributes = editorObj.attributes['prosemirror-available-style'];

    let styles = [];

    if(stylesAttributes){//if a custom layout has been applied
        styles = stylesAttributes.value.split(';');
    }else{//default styles
        styles.push("bold")
        styles.push("italic")
        styles.push("underline")
    }

    //create the editor object
    let editor = {
        editor: editorObj
    }


    _buildSchema(ProseMirrorJS, editor, styles);
    _buildMenu(ProseMirrorJS, editor, styles)


    let content = document.querySelector('[prosemirror-content-of="'+editor.editor.attributes['prosemirror-editor'].value+'"]')
    content.style.display = "none";// hide the content div
    let startDoc = model.DOMParser.fromSchema(editor.schema).parse(content)

    window.view = new EditorView(editor.editor, {
        state: EditorState.create({
            doc: startDoc,
            plugins: exampleSetup({schema: editor.schema, menuContent: editor.menu.fullMenu})
        })
    })

    let theme = editor.editor.attributes['prosemirror-theme'];
    if(theme){
        _applyTheme(theme.value, editor.editor) //apply the theme editor
    }else{
        _applyTheme("auto", editor.editor)
    }
}




_executeSetup();

for(let editorObj of editorsArray){//loop through the existing editors
    buildEditor(ProseMirrorJS, editorObj)
}




if(typeof module !== 'undefined'){//for test purposes
    module.exports.buildEditor = buildEditor;
}

