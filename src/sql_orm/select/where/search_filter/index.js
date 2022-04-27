/*
This module handles the search and quickfilter options. search and quick filter utilize the 
to_tsvector and to_tsquery functionality. (Special character searching does not work in these cases. alphanumeric searching only)


// quick_filter: this is similar to the like clause, but all columns names in the columnMap are concatenated together
//     so that the quick_filter value is compared against all columns in a row.

Look into pg_trim index
https://stackoverflow.com/questions/17691579/removing-a-set-of-letters-from-a-string
translate('abcdef', 'ace', 'XYZ') --> 'XbYdZf'


select ab::text from accounts as ab;
                   ab                    
-----------------------------------------
 (2,a,b,z,"2021-12-21 16:46:33.066416")
 (1,a,b,z1,"2021-12-21 16:47:21.404825")
 (3,,,,"2022-04-14 12:15:55.218317")
 (4,,,,"2022-04-14 12:15:55.218317")


SELECT to_tsvector( 'postgraduate' ), to_tsquery( 'postgres:*' );
REPLACE ('ABC AA', 'A', 'Z')
//pre tsvector
//tsvector index?

https://www.postgresql.org/docs/current/textsearch-controls.html
SELECT title, ts_rank_cd(textsearch, query) AS rank
FROM apod, to_tsquery('neutrino|(dark & matter)') query
WHERE query @@ textsearch
ORDER BY rank DESC
LIMIT 10;

https://leandronsp.com/a-powerful-full-text-search-in-postgresql-in-less-than-20-lines
SELECT 
    courses.id,
    courses.title,
    courses.description,
    rank_title,
    rank_description,
    similarity
FROM 
    courses, 
    to_tsvector(courses.title || courses.description) document,
    to_tsquery('sales') query,
    NULLIF(ts_rank(to_tsvector(courses.title), query), 0) rank_title,
    NULLIF(ts_rank(to_tsvector(courses.description), query), 0) rank_description,
    SIMILARITY('sales', courses.title || courses.description) similarity
WHERE query @@ document OR similarity > 0
ORDER BY rank_title, rank_description, similarity DESC NULLS LAST

SELECT *, ts_rank( to_tsvector(courses::text), to_tsquery('improve') ) from courses 
ORDER BY ts_rank( to_tsvector(courses::text), to_tsquery('improve') )  desc;

convert to lexems and then search
remove stop words?
parse?
select to_tsvector('hola bob') @@ to_tsquery('ho:* | steve');

https://stackoverflow.com/questions/1497895/can-i-configure-postgresql-programmatically-to-not-eliminate-stop-words-in-full

Include stop words?


select to_tsvector('adam') @@  (to_tsquery('simple','a:*')||to_tsquery('bob | steve') );

//use simple if only a few letters?
*/

const rp = require('../../../../route_parser')
const sutil = require('../../../../sutils')

let tsquery_options = {'to_tsquery':'to_tsquery', 'plainto_tsquery':'plainto_tsquery', 
    'phraseto_tsquery':'phraseto_tsquery', 'websearch_to_tsquery':'websearch_to_tsquery',
    //for simple ts_query
    'to_tsquery_simple':'to_tsquery', 'plainto_tsquery_simple':'plainto_tsquery', 
    'phraseto_tsquery_simple':'phraseto_tsquery', 'websearch_to_tsquery_simple':'websearch_to_tsquery'
}


/*
Commont parameters:
query_string_pholder:
quoted_object_name:
tsquery_function:
tsq_name:
tsv_name:
tsr_name:
is_tsvector: (bool)

need to quote identifier
*/

let default_tsq_name = '"-tsq_query-"'
let default_tsqv_name = '"-tsqv_vector-"'
let default_tsqr_name = '"-tsqr_rank-"'


function CreateFullTextSearch(query_string_pholder, quoted_object_name, tsquery_function, tsq_name, tsv_name, tsr_name, is_tsvector=false) {
    /*
    Function creates parameters necessary for creating search functionality. The values should be assembled into a select statement.
    Below is example of whats returned. Everything below the from statement is used to create search functionality.
        FROM table_name,
        to_tsvector(courses.title || courses.description) document,
        to_tsquery('sales') query,
        NULLIF(ts_rank(to_tsvector(courses.title), query), 0) rank_title,
        NULLIF(ts_rank(to_tsvector(courses.description), query), 0) rank_description,
        SIMILARITY('sales', courses.title || courses.description) similarity
        WHERE query @@ document OR similarity > 0
        ORDER BY rank
    */
    let tsvector = CreateTsVectorCommand(quoted_object_name, tsv_name )
    let tsquery  = CreateTsQueryCommand(tsquery_function, query_string_pholder, tsq_name, is_tsvector)
    let tsrank   = CreateRank(tsv_name, tsq_name, tsr_name )

    //need to wrap names in double quotes.
    if (tsq_name !== default_tsq_name)  { tsq_name = sutil.ReturnQuotedColumnName(tsq_name) }
    if (tsv_name !== default_tsqv_name) { tsv_name = sutil.ReturnQuotedColumnName(tsv_name) }
    if (tsr_name !== default_tsqr_name) { tsr_name = sutil.ReturnQuotedColumnName(tsr_name) }


    let where_stmt   = `${tsq_name} @@ ${tsv_name}`
    let orderby_stmt = `${tsr_name} DESC`
    return {'from': [tsvector, tsquery, tsrank], 'where': where_stmt, 'orderby': orderby_stmt}
}

