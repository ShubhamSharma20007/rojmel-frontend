export const handleSplitName = (str: string) => {
    let newStr = ""
    if (str.includes(" ")) {
        str.split(" ").map((item, index) => {
            if (index === 0) {
                newStr += item.charAt(0).toUpperCase()
            }
            if (str.split(" ").length === index + 1) {
                newStr += item.charAt(0).toUpperCase()
            }

        })
    }
    else {
        newStr = str.charAt(0).toUpperCase()
    }
    return newStr
}