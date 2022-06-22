/**
 * This file contains all custom function
 */


/**
 * translate from HTML to BBCode
 *
 * @param htmlVersion the html text to parse
 * @returns {string} the BBCode version
 */
function translateToBBCode(htmlVersion){

    let r = new RegExp('<img','g')
    let arrayMatch = htmlVersion.split(r).map(line=>"[img]"+line.split(new RegExp("[\"|\']"))[1]+"[/img]").filter(line=>!line.includes("]undefined["))
    let arrayMatchBis = htmlVersion.split('<')
    let i =0
    for(let y=0;y<arrayMatchBis.length;y++){
        if(y > 0){
            arrayMatchBis[y] = "<" + arrayMatchBis[y]
        }
        if(arrayMatchBis[y].search(new RegExp('<img.*','g'))>=0){
            arrayMatchBis[y]=arrayMatch[i]
            i++
        }
    }
    htmlVersion = arrayMatchBis.join("")
    htmlVersion = htmlVersion.replaceAll(new RegExp("/ class=\".*\"", "ig"),"")
    htmlVersion = htmlVersion.replaceAll("<","[")
    htmlVersion = htmlVersion.replaceAll(">","]")
    htmlVersion = htmlVersion.replaceAll(new RegExp("h\\d", "g"),"b")
    htmlVersion = htmlVersion.replaceAll("[a","[url")
    htmlVersion = htmlVersion.replaceAll("[/a]","[/url]")
    htmlVersion = htmlVersion.replaceAll("[p]","")
    htmlVersion = htmlVersion.replaceAll("[/p]","")
    htmlVersion = htmlVersion.replaceAll("blockquote","quote")
    htmlVersion = htmlVersion.replaceAll("ul","list")
    htmlVersion = htmlVersion.replaceAll("[li]","[*]")
    htmlVersion = htmlVersion.replaceAll("[/li]","")
    htmlVersion = htmlVersion.replaceAll("[/ol]","[/list]")
    htmlVersion = htmlVersion.replaceAll("[ol]","[list=1]")
    htmlVersion = htmlVersion.replaceAll(" href=\"","=")
    return htmlVersion.replaceAll("\"]", "]")

}

/**
 * apply a translation action to an action provider (ex: button, input, div...)
 *
 * @param actionID the ID the node element to interact with
 * @param action the action to trigger (ex: "click", "change", "mouseenter",...)
 * @param editor the editor which contain the html to parse.
 * @param onTranslate a callback which is trigger on the parsing.
 */
function applyTranslateActionTo(actionID, action, editor, onTranslate){
    document.getElementById(actionID).addEventListener(action, () => {

        let content = document.querySelector('[prosemirror-editor="'+editor+'"]').querySelector(".ProseMirror");

        if(content){
            onTranslate(translateToBBCode(content.innerHTML))
        }

    })
}


function linksListener(elementToListen){

    elementToListen.addEventListener('keypress', (event) => {

        let pressedChar = String.fromCharCode(event.which);

        if(/\s/.test(pressedChar)) {//space bar press

            let linkNodeToInsert = document.createElement('a');
            linkNodeToInsert.href = "yrdy";

            elementToListen.insertAdjacentHTML(linkNodeToInsert, elementToListen.children[1])

        }
    })


}



if(typeof module !== 'undefined'){//for test purposes
    module.exports.translateToBBCode = translateToBBCode;
}
