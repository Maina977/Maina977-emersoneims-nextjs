import 'dart:convert';
import 'package:sqflite/sqflite.dart';
import 'package:path_provider/path_provider.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

/// Offline-first data cache for borehole analysis results.
/// Stores analysis results locally and syncs when connectivity returns.
class OfflineCache {
  static Database? _db;

  static Future<Database> get database async {
    if (_db != null) return _db!;
    final dir = await getApplicationDocumentsDirectory();
    _db = await openDatabase(
      '${dir.path}/borehole_cache.db',
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE analyses (
            id TEXT PRIMARY KEY,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            result_json TEXT NOT NULL,
            created_at TEXT NOT NULL,
            synced INTEGER DEFAULT 0
          )
        ''');
        await db.execute('''
          CREATE TABLE pending_uploads (
            id TEXT PRIMARY KEY,
            image_path TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            field_data_json TEXT,
            created_at TEXT NOT NULL
          )
        ''');
      },
    );
    return _db!;
  }

  /// Save analysis result for offline access
  static Future<void> cacheAnalysis({
    required String id,
    required double lat,
    required double lon,
    required Map<String, dynamic> result,
  }) async {
    final db = await database;
    await db.insert('analyses', {
      'id': id,
      'latitude': lat,
      'longitude': lon,
      'result_json': jsonEncode(result),
      'created_at': DateTime.now().toIso8601String(),
      'synced': 0,
    }, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  /// Get cached analyses
  static Future<List<Map<String, dynamic>>> getCachedAnalyses() async {
    final db = await database;
    return db.query('analyses', orderBy: 'created_at DESC');
  }

  /// Queue image for analysis when online
  static Future<void> queueForUpload({
    required String id,
    required String imagePath,
    double? lat,
    double? lon,
    Map<String, dynamic>? fieldData,
  }) async {
    final db = await database;
    await db.insert('pending_uploads', {
      'id': id,
      'image_path': imagePath,
      'latitude': lat,
      'longitude': lon,
      'field_data_json': fieldData != null ? jsonEncode(fieldData) : null,
      'created_at': DateTime.now().toIso8601String(),
    });
  }

  /// Check if device is online
  static Future<bool> isOnline() async {
    final result = await Connectivity().checkConnectivity();
    return result != ConnectivityResult.none;
  }

  /// Get pending uploads count
  static Future<int> pendingCount() async {
    final db = await database;
    final result = await db.rawQuery('SELECT COUNT(*) as cnt FROM pending_uploads');
    return Sqflite.firstIntValue(result) ?? 0;
  }

  /// Mark analysis as synced
  static Future<void> markSynced(String id) async {
    final db = await database;
    await db.update('analyses', {'synced': 1}, where: 'id = ?', whereArgs: [id]);
  }

  /// Remove uploaded item from queue
  static Future<void> removeFromQueue(String id) async {
    final db = await database;
    await db.delete('pending_uploads', where: 'id = ?', whereArgs: [id]);
  }
}
