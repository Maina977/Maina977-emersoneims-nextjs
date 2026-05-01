import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService;
  bool _isAuthenticated = false;
  Map<String, dynamic>? _user;
  
  AuthProvider({required String baseUrl}) : _authService = AuthService(baseUrl: baseUrl);
  
  bool get isAuthenticated => _isAuthenticated;
  Map<String, dynamic>? get user => _user;
  
  Future<void> login(String email, String password) async {
    try {
      final data = await _authService.login(email, password);
      _isAuthenticated = true;
      _user = data['user'];
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }
  
  Future<void> logout() async {
    await _authService.logout();
    _isAuthenticated = false;
    _user = null;
    notifyListeners();
  }
}