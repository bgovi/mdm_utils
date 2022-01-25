/*
This parses json and creates the gridOptions object structure for aggrid

sort and ordering is server side. track save routes?

mathjs, jsonx, raw_js, aggrid_expression

refData new object in aggrid
expressions: map sql to expression?

cell_style: mathjs, jsonx, raw_js, aggrid_expression

reference_data: -> map object. returns valueGetter with map functions?
 
meta_data_column_name == ''

reference_data: [column, field, is_meta_column]

smartTags: TableLevel

smartTags: @headerName, @width, @tooltipField, @dataType, @editable, @valid=
    @references: @returns: @url?
    @description
    @claculation

for views. smart tags and user_id filters

notation_parse for reference

grid_column_rules: [
    {
        headerName:
        field:
        width:
        lockVisible:
        cellStyle:
        data_type: map -> reference
        valueGetter:{
            types
        },

        valueSetter: {
            types
        },
        valueFormatter: {
            types
        },
        refData: ?? 
        tooltipField
        checkboxSelection

        hide:
        lockVisible:
        valueSetter:
        valueParser:
        cellEditor:


        default_colors:
        error:
        warning:
        success:

        edit:
        non_edit:
        deleted:
        etc:

        is_required:
        allow_null:
        set_default:
        is_editable:
        send_to_server:
            raw or parse?
            send everything as string let postgres handle parse
    }
]


pages_button. add another?

CellClassRules (uses expressions)

cellClassRules: Rules that return true will have the class applied the second time. Rules that return false will have the class removed second time.
removes old cell styles


this.cellClassRules = {
    'rag-green': 'x < 20',
    'rag-amber': 'x >= 20 && x < 25',
    'rag-red': 'x >= 25',
};


floating filter
no client side filtering or sorting.

columntTypes: {}


url_params: column_order. column_size. default_sort_order.

*/