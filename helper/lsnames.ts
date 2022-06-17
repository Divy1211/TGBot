function lsnames(str:string){
    let names = str.split("$")
    let names_str = names.join(" ")
    return names_str.trim()
}
export default lsnames