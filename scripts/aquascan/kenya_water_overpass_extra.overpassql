[out:json][timeout:180];
(
  way["natural"="water"](1.70,35.15,2.15,35.55);
  relation["natural"="water"](1.70,35.15,2.15,35.55);
  way["landuse"="reservoir"](1.70,35.15,2.15,35.55);
  way["natural"="water"](-0.87,36.76,-0.76,36.92);
  relation["natural"="water"](-0.87,36.76,-0.76,36.92);
  way["landuse"="reservoir"](-0.87,36.76,-0.76,36.92);
);
out geom;
