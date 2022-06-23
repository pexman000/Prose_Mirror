/*
This file contains the mains menu build functions

*/

const _emojis = (typeof module !== 'undefined')? require("./static-data").emojis : emojis;

/**
 * Put mark icon in menu as active. Base on the original implementation
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
 * (Work in progress, not functional at this time)
 *
 * @param type which emoji type has to be added
 * @param node the node type.
 * @returns {(function(*, *): (boolean))}
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

//----------------| [START] Theme tools |-------------------

const themeList = []

/**
 * add a custom theme to the theme list.
 *
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

//----------------| [END] Theme tools |-------------------


/**
 * Made to add a prosemirror menu attribute to an existing editor object
 * ProseMirror already make the menu based on the schema this function is mainly
 * use to add some custom ones (underline, videos links, emoji).
 * It has to be run after the schema has been built. (CF. schema.js)
 *
 * @param {ProseMirror} ProseMirror the proseMirror plugin.
 * @param {JSON} editor the editor object.
 * @param {Array} styles the list of styles setup in the html editor.
 */
function buildMenu(ProseMirror, editor, styles){


    if(!ProseMirror)console.error("Err: menuAddon.js > buildMenu(...):parameter 'ProseMirror' is undefined")


    if(!editor)console.error("Err: menuAddon.js > buildMenu(...):parameter 'editor' is undefined")


    if(!styles) console.error("Err: menuAddon.js > buildMenu(...):parameter 'styles' is undefined")


    if(!ProseMirror || !editor || !styles){
        console.warn("Since not all parameters are defined, no menu can be build")
        return;
    }

    if(!editor.schema){
        console.error("Err: menuAddon.js > buildMenu(...): The editor does not have a defined schema. exit")
        return;
    }

    let {MenuItem, Dropdown} = ProseMirror.menu;
    let {buildMenuItems} = ProseMirror.example_setup;
    let {commands} = ProseMirror;

    //build the menu view
    let menuBuild = buildMenuItems(editor.schema)

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
            label: "Video",
            class: "ProseMirror-icon",
            run: (state, view) => {
                commands.toggleMark(editor.schema.marks.video_link)(state, view)
                console.log(state);
            },
            active: (state) => {
                return markActive(state, editor.schema.marks.video_link)
            }
        })
        menuBuild.inlineMenu[0].push(menuItem)

    }


    if(styles.includes('emoji')){
        menuBuild.fullMenu[1].push( new Dropdown(
            _emojis.map((emoji) => new MenuItem({
                label: emoji.emoji,
                run: insertEmoji(emoji, editor.schema.spec.nodes)
            })),
            { label: 'Emojis' }
        ))
    }

    editor.menu = menuBuild;

}

if(typeof module !== 'undefined'){//for test purposes
    module.exports.buildMenu = buildMenu
    module.exports.applyTheme = applyTheme
    module.exports.addTheme = addTheme
}