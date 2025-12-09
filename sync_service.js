// sync_service.js
// Plataforma de Streaming de Música - Serviço de Sincronização
// Entrega 4: CDC PostgreSQL → MongoDB
// Grupo 44: Afonso Ferreira (64117), José Miguel Resende (62513), Tomás Farinha (64253)

const { Client } = require('pg');
const { MongoClient } = require('mongodb');

// ============================================
// CONFIGURAÇÃO
// ============================================

const PG_CONFIG = {
    host: 'appserver.alunos.di.fc.ul.pt',
    port: 5432,
    database: 'bd044',
    user: 'bd044',
    password: 'julio123'
};

const MONGO_URI = 'mongodb://bd044:julio123@appserver.alunos.di.fc.ul.pt:27017/bd044?authSource=bd044';
const MONGO_DB = 'bd044';

// ============================================
// CONEXÕES
// ============================================

let pgClient;
let mongoClient;
let db;

async function connect() {
    // PostgreSQL
    pgClient = new Client(PG_CONFIG);
    await pgClient.connect();
    console.log('✓ Conectado ao PostgreSQL');
    
    // MongoDB
    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    db = mongoClient.db(MONGO_DB);
    console.log('✓ Conectado ao MongoDB');
}

// ============================================
// FUNÇÕES DE SINCRONIZAÇÃO
// ============================================

async function getTrackInfo(trackId) {
    const result = await pgClient.query(`
        SELECT 
            t.track_id,
            t.title,
            a.name as artist,
            al.title as album,
            t.genre::text,
            t.duration_secs
        FROM bd044_schema.tracks t
        LEFT JOIN bd044_schema.author_track at ON t.track_id = at.track_id
        LEFT JOIN bd044_schema.authors a ON at.author_id = a.author_id
        LEFT JOIN bd044_schema.albums al ON t.album_id = al.album_id
        WHERE t.track_id = $1
        LIMIT 1
    `, [trackId]);
    
    return result.rows[0] || null;
}

async function syncNewPlay(playData) {
    try {
        // Enriquecer com informações da track
        const trackInfo = await getTrackInfo(playData.track_id);
        
        if (!trackInfo) {
            console.error(`Track ${playData.track_id} não encontrada`);
            return;
        }
        
        // Preparar documento MongoDB
        const mongoDoc = {
            play_id: playData.play_id,
            user_id: playData.user_id,
            track: {
                track_id: trackInfo.track_id,
                title: trackInfo.title,
                artist: trackInfo.artist,
                album: trackInfo.album,
                genre: trackInfo.genre,
                duration_secs: trackInfo.duration_secs
            },
            played_at: new Date(playData.played_at),
            duration_listened: playData.duration_listened || trackInfo.duration_secs,
            device: 'web',  // Default
            location: { country: 'PT', city: 'Lisbon' },
            context: { source: 'playlist', playlist_id: null }
        };
        
        // Inserir no MongoDB
        await db.collection('playHistory').insertOne(mongoDoc);
        console.log(`✓ Play ${playData.play_id} sincronizado`);
        
        // Atualizar estatísticas em trackMetadata
        await db.collection('trackMetadata').updateOne(
            { track_id: trackInfo.track_id },
            {
                $inc: { 'stats.total_plays': 1 },
                $addToSet: { 'recent_listeners': playData.user_id }
            }
        );
        
    } catch (error) {
        console.error('Erro ao sincronizar play:', error);
    }
}

