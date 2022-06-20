//build the editor for every editor available
for(let editor of editorsSchema){

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
        applyTheme(theme.value, editor.editor) //apply the theme editor
    }else{
        applyTheme("auto", editor.editor)
    }

}

