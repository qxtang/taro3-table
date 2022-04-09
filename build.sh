#!/bin/bash

echo "--- BUILD START ---"

# reset
rm -rf build
mkdir build

# move
cp -r src/components/Table build

# complie
npx lessc build/Table/style.less build/Table/style.css -x
npx babel --config-file $(pwd)/babel.config.build.js build/Table/Table.tsx --out-file build/Table/Table.js

# clear
rm -rf build/Table/style.less
rm -rf build/Table/Table.tsx
rm -rf build/Table/types.ts

echo "--- BUILD FINISH ---"
