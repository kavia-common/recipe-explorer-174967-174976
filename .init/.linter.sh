#!/bin/bash
cd /home/kavia/workspace/code-generation/recipe-explorer-174967-174976/recipe_app_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

