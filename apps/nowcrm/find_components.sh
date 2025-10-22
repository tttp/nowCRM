#!/bin/bash
# This script searches the current directory recursively for component declarations.
# It looks for lines matching:
#    const ComponentName = () => {
# Only files within directories whose paths include "features", "components", or "pages" are searched.
# The "node_modules" folder is ignored.
#
# Usage: ./find_components.sh

# Find files in directories matching the desired patterns while pruning node_modules.
find . -type d -name "node_modules" -prune -o \
  -type f \( -path "*/features/*" -o -path "*/components/*" -o -path "*/pages/*" \) -print0 |

# Search within these files for lines that match the component declaration pattern.
xargs -0 grep -H -n -E "const\s+[A-Za-z0-9_]+\s*=\s*\(\)\s*=>\s*\{"



yarn remove

