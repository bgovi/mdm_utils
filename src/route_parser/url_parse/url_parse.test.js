/*


*/
const up = require('./index.js')

// test('Parse Url Query string', () => {
//     // let url_string = "y={'lt':5}"
//     let qkey = "col"
//     // let url_string = "y={lt:5}&x='abc'"
//     let url_string = "y=%7Blt:5%7D&x='abc'&z={neq:def}&xin={in:%5B 1,2,3 %5D}&xb={between:%5B 1,2 %5D}"

//     let x = up.ParseUrlQuery(url_string)['where']

//     expect(x).toEqual([
//         {'variable_name':'y',"value":'5', "operator":"lt"},
//         {'variable_name':'x',"value":"'abc'", "operator":"eq"},
//         {'variable_name':'z',"value":"def", "operator":"neq"},
//         {'variable_name':'xin',"value":["1","2","3"], "operator":"in"},
//         {'variable_name':'xb',"value":["1","2"], "operator":"between"},
    
    
//     ]) 
// });

// test('Parse Query Configurations')
test('Parse .where. Query Configurations', () => {
    let url_string = ".where.=[ {'x': 5 }, {'y': 7}, {'z': {'in':['a','b','c']} } ]"
    let x = up.ParseUrlQuery(url_string)['where']

    expect(x).toEqual([
        {'variable_name':'x',"value":'5', "operator":"eq"},
        {'variable_name':'y',"value":'7', "operator":"eq"},
        {'variable_name':'z',"value":['a','b','c'], "operator":"in"}    
    
    ]) 
});