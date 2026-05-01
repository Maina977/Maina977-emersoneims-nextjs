"""Add water quality tables

Revision ID: 002
Revises: 001
Create Date: 2024-01-15 11:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table('water_quality',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('analysis_id', sa.Integer(), nullable=False),
        sa.Column('turbidity', sa.Float(), nullable=True),
        sa.Column('tds', sa.Float(), nullable=True),
        sa.Column('ph', sa.Float(), nullable=True),
        sa.Column('hardness', sa.Float(), nullable=True),
        sa.Column('fluoride', sa.Float(), nullable=True),
        sa.Column('iron', sa.Float(), nullable=True),
        sa.Column('arsenic', sa.Float(), nullable=True),
        sa.Column('nitrate', sa.Float(), nullable=True),
        sa.Column('is_potable', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['analysis_id'], ['analyses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('soil_analysis',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('analysis_id', sa.Integer(), nullable=False),
        sa.Column('soil_type', sa.String(), nullable=True),
        sa.Column('porosity', sa.Float(), nullable=True),
        sa.Column('permeability', sa.Float(), nullable=True),
        sa.Column('organic_matter', sa.Float(), nullable=True),
        sa.Column('ph', sa.Float(), nullable=True),
        sa.Column('moisture_content', sa.Float(), nullable=True),
        sa.Column('compaction', sa.Float(), nullable=True),
        sa.Column('suitability', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['analysis_id'], ['analyses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('soil_analysis')
    op.drop_table('water_quality')