/*
It looks like you may have been close based on your comment to @ebohlman's answer. 
You can use WHERE id = ANY($1::int[]). PostgreSQL will convert the array to the type the parameter is cast to in $1::int[].
So here's a contrived example that works for me:

Is type conversion necessary? probably

https://stackoverflow.com/questions/10720420/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query
*/