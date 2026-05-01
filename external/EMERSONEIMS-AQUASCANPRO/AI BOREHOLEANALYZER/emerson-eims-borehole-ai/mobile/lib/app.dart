import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

class BoreholeAIApp extends StatelessWidget {
  const BoreholeAIApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Borehole AI Analyzer',
      theme: ThemeData(
        primarySwatch: Colors.green,
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}