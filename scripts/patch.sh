#!/bin/bash

set -Eeuo pipefail

readonly root_dir="pre-build/sing-box"
readonly public_dir="public"

function patch_domestic() {
    local src_file="$root_dir/non_ip/domestic.json"
    local dst_file="$public_dir/domainset/domestic.json"

    echo "[INFO] $src_file: Removing com.cn ..."
    jq '(.rules[].domain_suffix | arrays) |= map(select(. != "com.cn"))' "$src_file" > "$dst_file"
}

function patch_ip_ruleset() {
    for src_file in "$root_dir"/ip/*.json; do
        local dst_file="$public_dir/ip/${src_file##*/}"

        echo "[INFO] $src_file: Only retain ip_cidr ..."
        jq '(.rules[] |= with_entries(select(.key == "ip_cidr")))' "$src_file" > "$dst_file"
    done
}

patch_domestic
patch_ip_ruleset
