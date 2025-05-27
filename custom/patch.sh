#!/bin/bash

jq '(.rules[].domain_suffix | arrays) |= map(select(. != "com.cn"))' domestic.json | sponge domestic.json
