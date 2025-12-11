========================================
  MEDIA FILES FOLDER STRUCTURE
  Emerson EIMS Project
========================================

WHERE TO PLACE YOUR IMAGES AND VIDEOS
=====================================

This folder structure has been created for you.
Place your media files in the appropriate folders:

📁 public/
│
├── 📁 images/
│   ├── 📁 premium/          ← Premium/high-quality images
│   │   ├── high-power-infra.jpg
│   │   ├── generator-detail.jpg
│   │   ├── solar-control.jpg
│   │   ├── ac-installation.jpg
│   │   ├── motor-winding.jpg
│   │   ├── borehole-drill.jpg
│   │   ├── incinerator-system.jpg
│   │   ├── metal-fabrication.jpg
│   │   ├── engineering-team.jpg
│   │   ├── diagnostic-tool.jpg
│   │   ├── field-work.jpg
│   │   ├── cinematic-shot.jpg
│   │   ├── premium-infrastructure.jpg
│   │   └── hybrid-intelligence.jpg
│   │
│   ├── GEN-1-1.png
│   ├── workshop.png
│   ├── solar-changeover-control.png
│   ├── 924.png
│   └── case-placeholder.jpg
│
├── 📁 media/                 ← Case studies & generator media
│   ├── case-hospital.jpg
│   ├── case-factory.jpg
│   ├── case-farm.jpg
│   ├── case-datacenter.jpg
│   ├── cummins-warehouse.mp4 (video)
│   └── cummins-poster.jpg
│
├── 📁 assets/                ← General assets & videos
│   └── nairobi-grid.mp4 (video)
│
├── logo.png                  ← Main logo (place in public root)
├── og-image.jpg              ← Open Graph image (place in public root)
└── twitter-image.jpg         ← Twitter card image (place in public root)


HOW TO USE IN CODE
==================

Images:
  <img src="/images/premium/generator-detail.jpg" alt="Generator" />
  <img src="/logo.png" alt="Logo" />

Videos:
  <video src="/media/cummins-warehouse.mp4" />
  <source src="/assets/nairobi-grid.mp4" type="video/mp4" />


IMPORTANT NOTES
===============

1. Files in /public folder are accessible at root URL:
   - public/logo.png → /logo.png
   - public/images/premium/photo.jpg → /images/premium/photo.jpg

2. Some images are hosted on WordPress:
   - https://www.emersoneims.com/wp-content/uploads/
   - These are already working, no need to move them

3. After adding files, refresh your browser to see them

4. File names must match exactly what's referenced in code


NEXT STEPS
==========

1. Add your images/videos to the folders above
2. Make sure file names match what's in the code
3. Test by refreshing your browser
4. If images don't show, check browser console for 404 errors

========================================


