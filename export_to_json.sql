-- export_to_json.sql
-- Plataforma de Streaming de Música - Exportação para JSON
-- Execute com: psql -d sua_database -f export_to_json.sql
-- Grupo 44: Afonso Ferreira (64117), José Miguel Resende (62513), Tomás Farinha (64253)

SET search_path TO bd044_schema, public;

-- ============================================
-- EXPORTAR PLAY_HISTORY
-- ============================================

\copy (
    SELECT jsonb_agg(
        jsonb_build_object(
            'play_id', ph.play_id,
            'user_id', ph.user_id,
            'track', jsonb_build_object(
                'track_id', t.track_id,
                'title', t.title,
                'artist', COALESCE(a.name, 'Unknown'),
                'album', COALESCE(al.title, 'Unknown'),
                'genre', t.genre::text,
                'duration_secs', t.duration_secs
            ),
            'played_at', ph.played_at,
            'duration_listened', COALESCE(ph.duration_listened, t.duration_secs),
            'device', (ARRAY['web', 'mobile_ios', 'mobile_android', 'desktop'])[1 + floor(random()*4)::int],
            'location', jsonb_build_object('country', 'PT', 'city', 'Lisbon'),
            'context', jsonb_build_object('source', 'playlist', 'playlist_id', null)
        )
    )
    FROM play_history ph
    JOIN tracks t ON ph.track_id = t.track_id
    LEFT JOIN author_track at ON t.track_id = at.track_id
    LEFT JOIN authors a ON at.author_id = a.author_id
    LEFT JOIN albums al ON t.album_id = al.album_id
) TO '/tmp/play_history.json'

-- ============================================
-- EXPORTAR PLAYLISTS
-- ============================================

\copy (
    SELECT jsonb_agg(
        jsonb_build_object(
            'playlist_id', p.playlist_id,
            'user_id', p.user_id,
            'name', p.name,
            'created_at', p.created_at,
            'updated_at', NOW(),
            'privacy', CASE WHEN random() < 0.5 THEN 'public' ELSE 'private' END,
            'tracks', COALESCE((
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'track_id', sub.track_id,
                        'title', sub.title,
                        'artist', sub.artist_name,
                        'duration_secs', sub.duration_secs,
                        'added_at', sub.added_at,
                        'added_by', p.user_id,
                        'position', sub.position
                    )
                )
                FROM (
                    SELECT 
                        t.track_id,
                        t.title,
                        COALESCE(a.name, 'Unknown') as artist_name,
                        t.duration_secs,
                        pt.added_at,
                        ROW_NUMBER() OVER (ORDER BY pt.added_at) as position
                    FROM playlist_tracks pt
                    JOIN tracks t ON pt.track_id = t.track_id
                    LEFT JOIN author_track atk ON t.track_id = atk.track_id
                    LEFT JOIN authors a ON atk.author_id = a.author_id
                    WHERE pt.playlist_id = p.playlist_id
                ) sub
            ), '[]'::jsonb),
            'collaborators', '[]'::jsonb,
            'stats', jsonb_build_object(
                'total_tracks', (SELECT COUNT(*) FROM playlist_tracks pt2 WHERE pt2.playlist_id = p.playlist_id),
                'total_duration_secs', COALESCE((SELECT SUM(t2.duration_secs) FROM playlist_tracks pt2 JOIN tracks t2 ON pt2.track_id = t2.track_id WHERE pt2.playlist_id = p.playlist_id), 0),
                'play_count', floor(random() * 5000)::int,
                'like_count', floor(random() * 500)::int
            ),
            'audit_log', jsonb_build_array(
                jsonb_build_object('action', 'playlist_created', 'user_id', p.user_id, 'timestamp', p.created_at)
            )
        )
    )
    FROM playlists p
) TO '/tmp/playlists.json'

-- ============================================
-- EXPORTAR TRACK_METADATA
-- ============================================

\copy (
    SELECT jsonb_agg(
        jsonb_build_object(
            'track_id', t.track_id,
            'title', t.title,
            'artist', COALESCE(a.name, 'Unknown'),
            'album', COALESCE(al.title, 'Unknown'),
            'duration_secs', t.duration_secs,
            'genre', t.genre::text,
            'release_date', t.release_date,
            'lyrics', CASE WHEN random() < 0.5 THEN 'Lyrics for ' || t.title ELSE null END,
            'mood', ARRAY['happy', 'energetic']::text[],
            'bpm', (60 + floor(random() * 140))::int,
            'key', (ARRAY['C', 'D', 'E', 'F', 'G', 'A', 'B'])[1 + floor(random() * 7)::int] || ' major',
            'tags', ARRAY['workout', 'chill']::text[],
            'stats', jsonb_build_object(
                'total_plays', COALESCE((SELECT SUM(uts.total_plays) FROM user_tracks_stats uts WHERE uts.track_id = t.track_id), 0),
                'unique_listeners', COALESCE((SELECT COUNT(DISTINCT uts.user_id) FROM user_tracks_stats uts WHERE uts.track_id = t.track_id), 0),
                'avg_completion_rate', 0.75 + (random() * 0.25),
                'skip_rate', random() * 0.3
            ),
            'features', jsonb_build_object(
                'acoustic', random(),
                'instrumental', random(),
                'energy', random(),
                'danceability', random()
            )
        )
    )
    FROM tracks t
    LEFT JOIN author_track at ON t.track_id = at.track_id
    LEFT JOIN authors a ON at.author_id = a.author_id
    LEFT JOIN albums al ON t.album_id = al.album_id
) TO '/tmp/track_metadata.json'

-- ============================================
-- EXPORTAR USER_RECOMMENDATIONS
-- ============================================

\copy (
    SELECT jsonb_agg(
        jsonb_build_object(
            'user_id', u.user_id,
            'generated_at', NOW(),
            'expires_at', NOW() + INTERVAL '24 hours',
            'recommendations', jsonb_build_object(
                'discover_weekly', (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'track_id', sub.track_id,
                            'title', sub.title,
                            'artist', sub.artist_name,
                            'score', 0.5 + (random() * 0.5),
                            'reason', 'Based on your listening history'
                        )
                    )
                    FROM (
                        SELECT t.track_id, t.title, COALESCE(a.name, 'Unknown') as artist_name
                        FROM tracks t
                        LEFT JOIN author_track at ON t.track_id = at.track_id
                        LEFT JOIN authors a ON at.author_id = a.author_id
                        ORDER BY random()
                        LIMIT 30
                    ) sub
                ),
                'similar_artists', '[]'::jsonb
            ),
            'listening_profile', jsonb_build_object(
                'top_genres', (
                    SELECT jsonb_agg(jsonb_build_object('genre', genre, 'percentage', percentage))
                    FROM (SELECT t.genre::text, 20 + floor(random() * 30) as percentage FROM tracks t ORDER BY random() LIMIT 3) genres
                ),
                'preferred_time', (ARRAY['morning', 'afternoon', 'evening', 'night'])[1 + floor(random() * 4)::int],
                'avg_session_duration', 1800 + floor(random() * 3600)::int
            )
        )
    )
    FROM users u
) TO '/tmp/user_recommendations.json'

-- Mostrar estatísticas
SELECT 'play_history' as collection, COUNT(*) as records FROM play_history
UNION ALL SELECT 'playlists', COUNT(*) FROM playlists
UNION ALL SELECT 'track_metadata', COUNT(*) FROM tracks
UNION ALL SELECT 'user_recommendations', COUNT(*) FROM users;
