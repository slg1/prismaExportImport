## Prisma export/import

*(prisma 15.3, 1.27.3, 1.28.5)*

Received unexpected export failures.

Failure inserting into relationtable _CodeToObj with ids StringIdGCValue(cjtflw2ilq6qp08799l21x89r) and StringIdGCValue(cjtfly6jxroq50879hp2avno8). Cause: duplicate key value violates unique constraint \"_CodeToObj_AB_unique\"\n  Detail: Key (\"A\", \"B\")=(cjtflw2biq6ni08798alm3tyl, cjtflwoqeqlnj0879ijz8xb29) already exists.

**Repoducibility/Probability :**
  very often fail

## To reproduce:
**Clone the repository:**
1. git clone https://github.com/slg1/prismaExportImport.git
2. cd prismaExportImport/
3. npm install

**get prisma token and copy in the index.js:**
1. /node_modules/.bin/prisma token
2. copy token in index.js file

**run index.js to load database:**
1. node_modules/.bin/prisma reset -f ;node_modules/.bin/prisma delete -f;node_modules/.bin/prisma deploy;node index.js

**export:**
1. rm -f /tmp/prismaLocal.zip;node_modules/.bin/prisma export --path /tmp/prismaLocal.zip 

**import:**
1. rm -rf .import/;node_modules/.bin/prisma reset -f ;node_modules/.bin/prisma delete -f;node_modules/.bin/prisma deploy;node_modules/.bin/prisma import --data /tmp/prismaLocal.zip

**result of test:**
Observe several traces in console (if no traces are print, redo the test from "run index.js to load database")
  "Failure inserting into relationtable _CodeToObj with ids StringIdGCValue(cjtfka7a2oglf0879ofll120t) and StringIdGCValue(cjtfkcdgypylu0879k2k9a994). Cause: duplicate key value violates unique constraint \"_CodeToObj_AB_unique\"\n  Detail: Key (\"A\", \"B\")=(cjtfka74nogi80879crln0530, cjtfkas5povi90879pqlt43c7) already exists."
