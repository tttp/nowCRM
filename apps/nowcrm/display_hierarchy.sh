#!/bin/bash
# This script recursively searches for component declarations in the current directory.
# It looks for lines matching:
#     const ComponentName = () => {
# It only searches files under directories whose paths include "features", "components", or "pages",
# and it ignores the node_modules folder.
#
# The output is displayed hierarchically:
#   - The file path (which shows the directory structure)
#   - The matching lines are indented underneath.
#
# Usage: ./display_hierarchy.sh

# Use 'find' to list relevant files, ignoring node_modules and restricting search to specific folders.
find . -type d -name "node_modules" -prune -o \
  -type f \( -path "*/features/*" -o -path "*/components/*" -o -path "*/pages/*" \) -print | sort | while read -r file; do
    # Search for the component declaration pattern in each file.
    # The regex matches lines like: const ComponentName = () => {
    matches=$(grep -n -E "const\s+[A-Za-z0-9_]+\s*=\s*\(\)\s*=>\s*\{" "$file")
    if [ -n "$matches" ]; then
        # Print the file path (this shows the hierarchical location).
        echo "$file"
        # Print each matching line, indented for clarity.
        echo "$matches" | sed 's/^/    /'
        echo  # Blank line for separation.
    fi
done
