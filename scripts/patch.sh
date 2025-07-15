#!/bin/bash

set -Eeuo pipefail

function patch_domestic() {
    local root_dir="pre-build/sing-box"
    local public_dir="public"

    local source="$root_dir/non_ip/domestic.json"
    local output_file="$public_dir/domainset/domestic.json"

    echo "non_ip/domestic.json: Removing com.cn ..."
    jq '(.rules[].domain_suffix | arrays) |= map(select(. != "com.cn"))' "$source" > "$output_file"
}

patch_domestic
