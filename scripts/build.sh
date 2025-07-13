#!/bin/bash

set -Eeuo pipefail

function build_l4d2_block() {
    local url="https://github.com/yxnan/block-l4d2-rpg-servers/releases/download/latest/rpglist.json"
    local temp_file="/tmp/ip/l4d2.json"
    local output_file="source/ip/l4d2.json"

    echo "ip/l4d2.json: Building L4D2 Block List ..."
    curl -LSso "$temp_file" --create-dirs "$url"
    jq '{version: 2, rules: [{ip_cidr: (.data | map(.raddr + "/32"))}]} ' "$temp_file" > "$output_file"
}

function merge() {
    local root_dir="pre-build/sing-box"
    local public_dir="public"
    local dir1="domainset"
    local dir2="non_ip"
    local dir3="ip"
    local temp_dir

    temp_dir=$(mktemp -d)
    file1="$temp_dir/file1.txt"
    file2="$temp_dir/file2.txt"
    _file1="$temp_dir/_file1.txt"
    _file2="$temp_dir/_file2.txt"
    common="$temp_dir/common.txt"

    find "$root_dir/$dir1" -type f > "$file1"
    find "$root_dir/$dir2" -type f > "$file2"
    awk -F'/' '{print $NF}' "$file1" | sort > "$_file1"
    awk -F'/' '{print $NF}' "$file2" | sort > "$_file2"
    comm -12 "$_file1" "$_file2" > "$common"
    
    echo "Merging domainset and non_ip ..."
    grep -v '^ *#' "$common" | while IFS= read -r filename
    do
        sing-box rule-set merge "$public_dir/$dir1/$filename" \
            -c "$root_dir/$dir1/$filename" \
            -c "$root_dir/$dir2/$filename"
        rm -v "$root_dir/$dir2/$filename"
    done
    cp -v "$root_dir/$dir1"/* "$public_dir/$dir1/"
    cp -v "$root_dir/$dir2"/* "$public_dir/$dir1/"
    cp -v "$root_dir/$dir3"/* "$public_dir/$dir3/"
}

build_l4d2_block
merge
