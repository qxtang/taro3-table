#!/bin/bash

echo "--- BUILD START ---"

rm -rf build && \
mkdir build && \
cp src/index.js build/index.js && \
cp -r src/components build/components && \

echo "--- BUILD FINISH ---"
