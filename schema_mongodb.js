// schema_mongodb.js
// Plataforma de Streaming de Música - Implementação MongoDB
// Entrega 4: Modelação NoSQL e População de Dados
// Grupo 44: Afonso Ferreira (64117), José Miguel Resende (62513), Tomás Farinha (64253)

// ============================================
// PARTE 1: CONFIGURAÇÃO INICIAL
// ============================================

// Conectar à database
use('bd044');

// Dropar coleções existentes (para testes)
db.playHistory.drop();
db.playlists.drop();
db.trackMetadata.drop();
db.userRecommendations.drop();

print("✓ Collections antigas removidas");

// ============================================
// PARTE 2: CRIAÇÃO DE COLEÇÕES COM VALIDAÇÃO
// ============================================

// Coleção 1: playHistory
db.createCollection("playHistory", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["play_id", "user_id", "track", "played_at"],
      properties: {
        play_id: {
          bsonType: "int",
          description: "ID único da reprodução (do PostgreSQL)"
        },
        user_id: {
          bsonType: "int",
          description: "ID do utilizador (referência PostgreSQL)"
        },
        track: {
          bsonType: "object",
          required: ["track_id", "title", "artist", "duration_secs"],
          properties: {
            track_id: {bsonType: "int"},
            title: {bsonType: "string"},
            artist: {bsonType: "string"},
            album: {bsonType: "string"},
            genre: {bsonType: "string"},
            duration_secs: {bsonType: "int", minimum: 1}
          }
        },
        played_at: {
          bsonType: "date",
          description: "Timestamp da reprodução"
        },
        duration_listened: {
          bsonType: "int",
          minimum: 0,
          description: "Segundos efetivamente ouvidos"
        },
        device: {
          bsonType: "string",
          enum: ["web", "mobile_ios", "mobile_android", "desktop"]
        },
        location: {
          bsonType: "object",
          properties: {
            country: {bsonType: "string"},
            city: {bsonType: "string"}
          }
        },
        context: {
          bsonType: "object",
          properties: {
            source: {
              bsonType: "string",
              enum: ["playlist", "album", "artist", "search", "radio"]
            },
            playlist_id: {bsonType: ["int", "null"]}
          }
        }
      }
    }
  }
});

print("✓ Collection playHistory criada com validação");

// Coleção 2: playlists
db.createCollection("playlists", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["playlist_id", "user_id", "name", "tracks"],
      properties: {
        playlist_id: {bsonType: "int"},
        user_id: {bsonType: "int"},
        name: {
          bsonType: "string",
          minLength: 1,
          maxLength: 100
        },
        privacy: {
          bsonType: "string",
          enum: ["public", "private"]
        },
        tracks: {
          bsonType: "array",
          maxItems: 100,  // Limite para embedding
          items: {
            bsonType: "object",
            required: ["track_id", "title", "artist", "position"],
            properties: {
              track_id: {bsonType: "int"},
              title: {bsonType: "string"},
              artist: {bsonType: "string"},
              duration_secs: {bsonType: "int"},
              added_at: {bsonType: "date"},
              added_by: {bsonType: "int"},
              position: {bsonType: "int", minimum: 1}
            }
          }
        },
        collaborators: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              user_id: {bsonType: "int"},
              permissions: {
                bsonType: "array",
                items: {
                  bsonType: "string",
                  enum: ["add", "remove", "reorder"]
                }
              }
            }
          }
        },
        stats: {
          bsonType: "object",
          properties: {
            total_tracks: {bsonType: "int", minimum: 0},
            total_duration_secs: {bsonType: "int", minimum: 0},
            play_count: {bsonType: "int", minimum: 0},
            like_count: {bsonType: "int", minimum: 0}
          }
        }
      }
    }
  }
});

print("✓ Collection playlists criada com validação");

