[out:json][timeout:180];
area["ISO3166-1"="KE"][admin_level=2]->.ke;
(
  way["natural"="water"]["water"~"^(lake|reservoir|lagoon)$"]["name"](area.ke);
  relation["natural"="water"]["water"~"^(lake|reservoir|lagoon)$"]["name"](area.ke);
  way["natural"="water"][!"water"]["name"~"^Lake "](area.ke);
  relation["natural"="water"][!"water"]["name"~"^Lake "](area.ke);
);
out tags bb;
