/**
 *
 * @param {String} type
 * @param attributes
 * @param {[Node]} children
 */
function o(type, attributes, children= []){

    let object = document.createElement(type);
    Object.keys(attributes).forEach(function(key){object.setAttribute(key, attributes[key])});
    if(children)for(let child of children) object.appendChild(child);
    return object;

}

function render(rootID, view){
    document.getElementById(rootID).appendChild(view)
}