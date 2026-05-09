const u = 'https://emersoneims.com';
(async () => {
  const routes = ['/', '/resources', '/resources/solar-ups-hub', '/services/hospital-incinerators', '/generator-oracle'];
  for (const r of routes) {
    const h = await (await fetch(u + r)).text();
    const cnt = (re) => (h.match(re) || []).length;
    console.log('=== ' + r + ' (bytes=' + h.length + ') ===');
    console.log('  B2B strip aria-label   :', cnt(/aria-label="B2B commercial positioning"/g));
    console.log('  B2BCommercialBand      :', cnt(/B2BCommercialBand|b2b-commercial-band/g));
    console.log('  solar-ups-hub-teaser id:', cnt(/solar-ups-hub-teaser/g));
    console.log('  /resources/solar-ups-hub href:', cnt(/href="\/resources\/solar-ups-hub"/g));
    console.log('  Footer email           :', cnt(/info@emersoneims\.com/g));
    console.log('  Phone +254768860665    :', cnt(/254[\s\u00a0]?768[\s\u00a0]?860[\s\u00a0]?665/g));
    console.log('  Phone +254782914717    :', cnt(/254[\s\u00a0]?782[\s\u00a0]?914[\s\u00a0]?717/g));
    console.log('  Generator Oracle text  :', cnt(/Generator Oracle/g));
    console.log('  WIRING_UNAVAILABLE_MESSAGE:', cnt(/WIRING_UNAVAILABLE_MESSAGE|wiring is not available/g));
    console.log('  AIUnavailableNotice    :', cnt(/AIUnavailableNotice|AI Unavailable/g));
    console.log('  RuleBasedAssistant     :', cnt(/RuleBasedAssistant|Rule-based|rule-based/g));
  }
})();
