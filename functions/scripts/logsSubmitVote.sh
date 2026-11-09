#!/usr/bin/env bash
# Revisa los logs de submitVote alrededor de una hora de Ecuador (UTC-5).
# Solo lectura: no modifica nada.
#
# Uso:
#   bash functions/scripts/logsSubmitVote.sh [FECHA] [HORA] [MINUTOS] [PROYECTO]
#   bash functions/scripts/logsSubmitVote.sh 2026-11-04 12:39 15 coffeeshow-vote
#
# FECHA    AAAA-MM-DD (por defecto: hoy)
# HORA     HH:MM en hora de Ecuador (por defecto: 12:39)
# MINUTOS  ventana antes y después de la hora (por defecto: 15)
# PROYECTO ID del proyecto de Firebase (por defecto: coffeeshow-vote)

set -euo pipefail

FECHA="${1:-$(date +%F)}"
HORA="${2:-12:39}"
MINUTOS="${3:-15}"
PROYECTO="${4:-coffeeshow-vote}"

# En Git Bash (Windows) gcloud puede no encontrar Python: usar el que trae el SDK.
python_sdk="$(dirname "$(command -v gcloud)")/../platform/bundledpython/python.exe"
if [[ -z "${CLOUDSDK_PYTHON:-}" && -f "${python_sdk}" ]]; then
  export CLOUDSDK_PYTHON="${python_sdk}"
fi

centro=$(date -d "${FECHA} ${HORA} -0500" +%s)
desde=$(date -u -d "@$((centro - MINUTOS * 60))" +%Y-%m-%dT%H:%M:%SZ)
hasta=$(date -u -d "@$((centro + MINUTOS * 60))" +%Y-%m-%dT%H:%M:%SZ)

base="resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"submitvote\" AND timestamp>=\"${desde}\" AND timestamp<=\"${hasta}\""

echo "Proyecto: ${PROYECTO}"
echo "Ventana:  ${FECHA} ${HORA} Ecuador ±${MINUTOS} min  (${desde} → ${hasta} UTC)"

echo
echo "=== 1. Errores y advertencias (submitVote falló, App Check rechazado, etc.) ==="
gcloud logging read "${base} AND severity>=WARNING" \
  --project="${PROYECTO}" --order=asc --limit=200 \
  --format='table(timestamp, severity, jsonPayload.message, jsonPayload.verifications, textPayload)'

echo
echo "=== 2. Verificaciones de App Check (VALID / INVALID / MISSING) ==="
gcloud logging read "${base} AND jsonPayload.message:\"Callable request verification\"" \
  --project="${PROYECTO}" --order=asc --limit=200 \
  --format='table(timestamp, severity, jsonPayload.message, jsonPayload.verifications.app)'

echo
echo "=== 3. Peticiones HTTP con estado (4xx/5xx = rechazo o error) ==="
gcloud logging read "${base} AND httpRequest.status>=100" \
  --project="${PROYECTO}" --order=asc --limit=200 \
  --format='table(timestamp, httpRequest.status, httpRequest.latency, httpRequest.userAgent)'
