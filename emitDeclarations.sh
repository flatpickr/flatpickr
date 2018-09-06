#!/bin/sh
./node_modules/typescript/bin/tsc -p tsconfig.declarations.json
os=`uname`
cp -RT types dist
cp src/typings.d.ts dist/typings.d.ts
rm -rf types

# https://github.com/Microsoft/TypeScript/issues/26439
fd '.d.ts' dist/l10n --exec sed -i -e 's/"types/"..\/types/g' {}
