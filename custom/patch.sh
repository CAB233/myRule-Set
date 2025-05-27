#!/bin/bash

jq '(.rules[].domain_suffix | arrays) |= map(select(. != "com.cn"))' non_ip/domestic.json | sponge non_ip/domestic.json
