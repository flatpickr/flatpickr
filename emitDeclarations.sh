#!/bin/sh
tsc -p tsconfig.declarations.json
cp -RT types dist
cp src/typings.d.ts dist/typings.d.ts
rm -rf types