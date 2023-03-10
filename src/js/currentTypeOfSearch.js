export const currentTypeOfSearch = {
    popular: true,
    category: false,
    searchInput: false,

}
export function changeSearchType(newType){
 for(let key in currentTypeOfSearch){
    if(key === newType) {currentTypeOfSearch[key] = true}else {currentTypeOfSearch[key] = false}
 }   
}