async function syncNewPlaylist(playlistData) {
    try {
        // Buscar dados completos da playlist
        const result = await pgClient.query(`
            SELECT 
                p.playlist_id,
                p.user_id,
                p.name,
                p.created_at,
                json_agg(
                    json_build_object(
                        'track_id', t.track_id,
                        'title', t.title,
                        'artist', a.name,
                        'duration_secs', t.duration_secs,
                        'added_at', pt.added_at,
                        'added_by', p.user_id,
                        'position', row_number() OVER (ORDER BY pt.added_at)
                    )
                ) as tracks
            FROM bd044_schema.playlists p
            LEFT JOIN bd044_schema.playlist_tracks pt ON p.playlist_id = pt.playlist_id
            LEFT JOIN bd044_schema.tracks t ON pt.track_id = t.track_id
            LEFT JOIN bd044_schema.author_track at ON t.track_id = at.track_id
            LEFT JOIN bd044_schema.authors a ON at.author_id = a.author_id
            WHERE p.playlist_id = $1
            GROUP BY p.playlist_id, p.user_id, p.name, p.created_at
        `, [playlistData.playlist_id]);
        
        if (result.rows.length === 0) return;
        
        const playlist = result.rows[0];
        
        // Preparar documento MongoDB
        const mongoDoc = {
            playlist_id: playlist.playlist_id,
            user_id: playlist.user_id,
            name: playlist.name,
            created_at: new Date(playlist.created_at),
            updated_at: new Date(),
            privacy: 'public',
            tracks: playlist.tracks || [],
            collaborators: [],
            stats: {
                total_tracks: (playlist.tracks || []).length,
                total_duration_secs: (playlist.tracks || [])
                    .reduce((sum, t) => sum + (t.duration_secs || 0), 0),
                play_count: 0,
                like_count: 0
            },
            audit_log: [{
                action: 'playlist_created',
                user_id: playlist.user_id,
                timestamp: new Date()
            }]
        };
        
        // Upsert no MongoDB
        await db.collection('playlists').updateOne(
            { playlist_id: playlist.playlist_id },
            { $set: mongoDoc },
            { upsert: true }
        );
        
        console.log(`✓ Playlist ${playlist.playlist_id} sincronizada`);
        
    } catch (error) {
        console.error('Erro ao sincronizar playlist:', error);
    }
}

// ============================================
// LISTENER POSTGRESQL (via NOTIFY/LISTEN)
// ============================================

async function setupListeners() {
    // Listener para novos plays
    pgClient.on('notification', async (msg) => {
        if (msg.channel === 'new_play') {
            const playData = JSON.parse(msg.payload);
            await syncNewPlay(playData);
        } else if (msg.channel === 'new_playlist') {
            const playlistData = JSON.parse(msg.payload);
            await syncNewPlaylist(playlistData);
        }
    });
    
    // Registrar listeners
    await pgClient.query('LISTEN new_play');
    await pgClient.query('LISTEN new_playlist');
    
    console.log('✓ Listeners configurados (new_play, new_playlist)');
}

// ============================================
// SINCRONIZAÇÃO BATCH (fallback)
// ============================================

async function batchSync() {
    console.log('\n=== SINCRONIZAÇÃO BATCH ===');
    
    try {
        // Sincronizar plays novos (últimas 24h)
        // Nota: Em produção, usaríamos uma tabela de controlo para evitar duplicados
        const recentPlays = await pgClient.query(`
            SELECT 
                ph.play_id,
                ph.user_id,
                ph.track_id,
                ph.played_at,
                ph.duration_listened
            FROM bd044_schema.play_history ph
            WHERE ph.played_at > NOW() - INTERVAL '24 hours'
            ORDER BY ph.play_id DESC
            LIMIT 10
        `);
        
        console.log(`✓ ${recentPlays.rows.length} plays encontrados nas últimas 24h`);
        
        // Em produção, sincronizaríamos cada play
        // for (const play of recentPlays.rows) {
        //     await syncNewPlay(play);
        // }
        
    } catch (error) {
        console.error('Erro na sincronização batch:', error.message);
    }
}

// ============================================
// MAIN
// ============================================

async function main() {
    console.log('\n========================================');
    console.log('SERVIÇO DE SINCRONIZAÇÃO PostgreSQL → MongoDB');
    console.log('========================================\n');
    
    try {
        await connect();
        await setupListeners();
        
        // Sincronização batch inicial
        await batchSync();
        
        // Sincronização batch periódica (a cada 5 minutos)
        setInterval(batchSync, 5 * 60 * 1000);
        
        console.log('\n✅ Serviço iniciado! Aguardando notificações...\n');
        
    } catch (error) {
        console.error('Erro fatal:', error);
        process.exit(1);
    }
}

// Tratamento de sinais
process.on('SIGINT', async () => {
    console.log('\n\nEncerrando serviço...');
    if (pgClient) await pgClient.end();
    if (mongoClient) await mongoClient.close();
    process.exit(0);
});

// Iniciar
main();