import 'package:flutter/material.dart';

class ProbabilityGauge extends StatelessWidget {
  final double probability;
  
  const ProbabilityGauge({super.key, required this.probability});
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          '${(probability * 100).toStringAsFixed(0)}%',
          style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        LinearProgressIndicator(
          value: probability,
          backgroundColor: Colors.grey[300],
          color: _getColor(),
          minHeight: 8,
        ),
      ],
    );
  }
  
  Color _getColor() {
    if (probability > 0.7) return Colors.green;
    if (probability > 0.4) return Colors.orange;
    return Colors.red;
  }
}