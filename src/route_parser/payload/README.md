As an example a table has columns x and y

route_token:  contains permissions token for accesible routes for the payload

query_params: object or array of objects: contains data required for payload parsing:
    data: This is an object or an array of objects. 
    default_fields: {'column_name': 'type'} types: "__default__", "__null__", "__now__"
        if column has null value and column name is in default_fields. replace with default info
        if array of field_names will replace null with default or filter out row?



    For update/insert:
        set_fields: fields to include in update set command. If empty and using update route will
            use all fields in data.


    For upsert:
        on_conflict (column_name):
        on conflict on contraint constraint_name:

        action:
            do nothing:
            do update:

    bulk_insert, bulk_update: (create prepared_statement) 1,000 at a time?
        data should be array of objects.

Returning: *