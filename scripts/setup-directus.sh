#!/bin/bash
# ===========================================
# MedicusUnion KZ - Directus Collection Setup
# ===========================================
# Run after `docker compose up -d` and Directus is healthy.
# This script creates the consultation_requests collection,
# configures fields, and sets public create-only permissions.
#
# Usage:
#   chmod +x scripts/setup-directus.sh
#   ./scripts/setup-directus.sh
#
# Requires: curl, jq (optional, for pretty output)

set -euo pipefail

# Load env vars
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

BASE_URL="${PUBLIC_URL:-http://localhost:8055}"
ADMIN_EMAIL="${DIRECTUS_ADMIN_EMAIL:-admin@medicusunion.kz}"
ADMIN_PASSWORD="${DIRECTUS_ADMIN_PASSWORD:-change-me}"

echo "==> Authenticating with Directus at $BASE_URL..."
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
  | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "ERROR: Failed to authenticate. Is Directus running?"
  exit 1
fi
echo "    Authenticated."

# --- Create Collection (BACK-02) ---
echo "==> Creating consultation_requests collection..."
curl -s -X POST "$BASE_URL/collections" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "collection": "consultation_requests",
    "meta": {
      "icon": "mail",
      "note": "Lead capture form submissions from medicusunion.kz",
      "sort_field": "date_created"
    },
    "schema": {},
    "fields": [
      {
        "field": "id",
        "type": "integer",
        "meta": { "hidden": true, "interface": "input", "readonly": true },
        "schema": { "is_primary_key": true, "has_auto_increment": true }
      },
      {
        "field": "name",
        "type": "string",
        "meta": { "interface": "input", "required": true, "width": "half", "note": "Client name" },
        "schema": { "max_length": 255, "is_nullable": false }
      },
      {
        "field": "phone",
        "type": "string",
        "meta": { "interface": "input", "required": true, "width": "half", "note": "Phone in +7 format" },
        "schema": { "max_length": 30, "is_nullable": false }
      },
      {
        "field": "specialty",
        "type": "string",
        "meta": { "interface": "select-dropdown", "required": true, "width": "half", "note": "Requested specialty", "options": { "choices": [
          { "text": "Онкология", "value": "oncology" },
          { "text": "Кардиология", "value": "cardiology" },
          { "text": "Нейрохирургия", "value": "neurosurgery" },
          { "text": "Ортопедия", "value": "orthopedics" },
          { "text": "Радиология", "value": "radiology" },
          { "text": "ЭКО", "value": "ivf" },
          { "text": "Другое", "value": "other" }
        ]}},
        "schema": { "max_length": 50, "is_nullable": false }
      },
      {
        "field": "description",
        "type": "text",
        "meta": { "interface": "input-multiline", "width": "full", "note": "Case description (optional)" },
        "schema": { "is_nullable": true }
      },
      {
        "field": "status",
        "type": "string",
        "meta": { "interface": "select-dropdown", "width": "half", "note": "Request status", "options": { "choices": [
          { "text": "Новая", "value": "new" },
          { "text": "В работе", "value": "in_progress" },
          { "text": "Завершена", "value": "completed" },
          { "text": "Отклонена", "value": "rejected" }
        ]}},
        "schema": { "max_length": 20, "is_nullable": false, "default_value": "new" }
      },
      {
        "field": "date_created",
        "type": "timestamp",
        "meta": { "interface": "datetime", "readonly": true, "hidden": true, "special": ["date-created"], "width": "half" },
        "schema": {}
      }
    ]
  }' > /dev/null

echo "    Collection created."

# --- Set Public Permissions (BACK-03) ---
echo "==> Setting public create-only permissions..."
curl -s -X POST "$BASE_URL/permissions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "role": null,
    "collection": "consultation_requests",
    "action": "create",
    "fields": ["name", "phone", "specialty", "description"],
    "permissions": {},
    "validation": {}
  }' > /dev/null

echo "    Public create-only permission set."
echo ""
echo "==> Setup complete!"
echo "    - Collection: consultation_requests"
echo "    - Public access: POST only (create)"
echo "    - Admin panel: $BASE_URL/admin"
echo ""
echo "    Test with:"
echo "    curl -X POST $BASE_URL/items/consultation_requests \\"
echo "      -H 'Content-Type: application/json' \\"
echo "      -d '{\"name\":\"Test\",\"phone\":\"+7 (701) 123-45-67\",\"specialty\":\"oncology\"}'"
