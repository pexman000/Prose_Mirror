
for(let editor of editorsSchema){

    let content = document.querySelector('[prosemirror-content-of="'+editor.editor.attributes['prosemirror-editor'].value+'"]')

    let startDoc = model.DOMParser.fromSchema(editor.schema).parse(content)

    window.view = new EditorView(editor.editor, {
        state: EditorState.create({
            doc: startDoc,
            plugins: exampleSetup({schema: editor.schema, menuContent: editor.menu.fullMenu})
        })
    })
}

