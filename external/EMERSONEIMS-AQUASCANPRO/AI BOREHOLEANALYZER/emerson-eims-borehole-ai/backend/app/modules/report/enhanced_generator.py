"""
Enhanced Report Generator with Financial and Hydrogeological Analysis
Integrates: HydraulicPropertiesCalculator, FinancialAnalyzer, ProjectViabilityAssessment
"""

import io
import base64
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether
)
import matplotlib.pyplot as plt
import numpy as np
from typing import Dict, Optional
import logging

from ..hydrogeology.properties import HydraulicPropertiesCalculator
from ..financial.analyzer import FinancialAnalyzer
from ..financial.project_assessment import ProjectViabilityAssessment

logger = logging.getLogger(__name__)


class EnhancedReportGenerator:
    """
    Generates comprehensive borehole analysis reports with:
    - Hydrogeological assessments (transmissivity, yield, storativity)
    - Financial analysis (NPV, IRR, ROI, payback period)
    - Project viability assessment
    - Risk analysis
    """
    
    def __init__(self):
        self.hydraulic = HydraulicPropertiesCalculator()
        self.financial = FinancialAnalyzer()
        self.assessment = ProjectViabilityAssessment()
        self.styles = self._create_custom_styles()
    
    def _create_custom_styles(self):
        """Create custom paragraph styles for professional report"""
        styles = getSampleStyleSheet()
        
        styles.add(ParagraphStyle(
            name='FinancialTitle',
            fontSize=18,
            textColor=colors.HexColor('#1a5f7a'),
            spaceAfter=12,
            fontWeight='bold'
        ))
        
        styles.add(ParagraphStyle(
            name='FinancialMetric',
            fontSize=11,
            textColor=colors.HexColor('#2c7da0'),
            leading=16
        ))
        
        styles.add(ParagraphStyle(
            name='MetricValue',
            fontSize=14,
            textColor=colors.HexColor('#2ecc71'),
            fontWeight='bold',
            alignment=1
        ))
        
        return styles
    
    def create_financial_summary_chart(
        self,
        npv_usd: float,
        irr_percent: float,
        payback_years: float,
        yield_m3_day: float
    ):
        """Create financial metrics summary chart"""
        fig, axes = plt.subplots(2, 2, figsize=(8, 6))
        fig.suptitle('Project Financial Metrics Summary', fontsize=14, fontweight='bold')
        
        # NPV
        ax = axes[0, 0]
        npv_color = '#2ecc71' if npv_usd > 0 else '#e74c3c'
        ax.bar(['NPV'], [npv_usd/1000], color=npv_color, edgecolor='white', linewidth=2)
        ax.set_ylabel('NPV (USD 1000s)', fontsize=9, fontweight='bold')
        ax.text(0, npv_usd/1000 + 5000/1000, f'${npv_usd/1000:.1f}k', 
               ha='center', va='bottom', fontsize=10, fontweight='bold')
        ax.axhline(y=0, color='black', linestyle='-', linewidth=0.5)
        ax.grid(True, alpha=0.3, axis='y')
        ax.set_yticklabels([f'${x:.0f}k' for x in ax.get_yticks()])
        
        # IRR
        ax = axes[0, 1]
        irr_color = '#2ecc71' if irr_percent > 15 else '#f39c12' if irr_percent > 10 else '#e74c3c'
        ax.bar(['IRR'], [irr_percent], color=irr_color, edgecolor='white', linewidth=2)
        ax.set_ylabel('IRR (%)', fontsize=9, fontweight='bold')
        ax.text(0, irr_percent + 1, f'{irr_percent:.1f}%', 
               ha='center', va='bottom', fontsize=10, fontweight='bold')
        ax.axhline(y=10, color='#f39c12', linestyle='--', linewidth=1, alpha=0.5, label='Target')
        ax.set_ylim([0, max(irr_percent + 5, 25)])
        ax.legend(fontsize=8)
        
        # Payback Period
        ax = axes[1, 0]
        pb_color = '#2ecc71' if payback_years < 5 else '#f39c12' if payback_years < 10 else '#e74c3c'
        ax.bar(['Payback'], [payback_years], color=pb_color, edgecolor='white', linewidth=2)
        ax.set_ylabel('Years', fontsize=9, fontweight='bold')
        ax.text(0, payback_years + 0.3, f'{payback_years:.1f}y', 
               ha='center', va='bottom', fontsize=10, fontweight='bold')
        ax.set_ylim([0, 20])
        ax.grid(True, alpha=0.3, axis='y')
        
        # Yield
        ax = axes[1, 1]
        yield_color = '#3498db'
        ax.bar(['Yield'], [yield_m3_day], color=yield_color, edgecolor='white', linewidth=2)
        ax.set_ylabel('Yield (m³/day)', fontsize=9, fontweight='bold')
        ax.text(0, yield_m3_day + 5, f'{yield_m3_day:.1f}', 
               ha='center', va='bottom', fontsize=10, fontweight='bold')
        ax.set_ylim([0, max(yield_m3_day + 25, 100)])
        ax.grid(True, alpha=0.3, axis='y')
        
        plt.tight_layout()
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=120, bbox_inches='tight', facecolor='white')
        buf.seek(0)
        plt.close()
        return buf
    
    def create_cashflow_chart(self, cash_flows: list):
        """Create cumulative cash flow chart"""
        fig, ax = plt.subplots(figsize=(8, 4))
        
        years = [cf['year'] for cf in cash_flows]
        cumulative = [cf['cumulative'] for cf in cash_flows]
        
        # Plot cumulative cash flow
        ax.plot(years, cumulative, 'o-', linewidth=2.5, markersize=4, 
               color='#3498db', label='Cumulative Cash Flow')
        
        # Fill area
        ax.fill_between(years, 0, cumulative, alpha=0.2, color='#3498db')
        
        # Add breakeven line
        ax.axhline(y=0, color='#e74c3c', linestyle='--', linewidth=1.5, alpha=0.7)
        
        # Formatting
        ax.set_xlabel('Year', fontsize=11, fontweight='bold')
        ax.set_ylabel('Cumulative Cash Flow (USD)', fontsize=11, fontweight='bold')
        ax.set_title('20-Year Cash Flow Projection', fontsize=12, fontweight='bold')
        ax.grid(True, alpha=0.3)
        ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, p: f'${x/1000:.0f}k'))
        ax.legend(fontsize=9)
        
        plt.tight_layout()
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=120, bbox_inches='tight', facecolor='white')
        buf.seek(0)
        plt.close()
        return buf
    
    def add_financial_section_to_report(
        self,
        story: list,
        viability_report: Dict
    ):
        """Add comprehensive financial analysis section to report"""
        
        financial = viability_report['financial_analysis']
        cost_analysis = viability_report['cost_analysis']
        recommendations = viability_report['recommendations']
        
        # ===== FINANCIAL OVERVIEW =====
        story.append(Paragraph("FINANCIAL ANALYSIS", self.styles['FinancialTitle']))
        story.append(Spacer(1, 0.2*cm))
        
        # Financial Summary
        financial_summary = f"""
        <b>Investment Summary:</b><br/>
        • Initial Capital Investment: <b>${financial['initial_investment_usd']:,.0f}</b><br/>
        • Annual Revenue: <b>${financial['annual_revenue_usd']:,.0f}</b><br/>
        • Annual Operating Costs: <b>${financial['annual_opex_usd']:,.0f}</b><br/>
        • Annual Net Cash Flow: <b>${financial['annual_net_cashflow_usd']:,.0f}</b><br/>
        <br/>
        <b>Key Financial Metrics:</b><br/>
        • Net Present Value (NPV): <b style="color: {'green' if financial['npv']['npv_usd'] > 0 else 'red'}">${financial['npv']['npv_usd']:,.0f}</b><br/>
        • Internal Rate of Return (IRR): <b>{financial['irr']['irr_percent']:.1f}%</b><br/>
        • Return on Investment (20 years): <b>{(financial['annual_revenue_usd'] * 20 - financial['initial_investment_usd']) / financial['initial_investment_usd'] * 100:.1f}%</b><br/>
        • Payback Period: <b>{financial['payback'].get('payback_period_years', 'N/A')} years</b><br/>
        """
        
        story.append(Paragraph(financial_summary, self.styles['FinancialMetric']))
        story.append(Spacer(1, 0.3*cm))
        
        # Financial Metrics Chart
        try:
            metrics_chart = self.create_financial_summary_chart(
                financial['npv']['npv_usd'],
                financial['irr']['irr_percent'],
                financial['payback'].get('payback_period_years', 10),
                financial['annual_revenue_usd'] / 365
            )
            from reportlab.platypus import Image
            story.append(Image(metrics_chart, width=6*inch, height=4.5*inch))
            story.append(Spacer(1, 0.3*cm))
        except Exception as e:
            logger.warning(f"Could not create metrics chart: {e}")
        
        # ===== COST BREAKDOWN =====
        story.append(Paragraph("Cost Breakdown (Drilling Project)", self.styles['FinancialTitle']))
        
        cost_data = [
            ['Cost Category', 'Amount (USD)', '% of Total'],
            ['Drilling', f"${cost_analysis['drilling_cost']:,.0f}", f"{cost_analysis['breakdown_percent']['drilling']:.1f}%"],
            ['Casing & Screen', f"${cost_analysis['casing_cost'] + cost_analysis['screen_cost']:,.0f}", 
             f"{(cost_analysis['breakdown_percent']['casing'] + cost_analysis['breakdown_percent'].get('screen', 0)):.1f}%"],
            ['Pump & Equipment', f"${cost_analysis['pump_cost']:,.0f}", f"{cost_analysis['breakdown_percent']['equipment']:.1f}%"],
            ['Permitting & Lab', f"${cost_analysis['permits_cost'] + cost_analysis['testing_cost']:,.0f}", "2-3%"],
            ['Mobilization & Other', f"${cost_analysis['mobilization_cost'] + cost_analysis['development_cost']:,.0f}", "5-7%"],
            ['SUBTOTAL', f"${cost_analysis['subtotal']:,.0f}", "—"],
            ['Contingency (' + str(int(cost_analysis['contingency_percent'])) + '%)', f"${cost_analysis['contingency']:,.0f}", f"{cost_analysis['contingency_percent']:.1f}%"],
            ['TOTAL PROJECT COST', f"${cost_analysis['total_cost_usd']:,.0f}", "100%"]
        ]
        
        cost_table = Table(cost_data, colWidths=[3*inch, 1.5*inch, 1.2*inch])
        cost_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c7da0')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#f39c12')),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, -1), (-1, -1), 11),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, colors.HexColor('#f8f9fa')])
        ]))
        
        story.append(cost_table)
        story.append(Spacer(1, 0.4*cm))
        
        # ===== CASH FLOW PROJECTION =====
        story.append(Paragraph("20-Year Cash Flow Projection", self.styles['FinancialTitle']))
        
        try:
            cashflow_chart = self.create_cashflow_chart(financial['cash_flow_projection']['cash_flows'])
            from reportlab.platypus import Image
            story.append(Image(cashflow_chart, width=6*inch, height=3*inch))
            story.append(Spacer(1, 0.3*cm))
        except Exception as e:
            logger.warning(f"Could not create cashflow chart: {e}")
        
        cashflow_interpretation = f"""
        <b>Cash Flow Interpretation:</b><br/>
        • Breakeven Year: <b>Year {financial['cash_flow_projection'].get('breakeven_year', 'N/A')}</b><br/>
        • Total 20-Year Net Revenue: <b>${financial['cash_flow_projection']['total_project_value']:,.0f}</b><br/>
        • Average Annual Return: <b>${financial['cash_flow_projection']['total_project_value'] / 20:,.0f}</b><br/>
        """
        
        story.append(Paragraph(cashflow_interpretation, self.styles['FinancialMetric']))
        story.append(Spacer(1, 0.4*cm))
        
        # ===== RECOMMENDATIONS =====
        story.append(Paragraph("Project Recommendations", self.styles['FinancialTitle']))
        
        rec_text = "<br/>".join([f"• {rec}" for rec in recommendations])
        story.append(Paragraph(rec_text, self.styles['FinancialMetric']))
        
        story.append(PageBreak())
        
        return story
    
    def add_hydrogeological_section_to_report(
        self,
        story: list,
        viability_report: Dict
    ):
        """Add hydrogeological analysis section to report"""
        
        hydro = viability_report['hydrogeological_assessment']
        
        story.append(Paragraph("HYDROGEOLOGICAL ASSESSMENT", self.styles['FinancialTitle']))
        story.append(Spacer(1, 0.2*cm))
        
        hydro_text = f"""
        <b>Aquifer Properties:</b><br/>
        • Transmissivity (T): <b>{hydro['transmissivity_m2_per_day']:.2f} m²/day</b><br/>
        &nbsp;&nbsp;(Calculation: T = K × b, where K = conductivity, b = thickness)<br/>
        • Storativity (S): <b>{hydro['storativity']:.6f}</b><br/>
        • Sustainable Yield: <b>{hydro['sustainable_yield_m3_per_day']:.1f} m³/day</b> or <b>{hydro['sustainable_yield_m3_per_hour']:.2f} m³/hour</b><br/>
        <br/>
        <b>Yield Interpretation:</b><br/>
        {hydro['yield_interpretation']}<br/>
        <br/>
        <b>Hydrogeological Constraints:</b><br/>
        • Transmissivity limits yield based on aquifer conductivity and thickness<br/>
        • Storativity determines aquifer response time and storage capacity<br/>
        • Sustainable yield balances extraction with natural recharge<br/>
        • Long-term viability requires yield ≤ natural recharge rate<br/>
        """
        
        story.append(Paragraph(hydro_text, self.styles['FinancialMetric']))
        story.append(Spacer(1, 0.4*cm))
        
        return story
    
    def add_risk_section_to_report(
        self,
        story: list,
        viability_report: Dict
    ):
        """Add risk assessment section to report"""
        
        risks = viability_report['risk_assessment']
        viability = viability_report['viability_summary']
        
        story.append(Paragraph("RISK ASSESSMENT", self.styles['FinancialTitle']))
        story.append(Spacer(1, 0.2*cm))
        
        risk_summary = f"""
        <b>Overall Risk Level: {risks['overall_risk']}</b> (Average Risk Score: {risks['average_risk_score']:.0f}/100)<br/>
        <br/>
        
        <b>Hydrogeological Risks (Score: {risks['hydrogeological']['score']}/100):</b><br/>
        """
        
        if risks['hydrogeological']['factors']:
            for factor in risks['hydrogeological']['factors']:
                risk_summary += f"• {factor}<br/>"
        
        risk_summary += """
        <br/>
        <b>Financial Risks:</b><br/>
        """
        
        if risks['financial']['factors']:
            for factor in risks['financial']['factors']:
                risk_summary += f"• {factor}<br/>"
        else:
            risk_summary += "• No major financial risks identified<br/>"
        
        risk_summary += """
        <br/>
        <b>Operational Risks:</b><br/>
        """
        
        if risks['operational']['factors']:
            for factor in risks['operational']['factors']:
                risk_summary += f"• {factor}<br/>"
        else:
            risk_summary += "• Standard operational conditions expected<br/>"
        
        risk_summary += f"""
        <br/>
        <b>Viability Recommendation:</b> <b style="color: {'green' if viability['recommendation'] == 'PROCEED' else 'orange' if viability['recommendation'] == 'EVALUATE' else 'red'}">
        {viability['recommendation']}</b><br/>
        Confidence Level: {viability['confidence_level']}<br/>
        <br/>
        {viability['summary_narrative']}<br/>
        """
        
        story.append(Paragraph(risk_summary, self.styles['FinancialMetric']))
        story.append(Spacer(1, 0.4*cm))
        
        return story
