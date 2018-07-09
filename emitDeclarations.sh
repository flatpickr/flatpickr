#!/bin/sh
./node_modules/typescript/bin/tsc -p tsconfig.declarations.json
os=`uname`
if [[ "$os" == "Darwin" ]]; then
    cp -R types dist
else
    cp -RT types dist
fi
cp src/typings.d.ts dist/typings.d.ts
rm -rf types
