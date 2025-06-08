#/bin/bash

set -Eeuo pipefail

SOURCE_URL="https://github.com/yxnan/block-l4d2-rpg-servers/releases/download/latest/rpglist.json"
TEMP_PATH="/tmp/ip/l4d2.json"
OUTPUT_PATH="source/ip/l4d2.json"

echo "ip/l4d2.json: Building L4D2 Block List ..."
mkdir -pv source/non_ip
curl -LSso "${TEMP_PATH}" --create-dirs "${SOURCE_URL}"
jq '{version: 2, rules: [{ip_cidr: (.data | map(.raddr + "/32"))}]} ' "${TEMP_PATH}" > "${OUTPUT_PATH}"