// Coleção 3: trackMetadata
db.createCollection("trackMetadata", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["track_id", "title", "artist"],
      properties: {
        track_id: {bsonType: "int"},
        title: {bsonType: "string"},
        artist: {bsonType: "string"},
        album: {bsonType: "string"},
        duration_secs: {bsonType: "int"},
        genre: {bsonType: "string"},
        release_date: {bsonType: "date"},
        lyrics: {bsonType: ["string", "null"]},
        mood: {
          bsonType: "array",
          items: {bsonType: "string"}
        },
        tags: {
          bsonType: "array",
          items: {bsonType: "string"}
        },
        stats: {
          bsonType: "object",
          properties: {
            total_plays: {bsonType: "int", minimum: 0},
            unique_listeners: {bsonType: "int", minimum: 0},
            avg_completion_rate: {bsonType: "double", minimum: 0, maximum: 1}
          }
        }
      }
    }
  }
});

print("✓ Collection trackMetadata criada com validação");

// Coleção 4: userRecommendations (com TTL)
db.createCollection("userRecommendations");

print("✓ Collection userRecommendations criada");

// ============================================
// PARTE 3: CRIAÇÃO DE ÍNDICES
// ============================================

print("\n=== CRIANDO ÍNDICES ===\n");

// Índices para playHistory
db.playHistory.createIndex(
  {user_id: 1, played_at: -1},
  {name: "idx_user_time", background: true}
);
print("✓ playHistory: índice compound (user_id, played_at)");

db.playHistory.createIndex(
  {"track.track_id": 1},
  {
    name: "idx_track_id",
    partialFilterExpression: {
      played_at: {$gte: new Date(Date.now() - 30*24*60*60*1000)}
    },
    background: true
  }
);
print("✓ playHistory: índice parcial track_id (últimos 30 dias)");

db.playHistory.createIndex(
  {"track.title": "text", "track.artist": "text"},
  {name: "idx_search", background: true}
);
print("✓ playHistory: índice text search");

db.playHistory.createIndex(
  {played_at: -1},
  {name: "idx_played_at", background: true}
);
print("✓ playHistory: índice temporal");

// Índices para playlists
db.playlists.createIndex(
  {user_id: 1},
  {name: "idx_owner", background: true}
);
print("✓ playlists: índice owner");

db.playlists.createIndex(
  {privacy: 1, "stats.play_count": -1},
  {name: "idx_public_popular", background: true}
);
print("✓ playlists: índice playlists públicas");

db.playlists.createIndex(
  {"collaborators.user_id": 1},
  {name: "idx_collaborators", background: true}
);
print("✓ playlists: índice colaboradores");

db.playlists.createIndex(
  {name: "text"},
  {name: "idx_name_search", background: true}
);
print("✓ playlists: índice text search nome");

// Índices para trackMetadata
db.trackMetadata.createIndex(
  {track_id: 1},
  {name: "idx_track_id", unique: true, background: true}
);
print("✓ trackMetadata: índice único track_id");

db.trackMetadata.createIndex(
  {genre: 1, "stats.total_plays": -1},
  {name: "idx_genre_popularity", background: true}
);
print("✓ trackMetadata: índice gênero + popularidade");

db.trackMetadata.createIndex(
  {tags: 1},
  {name: "idx_tags", background: true}
);
print("✓ trackMetadata: índice multikey tags");

db.trackMetadata.createIndex(
  {title: "text", artist: "text", album: "text"},
  {name: "idx_full_search", background: true}
);
print("✓ trackMetadata: índice full-text search");

// Índices para userRecommendations (com TTL)
db.userRecommendations.createIndex(
  {user_id: 1},
  {name: "idx_user", unique: true, background: true}
);
print("✓ userRecommendations: índice único user_id");

db.userRecommendations.createIndex(
  {expires_at: 1},
  {name: "idx_ttl", expireAfterSeconds: 0, background: true}
);
print("✓ userRecommendations: índice TTL (expira documentos automaticamente)");

// ============================================
// PARTE 4: POPULAÇÃO DE DADOS
// ============================================

print("\n=== POPULANDO DADOS ===\n");

// 4.1 População de playHistory (800 documentos)
print("Inserindo play history...");

