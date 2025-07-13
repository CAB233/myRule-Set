#!/bin/bash

set -Eeuo pipefail

function patch_domestic() {
    local url="pre-build/sing-box/non_ip/domestic.json"
    local temp_file="/tmp/non_ip/domestic.json"
    local output_file="source/non_ip/domestic.json"

    echo "non_ip/domestic.json: Removing com.cn ..."
    curl -LSso "$temp_file" --create-dirs "$url"
    jq '(.rules[].domain_suffix | arrays) |= map(select(. != "com.cn"))' "$temp_file" > "$output_file"
}
