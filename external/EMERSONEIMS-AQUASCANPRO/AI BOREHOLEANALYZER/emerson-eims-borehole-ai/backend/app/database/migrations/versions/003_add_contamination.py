"""Add contamination tracking

Revision ID: 003
Revises: 002
Create Date: 2024-01-15 12:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table('contamination_sources',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('analysis_id', sa.Integer(), nullable=False),
        sa.Column('source_type', sa.String(), nullable=False),
        sa.Column('distance', sa.Float(), nullable=True),
        sa.Column('direction', sa.String(), nullable=True),
        sa.Column('severity', sa.String(), nullable=True),
        sa.Column('risk_level', sa.Float(), nullable=True),
        sa.Column('chemicals', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['analysis_id'], ['analyses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('risk_assessments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('analysis_id', sa.Integer(), nullable=False),
        sa.Column('overall_risk', sa.Float(), nullable=True),
        sa.Column('geological_risk', sa.Float(), nullable=True),
        sa.Column('contamination_risk', sa.Float(), nullable=True),
        sa.Column('depth_risk', sa.Float(), nullable=True),
        sa.Column('financial_risk', sa.Float(), nullable=True),
        sa.Column('technical_risk', sa.Float(), nullable=True),
        sa.Column('viability', sa.String(), nullable=True),
        sa.Column('recommendations', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['analysis_id'], ['analyses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('risk_assessments')
    op.drop_table('contamination_sources')