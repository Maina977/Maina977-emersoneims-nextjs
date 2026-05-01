import 'dart:io';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AnalysisService {
  final String baseUrl;
  
  AnalysisService({required this.baseUrl});
  
  Future<Map<String, dynamic>> analyzeImage(File image) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    
    var request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/api/v1/analysis/analyze'),
    );
    
    request.headers['Authorization'] = 'Bearer $token';
    request.files.add(await http.MultipartFile.fromPath('file', image.path));
    
    final response = await request.send();
    final responseData = await response.stream.bytesToString();
    
    if (response.statusCode == 200) {
      return json.decode(responseData);
    } else {
      throw Exception('Analysis failed: ${response.statusCode}');
    }
  }
}