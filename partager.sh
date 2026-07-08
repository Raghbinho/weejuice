#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Partage le site WeeJuice sur internet via Cloudflare Tunnel.
# Lance le serveur de production + un tunnel cloudflared.
# Usage :  ./partager.sh        (Ctrl+C pour arrêter)
# Aucun compte requis, pas de page de mot de passe.
# ─────────────────────────────────────────────────────────────
set -e
PORT=3000

# Réutilise le serveur s'il tourne déjà, sinon le démarre.
if curl -s -o /dev/null "http://localhost:$PORT"; then
  echo "✅ Serveur déjà lancé sur le port $PORT."
  SERVER_PID=""
else
  echo "🧃 Démarrage du serveur WeeJuice sur le port $PORT…"
  npx next start -p $PORT &
  SERVER_PID=$!
  echo "⏳ Attente du serveur…"
  until curl -s -o /dev/null "http://localhost:$PORT"; do sleep 0.5; done
  echo "✅ Serveur prêt."
fi

# Arrêt propre à la sortie (Ctrl+C) : on ne tue le serveur que si c'est nous qui l'avons lancé.
cleanup() {
  echo ""
  echo "⏹  Arrêt du tunnel…"
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null
  exit 0
}
trap cleanup INT TERM

echo ""
echo "🌍 Création du lien public Cloudflare… (garde ce terminal ouvert)"
echo "   Le lien apparaît ci-dessous, du type : https://xxxx-xxxx.trycloudflare.com"
echo ""

# Tunnel éphémère gratuit — affiche l'URL https://…trycloudflare.com
# --protocol http2 : contourne les réseaux qui bloquent QUIC/UDP (port 7844).
cloudflared tunnel --url "http://localhost:$PORT" --protocol http2