//need to pass into bool_stmt
function QuickFilterBoolean(  query_string_pholder, quoted_object_name, tsquery_function, is_tsvector = true  ) {
    //tsvector @@ tsquery boolean statement for where filters.
    let tq_cmd = CreateTsQueryCommand(tsquery_function, query_string_pholder)
    let tv_cmd = CreateTsVectorCommand (quoted_object_name, "", is_tsvector)
    return ( `${tq_cmd} @@ ${tv_cmd}`  )
}

function CreateTsQueryCommand (tsquery_function, query_string_pholder, variable_name = "") {
    let vn = variable_name
    if (vn === default_tsq_name) {}
    else if (vn !== "") {
        rp.CheckIdentifierError(vn)
        vn = sutil.ReturnQuotedColumnName(vn)
    }
    let fn = ReturnTsQueryFunction(tsquery_function)
    let qp = query_string_pholder
    if (tsquery_function.includes('_simple')) {
        //doesnt remove stop words
        return `${fn}( 'simple', ${qp} ) ${vn}`.trim()
    } else {
        //default functions removes stop words
        return `${fn}( ${qp} ) ${vn}`.trim()
    }
}

function CreateTsVectorCommand (quoted_object_name,  variable_name = "", is_tsvector=false) {
    //column_name or table_name
    let vn = variable_name
    if (vn === default_tsqv_name) {}
    if (vn !== "") {
        rp.CheckIdentifierError(vn)
        vn = sutil.ReturnQuotedColumnName(vn)
    }
    if (!is_tsvector) {
        return `to_tsvector( ${quoted_object_name}::text ) ${vn}`.trim()   
    } else {
        return `to_tsvector( ${quoted_object_name} ) ${vn}`.trim()
    }
}

function CreateRank(query_cmd, document_cmd, rank_name) {
    let rn = rank_name
    if (query_cmd !== default_tsq_name) { 
        rp.CheckIdentifierError(query_cmd)
        query_cmd = sutil.ReturnQuotedColumnName(query_cmd)        
    }
    if (document_cmd !== default_tsqv_name) { 
        rp.CheckIdentifierError(document_cmd) 
        document_cmd = sutil.ReturnQuotedColumnName(document_cmd)    
    }
    if (rn !== default_tsqr_name) { 
        rp.CheckIdentifierError(rn)
        rn = sutil.ReturnQuotedColumnName(rn)
    }
    return `to_tsrank( ${query_cmd} , ${document_cmd} ) ${rn}`
}

function TsQueryStringProcess( query_string ) {
    /*
        //this function converts query string into lexems.
        //removes special characters. replaces spaces with space then
        //replaces space with :* | 
        //the :* with match partial match i.e. a with adam and alex
    */
    let qx  = query_string.trim().replace(/\s\s+/g, ' ')
    let qx1 = qx.replace(/[^a-zA-Z0-9 ]/g, "")
    let qx2 =qx1.trim().replaceAll(" ", ":* ")
    if (qx2.trim() !== "") { return qx2 + ":*" }
    return qx2
}

function IsSimpleQuery( query_string ) { 
    /*
    Most stop words are short i.e. a, of. But for short text searches
    they maybe the begginning of a name. So the simple parameter for to_tsquery should
    be used.
    */
    return query_string.trim().length < 3 
}


function ReturnTsQueryFunction(tsquery_function) {
    //returns string representing how to process query string for text search
    if (tsquery_function === null) {return tsquery_options['plainto_tsquery']}
    try { return tsquery_options[tsquery_function] } 
    catch (e) {
        throw new Error (`invalid tsquery function ${tsquery_funciton}: valid options are ${tsquery_options}`)
    }
}

module.exports = {
    "QuickFilterBoolean": QuickFilterBoolean,
    "CreateFullTextSearch": CreateFullTextSearch,
    "IsSimpleQuery": IsSimpleQuery,
    "TsQueryStringProcess": TsQueryStringProcess,
    "ReturnTsQueryFunction": ReturnTsQueryFunction,
    "CreateTsQueryCommand": CreateTsQueryCommand,
    "CreateTsVectorCommand": CreateTsVectorCommand,
    "CreateRank": CreateRank
}