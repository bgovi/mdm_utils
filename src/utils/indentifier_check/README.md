functions for checking identifiers.

dont allow things that could escape double quotes. 

quote_literal

only allow [a-zA-Z0-9]

ALPHA  DIGIT  "-" / "." / "_" / "~"

functions for checking valid string and escaping

naming convention in order to allow

list of reserved words

schema_name (a-zA-Z_0-9) cant start with number
table_name  (a-z_0-9) cant start with number
column_name (a-z_0-9) cant start with number
function_name
unique_constraint


role naming conventions:

r_xxx: a role that is for permissions. generally a singler permission or one that shares a theme
u_xxx: a role that represents a user
gr_xxx: a role that contains many roles
gu_xxx: a group of users. for check and user group permissions


schema naming convention: tbd
_udir_xxx
_gdir_xxx

moving tables and changing owners