const genres = ["Pop", "Rock", "Rap", "Jazz", "Soul", "Electronic"];
const devices = ["web", "mobile_ios", "mobile_android", "desktop"];
const countries = ["PT", "BR", "US", "UK", "ES", "FR"];
const sources = ["playlist", "album", "artist", "search", "radio"];

const playHistoryDocs = [];
for (let i = 1; i <= 800; i++) {
  const userId = Math.floor(Math.random() * 150) + 1;
  const trackId = Math.floor(Math.random() * 400) + 1;
  const daysAgo = Math.floor(Math.random() * 90);
  const playedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  playHistoryDocs.push({
    play_id: i,
    user_id: userId,
    track: {
      track_id: trackId,
      title: `Track ${trackId}`,
      artist: `Author ${(trackId % 40) + 1}`,
      album: `Album ${(trackId % 80) + 1}`,
      genre: genres[Math.floor(Math.random() * genres.length)],
      duration_secs: 120 + Math.floor(Math.random() * 300)
    },
    played_at: playedAt,
    duration_listened: 30 + Math.floor(Math.random() * 300),
    device: devices[Math.floor(Math.random() * devices.length)],
    location: {
      country: countries[Math.floor(Math.random() * countries.length)],
      city: `City ${Math.floor(Math.random() * 10) + 1}`
    },
    context: {
      source: sources[Math.floor(Math.random() * sources.length)],
      playlist_id: Math.random() > 0.5 ? Math.floor(Math.random() * 150) + 1 : null
    }
  });
}

db.playHistory.insertMany(playHistoryDocs);
print(`✓ ${playHistoryDocs.length} play history inseridos`);

// 4.2 População de playlists (150 documentos)
print("Inserindo playlists...");

const playlistDocs = [];
for (let i = 1; i <= 150; i++) {
  const userId = ((i - 1) % 150) + 1;
  const numTracks = 5 + Math.floor(Math.random() * 20); // 5-25 tracks
  const tracks = [];
  
  for (let j = 1; j <= numTracks; j++) {
    const trackId = Math.floor(Math.random() * 400) + 1;
    const daysAgo = Math.floor(Math.random() * 365);
    
    tracks.push({
      track_id: trackId,
      title: `Track ${trackId}`,
      artist: `Author ${(trackId % 40) + 1}`,
      duration_secs: 120 + Math.floor(Math.random() * 300),
      added_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      added_by: userId,
      position: j
    });
  }
  
  const hasCollaborators = Math.random() > 0.7;
  const collaborators = hasCollaborators ? [
    {
      user_id: ((userId + 10) % 150) + 1,
      permissions: ["add", "remove"]
    }
  ] : [];
  
  playlistDocs.push({
    playlist_id: i,
    user_id: userId,
    name: `Playlist ${i}`,
    created_at: new Date(Date.now() - Math.floor(Math.random() * 730) * 24 * 60 * 60 * 1000),
    updated_at: new Date(),
    privacy: Math.random() > 0.5 ? "public" : "private",
    tracks: tracks,
    collaborators: collaborators,
    stats: {
      total_tracks: numTracks,
      total_duration_secs: tracks.reduce((sum, t) => sum + t.duration_secs, 0),
      play_count: Math.floor(Math.random() * 5000),
      like_count: Math.floor(Math.random() * 500)
    },
    audit_log: [
      {
        action: "playlist_created",
        user_id: userId,
        timestamp: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      }
    ]
  });
}

db.playlists.insertMany(playlistDocs);
print(`✓ ${playlistDocs.length} playlists inseridas`);

// 4.3 População de trackMetadata (400 documentos)
print("Inserindo track metadata...");

const moods = ["happy", "sad", "energetic", "calm", "angry", "romantic"];
const tagsList = ["workout", "study", "party", "sleep", "driving", "chill"];

