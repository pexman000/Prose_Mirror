
/**
 * translate from HTML to BBCode
 *
 * @param htmlVersion
 * @returns {string}
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
    htmlVersion = htmlVersion.replaceAll("<","[")
    htmlVersion = htmlVersion.replaceAll(">","]")
    htmlVersion = htmlVersion.replaceAll("h1","b")
    htmlVersion = htmlVersion.replaceAll("h2","b")
    htmlVersion = htmlVersion.replaceAll("h3","b")
    htmlVersion = htmlVersion.replaceAll("[a","[url")
    htmlVersion = htmlVersion.replaceAll("[/a]","[/url]")
    htmlVersion = htmlVersion.replaceAll("[p]","")
    htmlVersion = htmlVersion.replaceAll("[/p]","")
    htmlVersion = htmlVersion.replaceAll("backquote","quote")
    htmlVersion = htmlVersion.replaceAll("ul","list")
    htmlVersion = htmlVersion.replaceAll("[li]","[*]")
    htmlVersion = htmlVersion.replaceAll("[/li]","")
    htmlVersion = htmlVersion.replaceAll(" href=\"","=")
    return htmlVersion.replaceAll("\"]", "]")

}

function applyTranslateActionTo(actionID, action, editor, onTranslate){
    document.getElementById(actionID).addEventListener(action, () => {

        let content = document.querySelector('[prosemirror-editor="'+editor+'"]').querySelector(".ProseMirror");

        if(content){
            onTranslate(translateToBBCode(content.innerHTML))
        }

    })
}



