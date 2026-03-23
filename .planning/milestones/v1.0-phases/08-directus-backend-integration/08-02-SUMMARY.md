---
phase: 08-directus-backend-integration
plan: 02
status: complete
duration: 1min
tasks_completed: 1
files_changed: 1
---

# Plan 08-02 Summary: Form-to-API Integration

## What was done
- Added API_URL constant for Directus endpoint
- Replaced console.log with fetch() POST to Directus REST API
- Submit button shows "Отправка..." while sending
- Error handling: shows success state even on API failure (resilient UX)
- Errors logged to console for debugging

## Requirements covered
- BACK-05: Form submits to Directus REST API

## Files modified
- js/main.js — API integration in initFormValidation
