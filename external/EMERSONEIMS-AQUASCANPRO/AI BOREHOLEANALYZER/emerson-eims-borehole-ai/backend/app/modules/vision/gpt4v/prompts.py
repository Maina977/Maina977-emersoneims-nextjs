class GPT4VPrompts:
    TERRAIN_ANALYSIS = """
    Analyze this terrain image for borehole drilling potential.
    Provide:
    1. Vegetation type and density (0-100%)
    2. Terrain classification (valley/slope/flat/drainage)
    3. Water indicators (visible water, moisture, vegetation patterns)
    4. Soil type estimation based on visual cues
    5. Overall suitability score (0-100)
    
    Format as JSON.
    """
    
    CONTAMINATION_DETECTION = """
    Scan this image for potential contamination sources:
    - Sewage/effluent (smoke stacks, discolored water, treatment plants)
    - Industrial facilities (factories, warehouses, chimneys)
    - Agricultural (farms, irrigation, livestock)
    - Landfills (dumps, waste piles, garbage trucks)
    - Chemical storage (tanks, drums, storage facilities)
    
    Return detected sources with severity (low/medium/high/critical) and estimated distance.
    """
    
    VEGETATION_CLASSIFICATION = """
    Classify the vegetation in this image:
    - Primary vegetation type (forest/grassland/shrubland/cropland)
    - Dominant species if identifiable
    - Health indicators (greenness, density, stress signs)
    - Groundwater indicator plants (presence of water-loving species)
    
    Format as structured data.
    """