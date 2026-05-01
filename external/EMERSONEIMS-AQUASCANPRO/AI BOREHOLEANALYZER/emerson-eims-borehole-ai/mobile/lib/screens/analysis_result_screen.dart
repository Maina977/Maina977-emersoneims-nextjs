import 'package:flutter/material.dart';

class AnalysisResultScreen extends StatelessWidget {
  final Map<String, dynamic> result;
  
  const AnalysisResultScreen({super.key, required this.result});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Analysis Results')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildMetric('Success Probability', 
                '${(result['probability'] * 100).toStringAsFixed(1)}%'),
            const SizedBox(height: 16),
            _buildMetric('Recommended Depth', 
                '${result['recommendedDepth'].toStringAsFixed(0)} meters'),
            const SizedBox(height: 16),
            _buildMetric('Estimated Yield', 
                '${result['estimatedYield'].toStringAsFixed(1)} m³/hour'),
            const SizedBox(height: 16),
            _buildMetric('Site Type', 
                result['site']['siteType'].toString().toUpperCase()),
            const SizedBox(height: 24),
            const Text('Recommendations', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            ...(result['risk']['recommendations'] as List)
                .map((rec) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          const Icon(Icons.check_circle, size: 16, color: Colors.green),
                          const SizedBox(width: 8),
                          Expanded(child: Text(rec.toString())),
                        ],
                      ),
                    ))
                .toList(),
          ],
        ),
      ),
    );
  }
  
  Widget _buildMetric(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
      ],
    );
  }
}