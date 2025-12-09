#!/bin/bash
# import_to_mongo.sh
# Plataforma de Streaming de Música - Importação MongoDB
# Entrega 4: Script de Importação de Dados JSON
# Grupo 44: Afonso Ferreira (64117), José Miguel Resende (62513), Tomás Farinha (64253)

# ============================================
# CONFIGURAÇÃO
# ============================================

MONGO_URI="mongodb://bd044:julio123@appserver.alunos.di.fc.ul.pt:27017"
DB_NAME="bd044"
DATA_DIR="/tmp"  # Pasta onde o PostgreSQL exportou os ficheiros JSON

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# FUNÇÕES
# ============================================

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

check_file() {
    if [ ! -f "$1" ]; then
        print_error "Arquivo $1 não encontrado!"
        exit 1
    fi
}

# ============================================
# VALIDAÇÃO PRÉ-IMPORTAÇÃO
# ============================================

print_header "VALIDAÇÃO PRÉ-IMPORTAÇÃO"

# Verificar se MongoDB está rodando
if ! mongosh --quiet --eval "db.version()" > /dev/null 2>&1; then
    print_error "MongoDB não está rodando!"
    echo "Inicie o MongoDB com: mongod --dbpath /data/db"
    exit 1
fi
print_success "MongoDB está rodando"

# Verificar arquivos JSON
FILES=(
    "$DATA_DIR/playHistory.json"
    "$DATA_DIR/playlists.json"
    "$DATA_DIR/trackMetadata.json"
    "$DATA_DIR/userRecommendations.json"
)

for file in "${FILES[@]}"; do
    check_file "$file"
done
print_success "Todos os arquivos JSON encontrados"

# ============================================
# IMPORTAÇÃO DE DADOS
# ============================================

print_header "IMPORTAÇÃO DE DADOS"

# Dropar database existente (ATENÇÃO: apenas para testes)
echo -n "Deseja dropar a database existente? (y/N): "
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    mongosh "$MONGO_URI/$DB_NAME" --quiet --eval "db.dropDatabase()"
    print_success "Database dropada"
fi

# Função de importação genérica
import_collection() {
    local file=$1
    local collection=$2
    
    echo ""
    echo "Importando $collection..."
    
    # Extrair array JSON do arquivo
    jq -c '.[]' "$file" > "${file}.tmp"
    
    # Importar via mongoimport
    if mongoimport \
        --uri="$MONGO_URI/$DB_NAME" \
        --collection="$collection" \
        --file="${file}.tmp" \
        --quiet; then
        
        local count=$(mongosh "$MONGO_URI/$DB_NAME" --quiet \
            --eval "db.$collection.countDocuments()" | tail -1)
        print_success "$collection: $count documentos importados"
    else
        print_error "Erro ao importar $collection"
        exit 1
    fi
    
    # Limpar arquivo temporário
    rm -f "${file}.tmp"
}

# Importar todas as coleções (nomes consistentes com a verificação)
import_collection "$DATA_DIR/playHistory.json" "playHistory"
import_collection "$DATA_DIR/playlists.json" "playlists"
import_collection "$DATA_DIR/trackMetadata.json" "trackMetadata"
import_collection "$DATA_DIR/userRecommendations.json" "userRecommendations"

# ============================================
# CRIAÇÃO DE ÍNDICES
# ============================================

print_header "CRIAÇÃO DE ÍNDICES"

mongosh "$MONGO_URI/$DB_NAME" --quiet --eval '
// playHistory
db.playHistory.createIndex({user_id: 1, played_at: -1});
db.playHistory.createIndex({"track.track_id": 1});
db.playHistory.createIndex({"track.title": "text", "track.artist": "text"});
db.playHistory.createIndex({played_at: -1});

// playlists
db.playlists.createIndex({user_id: 1});
db.playlists.createIndex({privacy: 1, "stats.play_count": -1});
db.playlists.createIndex({"collaborators.user_id": 1});

// trackMetadata
db.trackMetadata.createIndex({track_id: 1}, {unique: true});
db.trackMetadata.createIndex({genre: 1, "stats.total_plays": -1});
db.trackMetadata.createIndex({tags: 1});
db.trackMetadata.createIndex({title: "text", artist: "text"});

// userRecommendations
db.userRecommendations.createIndex({user_id: 1}, {unique: true});
db.userRecommendations.createIndex({expires_at: 1}, {expireAfterSeconds: 0});

print("✓ Todos os índices criados");
'

print_success "Índices criados com sucesso"

# ============================================
# VALIDAÇÃO PÓS-IMPORTAÇÃO
# ============================================

print_header "VALIDAÇÃO PÓS-IMPORTAÇÃO"

# Validar contagens
mongosh "$MONGO_URI/$DB_NAME" --quiet --eval '
const collections = [
    "playHistory",
    "playlists",
    "trackMetadata",
    "userRecommendations"
];

print("\nContagem de documentos:");
collections.forEach(coll => {
    const count = db[coll].countDocuments();
    print(`  ${coll}: ${count}`);
});

print("\nÍndices criados:");
collections.forEach(coll => {
    const indexes = db[coll].getIndexes();
    print(`  ${coll}: ${indexes.length} índices`);
});
'

# ============================================
# QUERIES DE TESTE
# ============================================

print_header "QUERIES DE TESTE"

echo "Executando queries de validação..."

mongosh "$MONGO_URI/$DB_NAME" --quiet --eval '
print("\n1. Top 5 tracks mais reproduzidas:");
db.playHistory.aggregate([
    {$group: {
        _id: "$track.track_id",
        title: {$first: "$track.title"},
        plays: {$sum: 1}
    }},
    {$sort: {plays: -1}},
    {$limit: 5}
]).forEach(doc => print(`   ${doc.title}: ${doc.plays} plays`));

print("\n2. Playlists públicas:");
const publicCount = db.playlists.countDocuments({privacy: "public"});
print(`   ${publicCount} playlists públicas encontradas`);

print("\n3. Tracks com lyrics:");
const lyricsCount = db.trackMetadata.countDocuments({lyrics: {$ne: null}});
print(`   ${lyricsCount} tracks com lyrics`);
'

print_success "Queries de teste executadas"

# ============================================
# RESUMO FINAL
# ============================================

print_header "RESUMO DA IMPORTAÇÃO"

echo ""
echo "✅ Importação concluída com sucesso!"
echo ""
echo "Próximos passos:"
echo "  1. Execute queries_mongodb.js para testar as 15 queries"
echo "  2. Inicie o serviço de sincronização com: node sync_service.js"
echo ""
echo "Comandos úteis:"
echo "  - Conectar ao MongoDB: mongosh $MONGO_URI/$DB_NAME"
echo "  - Ver collections: db.getCollectionNames()"
echo "  - Ver índices: db.playHistory.getIndexes()"
echo ""

cat > sync_service.js << 'EOF'