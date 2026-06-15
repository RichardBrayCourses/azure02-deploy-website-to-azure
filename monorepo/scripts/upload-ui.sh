#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

if [ ! -d "$UI_DIST_DIR" ]; then
  echo "Build output not found at $UI_DIST_DIR"
  echo "Run: pnpm run ui:build"
  exit 1
fi

STORAGE_ACCOUNT_NAME=$(az deployment group show \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --name "$AZURE_DEPLOYMENT_NAME" \
  --query "properties.outputs.storageAccountName.value" \
  --output tsv)

echo ""
echo "Uploading $UI_DIST_DIR to the static website container in $STORAGE_ACCOUNT_NAME"
echo ""

az storage blob upload-batch \
  --account-name "$STORAGE_ACCOUNT_NAME" \
  --destination '$web' \
  --source "$UI_DIST_DIR" \
  --overwrite true \
  --auth-mode login \
  --output table

echo ""
echo "Upload complete."
echo ""
