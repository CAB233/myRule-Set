#/bin/bash

set -Eeuo pipefail

SOURCE_URL="https://raw.githubusercontent.com/d3ward/toolz/master/src/d3host.adblock"
TEMP_PATH="/tmp/domainset/reject_extra"

echo "domainset/reject_extra: Building Extra Block List ..."
mkdir -pv source/domainset
curl -LSso "${TEMP_PATH}" --create-dirs "${SOURCE_URL}"
sing-box rule-set convert --type adguard "${TEMP_PATH}"
mv -v "${TEMP_PATH}.srs" "source/domainset/"
