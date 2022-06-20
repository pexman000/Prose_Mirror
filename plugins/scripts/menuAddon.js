/**
 * Put mark icon in menu as active base on the original implementation
 *
 *
 * @param state current state of the EditorView
 * @param type which mark type as to be active
 * @returns {boolean|*}
 */
function markActive(state, type) {
    let {from, $from, to, empty} = state.selection
    if (empty) return !!type.isInSet(state.storedMarks || $from.marks())
    else return state.doc.rangeHasMark(from, to, type)
}



/**
 * Insert an emoji symbol in the EditorView
 *
 * @param type which emoji type has to be added
 * @param node
 * @returns {(function(*, *): (boolean))|*}
 */
function insertEmoji(type, node) {

    return function(state, dispatch) {
        let {$from} = state.selection, index = $from.index()
        if (!$from.parent.canReplaceWith(index, index, node.emoji))
            return false
        if (dispatch)
            dispatch(state.tr.replaceSelectionWith(node.emoji.create(type.emoji)))
        return true
    }
}

const themeList = []

/**
 * add a custom theme to the theme list.
 *
 * @param name the theme name (ex: "dark", "light)
 * @param targetClassName the class associate to the theme.
 */
function addTheme(name, targetClassName){
    themeList.push({
        name: name,
        className: targetClassName
    })
}

/**
 * apply the theme by adding the associate theme class name.
 *
 * @param theme the theme name to search.
 * @param element the targeted element to apply the theme.
 */
function applyTheme(theme, element){
    element.classList.add(themeList.find((savedTheme) => savedTheme.name === theme).className)
}






//create a schema for each editor on the page.
for(let editor of editorsSchema){

    //build the menu view
    let menuBuild = buildMenuItems(editor.schema)

    //get the style specified in the HTML.
    let styles = editor.editor.attributes['prosemirror-available-style'].value

    //if the specified styles include underline add it to the client menu
    if(styles.includes('underline')) {

        let menuItem = new MenuItem({
            title: "Souligner",
            label: "U",
            class: "ProseMirror-icon",
            run: commands.toggleMark(editor.schema.marks.underline),
            active: (state) => {
                return markActive(state, editor.schema.marks.underline)
            }
        })

        if( menuBuild.inlineMenu[0].length > 2){
            menuBuild.inlineMenu[0].splice(2, 0, menuItem)//put next to Italic
        }else{
            menuBuild.inlineMenu[0].push(menuItem)
        }


    }



    if(styles.includes('video-link')){
        let menuItem = new MenuItem({
            title: "Video",
            label: "V",
            class: "ProseMirror-icon",
            run: (state) => {
                let {$from, $to} = state.selection;
                state.tr.replaceSelectionWith(editor.schema.nodes.video_link.create(state.selection))
                return true
            },

        })
        menuBuild.inlineMenu[0].push(menuItem)

    }


    if(styles.includes('emoji')){
        menuBuild.fullMenu[1].push( new Dropdown(
            emojis.map((emoji) => new MenuItem({
                label: emoji.emoji,
                run: insertEmoji(emoji, editor.schema.spec.nodes)
            })),
            { label: 'Emojis' }
        ))
    }

    editor.menu = menuBuild;
}
