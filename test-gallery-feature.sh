#!/bin/bash

# Script de test pour Feature 3.2 - Galerie Communautaire
# Teste l'affichage des monstres publics, filtres, pagination

echo "🧪 Test Feature 3.2 - Galerie Communautaire"
echo "=========================================="
echo ""

BASE_URL="http://localhost:3000"

# Fonction pour afficher le résultat
function test_result() {
  if [ $1 -eq 0 ]; then
    echo "✅ $2"
  else
    echo "❌ $2"
  fi
}

# Test 1: API sans filtres
echo "📋 Test 1: GET /api/gallery (sans filtres)"
RESPONSE=$(curl -s "${BASE_URL}/api/gallery")
TOTAL=$(echo "$RESPONSE" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
echo "   Réponse: $RESPONSE"
echo "   Total monstres publics: ${TOTAL:-0}"
echo ""

# Test 2: Filtres niveau min
echo "📋 Test 2: GET /api/gallery?minLevel=5"
RESPONSE=$(curl -s "${BASE_URL}/api/gallery?minLevel=5")
echo "   Réponse: $RESPONSE"
echo ""

# Test 3: Filtres niveau max
echo "📋 Test 3: GET /api/gallery?maxLevel=10"
RESPONSE=$(curl -s "${BASE_URL}/api/gallery?maxLevel=10")
echo "   Réponse: $RESPONSE"
echo ""

# Test 4: Filtre état
echo "📋 Test 4: GET /api/gallery?state=happy"
RESPONSE=$(curl -s "${BASE_URL}/api/gallery?state=happy")
echo "   Réponse: $RESPONSE"
echo ""

# Test 5: Tri par niveau
echo "📋 Test 5: GET /api/gallery?sortBy=level"
RESPONSE=$(curl -s "${BASE_URL}/api/gallery?sortBy=level")
echo "   Réponse: $RESPONSE"
echo ""

# Test 6: Pagination
echo "📋 Test 6: GET /api/gallery?page=2&limit=5"
RESPONSE=$(curl -s "${BASE_URL}/api/gallery?page=2&limit=5")
PAGE=$(echo "$RESPONSE" | grep -o '"page":[0-9]*' | grep -o '[0-9]*')
LIMIT=$(echo "$RESPONSE" | grep -o '"limit":[0-9]*' | grep -o '[0-9]*')
echo "   Page: ${PAGE:-?}, Limit: ${LIMIT:-?}"
echo "   Réponse: $RESPONSE"
echo ""

# Test 7: Combinaison de filtres
echo "📋 Test 7: GET /api/gallery?minLevel=3&maxLevel=10&state=happy&sortBy=newest"
RESPONSE=$(curl -s "${BASE_URL}/api/gallery?minLevel=3&maxLevel=10&state=happy&sortBy=newest")
echo "   Réponse: $RESPONSE"
echo ""

echo "=========================================="
echo "✅ Tests API terminés"
echo ""
echo "⚠️  Note: Si total=0, aucun monstre public n'existe."
echo "   Pour tester complètement:"
echo "   1. Connectez-vous sur http://localhost:3000/dashboard"
echo "   2. Ouvrez un monstre dans /creature/[id]"
echo "   3. Activez 'Visibilité publique'"
echo "   4. Ouvrez http://localhost:3000/gallery"
