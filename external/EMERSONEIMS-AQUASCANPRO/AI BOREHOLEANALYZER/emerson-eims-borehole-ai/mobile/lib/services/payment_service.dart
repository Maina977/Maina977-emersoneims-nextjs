import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class PaymentService {
  final String baseUrl;
  
  PaymentService({required this.baseUrl});
  
  Future<Map<String, dynamic>> initializeMpesa(double amount, String phoneNumber) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    
    final response = await http.post(
      Uri.parse('$baseUrl/api/v1/payments/initialize'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({
        'amount': amount,
        'payment_method': 'mpesa',
        'phone_number': phoneNumber,
      }),
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Payment initialization failed');
    }
  }
}