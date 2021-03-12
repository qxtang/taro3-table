#!/bin/bash

echo "--- BUILD START ---"

# delete
rm -rf build && \
mkdir build

# move
cp -r src/components build/components

# clear
rm -rf build/components/Table/style.less && \

# lessc
#lessc src/components/Table/style.less build/components/Table/style.css -x

echo "--- BUILD FINISH ---"
