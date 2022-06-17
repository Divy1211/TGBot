function remove_name(str:string,name:string){
    let names = str.split("$")
    const index = names.indexOf(name);
    if (index > -1) {
        names.splice(index, 1); // 2nd parameter means remove one item only
    }
    return names.join(" ")
}
export default remove_name;