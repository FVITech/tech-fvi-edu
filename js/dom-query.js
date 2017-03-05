;(function DOMquery() {

window.$ = function(query) {
    let elements = document.querySelectorAll(query)
    if(elements.length === 1) return elements[0]
    return elements
}

// must be used on a node list, i.e. the return value of querySelectorAll
Object.prototype.addClass = function(...classNames) {
    if(!this[0]) {
        classNames.forEach(className => {
            this.classList.add(className)
        })
        return this
    }
    this.forEach(el => {
        classNames.forEach(className => {
            el.classList.add(className)
        })
    })
    return this
}

// must be used on a node list, i.e. the return value of querySelectorAll
Object.prototype.removeClass = function(...classNames) {
    if(!this[0]) {
        classNames.forEach(className => {
            this.classList.remove(className)
        })
        return this
    }
    this.forEach(el => {
        classNames.forEach(className => {
            el.classList.remove(className)
        })
    })
    return this
}

})();
