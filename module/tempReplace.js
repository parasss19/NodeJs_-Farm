//replaceTemp function is used to replace all the name we used in templates files
module.exports = (template, element) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, element.productName)
    output = output.replace(/{%PRICE%}/g, element.price)
    output = output.replace(/{%IMAGE%}/g, element.image)
    output = output.replace(/{%FROM%}/g, element.from)
    output = output.replace(/{%NUTRIENTS%}/g, element.nutrients)
    output = output.replace(/{%QUANTITY%}/g, element.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, element.description)
    output = output.replace(/{%ID%}/g, element.id);

    if (!element.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    }
    return output
}

