#/bin/bash

set -Eeuo pipefail

SOURCE_URL="https://raw.githubusercontent.com/SukkaLab/ruleset.skk.moe/refs/heads/master/sing-box/non_ip/domestic.json"
TEMP_PATH="/tmp/non_ip/domestic.json"
OUTPUT_PATH="source/non_ip/domestic.json"

echo "non_ip/domestic.json: Removing com.cn ..."
mkdir -pv source/non_ip
curl -LSso "${TEMP_PATH}" --create-dirs "${SOURCE_URL}"
jq '(.rules[].domain_suffix | arrays) |= map(select(. != "com.cn"))' "${TEMP_PATH}" > "${OUTPUT_PATH}"
