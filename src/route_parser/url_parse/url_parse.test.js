/*


*/
const up = require('./index.js')

// test('Parse query string starts with ?', () => {
//     let url_string = "?x=1&y={'lt':5}"
//     expect(up.GetJsonFromUrl(url_string)
//     ).toMatchObject({'x': '1', 'y':"{'lt':5}"}) 
// });

// test('Parse query string', () => {
//     let url_string = "x=1&y={'lt':5}&z={'in':[1,2,3]}"
//     expect(up.GetJsonFromUrl(url_string)
//     ).toMatchObject({'x': '1', 'y':"{'lt':5}", "z":"{'in':[1,2,3]}" }) 
// });

// test('Parse Url Query string', () => {
//     // let url_string = "x=1&y={'lt':5}"
//     let url_string = "x=1"
//     let x = up.ParseUrlQuery(url_string)
//     console.log(x)

//     expect(x).toEqual([{'variable_name':'x',"value":'1', "operator":"eq"}]) 
// });

// test('Where string with equivalency statement', () => {
//     // let url_string = "x=1&y={'lt':5}"
//     let qkey = "col"
//     let url_string = "x=1&y=5"
//     let x = up.ParseUrlQuery(url_string)['where']

//     expect(x).toEqual([{'variable_name':'x',"value":'1', "operator":"eq"},{'variable_name':'y',"value":'5', "operator":"eq"}]) 
// });

test('Where string with json parse', () => {
    // let url_string = "y={'lt':5}"
    let qkey = "col"
    let url_string = "y={lt:5}"
    let x = up.ParseUrlQuery(url_string)['where']

    expect(x).toEqual([{'variable_name':'y',"value":'5', "operator":"lt"}]) 
});