const trackMetadataDocs = [];
for (let i = 1; i <= 400; i++) {
  const genre = genres[Math.floor(Math.random() * genres.length)];
  const totalPlays = Math.floor(Math.random() * 100000);
  const uniqueListeners = Math.floor(totalPlays * (0.3 + Math.random() * 0.4));
  
  trackMetadataDocs.push({
    track_id: i,
    title: `Track ${i}`,
    artist: `Author ${(i % 40) + 1}`,
    album: `Album ${(i % 80) + 1}`,
    duration_secs: 120 + Math.floor(Math.random() * 300),
    genre: genre,
    release_date: new Date(2000 + Math.floor(Math.random() * 24), Math.floor(Math.random() * 12), 1),
    lyrics: Math.random() > 0.5 ? `Lyrics for track ${i}...` : null,
    mood: [
      moods[Math.floor(Math.random() * moods.length)],
      moods[Math.floor(Math.random() * moods.length)]
    ],
    bpm: 60 + Math.floor(Math.random() * 140),
    key: ["C", "D", "E", "F", "G", "A", "B"][Math.floor(Math.random() * 7)] + " major",
    tags: [
      tagsList[Math.floor(Math.random() * tagsList.length)],
      tagsList[Math.floor(Math.random() * tagsList.length)]
    ],
    stats: {
      total_plays: totalPlays,
      unique_listeners: uniqueListeners,
      avg_completion_rate: 0.5 + Math.random() * 0.5,
      skip_rate: Math.random() * 0.3
    },
    features: {
      acoustic: Math.random(),
      instrumental: Math.random(),
      energy: Math.random(),
      danceability: Math.random()
    }
  });
}

db.trackMetadata.insertMany(trackMetadataDocs);
print(`✓ ${trackMetadataDocs.length} track metadata inseridos`);

// 4.4 População de userRecommendations (150 documentos)
print("Inserindo user recommendations...");

const recommendationDocs = [];
for (let i = 1; i <= 150; i++) {
  const topGenres = [];
  const genresCopy = [...genres];
  for (let j = 0; j < 3; j++) {
    const idx = Math.floor(Math.random() * genresCopy.length);
    topGenres.push({
      genre: genresCopy[idx],
      percentage: 20 + Math.floor(Math.random() * 30)
    });
    genresCopy.splice(idx, 1);
  }
  
  const recommendations = [];
  for (let j = 0; j < 30; j++) {
    recommendations.push({
      track_id: Math.floor(Math.random() * 400) + 1,
      title: `Recommended Track ${j + 1}`,
      artist: `Artist ${Math.floor(Math.random() * 40) + 1}`,
      score: 0.5 + Math.random() * 0.5,
      reason: "Based on your listening history"
    });
  }
  
  recommendationDocs.push({
    user_id: i,
    generated_at: new Date(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    recommendations: {
      discover_weekly: recommendations,
      similar_artists: [
        {artist_id: Math.floor(Math.random() * 40) + 1, name: `Artist ${i}`, score: 0.8}
      ]
    },
    listening_profile: {
      top_genres: topGenres,
      preferred_time: ["morning", "afternoon", "evening", "night"][Math.floor(Math.random() * 4)],
      avg_session_duration: 1800 + Math.floor(Math.random() * 3600)
    }
  });
}

db.userRecommendations.insertMany(recommendationDocs);
print(`✓ ${recommendationDocs.length} user recommendations inseridos`);

// ============================================
// PARTE 5: VERIFICAÇÃO
// ============================================

print("\n=== VERIFICAÇÃO ===\n");

print(`Total playHistory: ${db.playHistory.countDocuments()}`);
print(`Total playlists: ${db.playlists.countDocuments()}`);
print(`Total trackMetadata: ${db.trackMetadata.countDocuments()}`);
print(`Total userRecommendations: ${db.userRecommendations.countDocuments()}`);

print("\n=== ESTATÍSTICAS DE ÍNDICES ===\n");

db.playHistory.getIndexes().forEach(idx => {
  print(`playHistory: ${idx.name}`);
});

db.playlists.getIndexes().forEach(idx => {
  print(`playlists: ${idx.name}`);
});

db.trackMetadata.getIndexes().forEach(idx => {
  print(`trackMetadata: ${idx.name}`);
});

db.userRecommendations.getIndexes().forEach(idx => {
  print(`userRecommendations: ${idx.name}`);
});

print("\n✅ SETUP COMPLETO!");
print("Execute queries_mongodb.js para testar as operações");