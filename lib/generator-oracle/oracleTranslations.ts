/**
 * Generator Oracle - Multi-Language Translations
 * 7 Languages: English, Swahili, French, Spanish, Arabic (RTL), Hindi, Mandarin
 */

export interface OracleTranslations {
  // Header
  appTitle: string;
  appSubtitle: string;
  faultCodes: string;
  controllers: string;
  offlineReady: string;

  // Controller Selection
  selectBrand: string;
  selectModel: string;
  selectFirmware: string;
  recentControllers: string;

  // Search
  searchPlaceholder: string;
  searchButton: string;
  searching: string;
  noResults: string;
  resultsFound: string;
  clearSearch: string;

  // Fault Code Details
  faultCode: string;
  brand: string;
  model: string;
  category: string;
  subcategory: string;
  severity: string;
  alarmType: string;
  description: string;
  symptoms: string;
  possibleCauses: string;
  diagnosticSteps: string;
  resetPathways: string;
  solutions: string;
  safetyWarnings: string;
  preventiveMeasures: string;

  // Severity Levels
  severityInfo: string;
  severityWarning: string;
  severityCritical: string;
  severityShutdown: string;

  // Alarm Types
  alarmWarning: string;
  alarmTrip: string;
  alarmShutdown: string;
  alarmLockout: string;

  // Difficulty Levels
  difficultyEasy: string;
  difficultyModerate: string;
  difficultyAdvanced: string;
  difficultyExpert: string;

  // Reset Pathway
  resetMethod: string;
  resetAuto: string;
  resetManual: string;
  resetKeypad: string;
  resetSoftware: string;
  applicableFirmware: string;
  requiredConditions: string;
  resetSteps: string;
  successIndicator: string;
  keySequence: string;
  menuPath: string;
  expectedResponse: string;

  // Parameter Input
  liveParameters: string;
  voltage: string;
  frequency: string;
  rpm: string;
  oilPressure: string;
  coolantTemp: string;
  batteryVoltage: string;
  loadPercent: string;
  fuelLevel: string;
  enterValue: string;
  outOfRange: string;
  withinRange: string;

  // Diagnosis
  runDiagnosis: string;
  diagnosisResults: string;
  matchingFaults: string;
  confidence: string;
  noFaultsDetected: string;

  // Technician Feedback
  feedbackTitle: string;
  didItWork: string;
  yes: string;
  no: string;
  partiallyWorked: string;
  addNotes: string;
  submitFeedback: string;
  thankYou: string;

  // Offline
  offlineMode: string;
  syncPending: string;
  lastSynced: string;
  syncNow: string;

  // Actions
  viewDetails: string;
  hideDetails: string;
  printReport: string;
  shareResult: string;
  copyCode: string;
  exportPDF: string;

  // Units
  psi: string;
  bar: string;
  celsius: string;
  fahrenheit: string;
  volts: string;
  amps: string;
  hertz: string;
  percent: string;

  // Tabs
  tabSearch: string;
  tabDiagnose: string;
  tabHistory: string;
  tabSettings: string;

  // Navigation Panels
  navCommand: string;
  navEngine: string;
  navElectrical: string;
  navFaults: string;
  navFaultAnalysis: string;
  navSimulator: string;
  navDiagrams: string;
  navAllWiring: string;
  navInput: string;
  navAI: string;
  navAssistant: string;
  navLiveMonitor: string;
  navOBD: string;
  navRemote: string;
  navPredictive: string;
  navRecording: string;
  navManuals: string;

  // Contact
  needHelp: string;
  callSupport: string;
  whatsappSupport: string;
  emailSupport: string;
}

export const ORACLE_TRANSLATIONS: Record<string, OracleTranslations> = {
  // ==================== ENGLISH ====================
  en: {
    appTitle: 'Generator Oracle',
    appSubtitle: 'Professional Controller Diagnostic System',
    faultCodes: 'Fault Codes',
    controllers: 'Controllers',
    offlineReady: 'Offline Ready',

    selectBrand: 'Select Brand',
    selectModel: 'Select Model',
    selectFirmware: 'Select Firmware Version',
    recentControllers: 'Recent Controllers',

    searchPlaceholder: 'Search fault code, symptom, or description...',
    searchButton: 'Search',
    searching: 'Searching...',
    noResults: 'No results found. Try a different search term.',
    resultsFound: 'results found',
    clearSearch: 'Clear Search',

    faultCode: 'Fault Code',
    brand: 'Brand',
    model: 'Model',
    category: 'Category',
    subcategory: 'Subcategory',
    severity: 'Severity',
    alarmType: 'Alarm Type',
    description: 'Description',
    symptoms: 'Symptoms',
    possibleCauses: 'Possible Causes',
    diagnosticSteps: 'Diagnostic Steps',
    resetPathways: 'Reset Pathways',
    solutions: 'Solutions',
    safetyWarnings: 'Safety Warnings',
    preventiveMeasures: 'Preventive Measures',

    severityInfo: 'Information',
    severityWarning: 'Warning',
    severityCritical: 'Critical',
    severityShutdown: 'Shutdown',

    alarmWarning: 'Warning',
    alarmTrip: 'Trip',
    alarmShutdown: 'Shutdown',
    alarmLockout: 'Lockout',

    difficultyEasy: 'Easy',
    difficultyModerate: 'Moderate',
    difficultyAdvanced: 'Advanced',
    difficultyExpert: 'Expert Only',

    resetMethod: 'Reset Method',
    resetAuto: 'Automatic',
    resetManual: 'Manual',
    resetKeypad: 'Keypad',
    resetSoftware: 'Software',
    applicableFirmware: 'Applicable Firmware',
    requiredConditions: 'Required Conditions',
    resetSteps: 'Reset Steps',
    successIndicator: 'Success Indicator',
    keySequence: 'Key Sequence',
    menuPath: 'Menu Path',
    expectedResponse: 'Expected Response',

    liveParameters: 'Live Parameters',
    voltage: 'Voltage',
    frequency: 'Frequency',
    rpm: 'Engine RPM',
    oilPressure: 'Oil Pressure',
    coolantTemp: 'Coolant Temperature',
    batteryVoltage: 'Battery Voltage',
    loadPercent: 'Load Percentage',
    fuelLevel: 'Fuel Level',
    enterValue: 'Enter value',
    outOfRange: 'Out of Range',
    withinRange: 'Within Range',

    runDiagnosis: 'Run Diagnosis',
    diagnosisResults: 'Diagnosis Results',
    matchingFaults: 'Matching Faults',
    confidence: 'Confidence',
    noFaultsDetected: 'No faults detected based on parameters',

    feedbackTitle: 'Technician Feedback',
    didItWork: 'Did this solution work?',
    yes: 'Yes',
    no: 'No',
    partiallyWorked: 'Partially',
    addNotes: 'Add notes (optional)',
    submitFeedback: 'Submit Feedback',
    thankYou: 'Thank you for your feedback!',

    offlineMode: 'Offline Mode',
    syncPending: 'Sync Pending',
    lastSynced: 'Last Synced',
    syncNow: 'Sync Now',

    viewDetails: 'View Details',
    hideDetails: 'Hide Details',
    printReport: 'Print Report',
    shareResult: 'Share Result',
    copyCode: 'Copy Code',
    exportPDF: 'Export PDF',

    psi: 'PSI',
    bar: 'bar',
    celsius: '°C',
    fahrenheit: '°F',
    volts: 'V',
    amps: 'A',
    hertz: 'Hz',
    percent: '%',

    tabSearch: 'Search',
    tabDiagnose: 'Diagnose',
    tabHistory: 'History',
    tabSettings: 'Settings',

    navCommand: 'Command',
    navEngine: 'Engine',
    navElectrical: 'Electrical',
    navFaults: 'Faults',
    navFaultAnalysis: 'Fault Analysis',
    navSimulator: 'Simulator',
    navDiagrams: 'Diagrams',
    navAllWiring: 'All Wiring',
    navInput: 'Input',
    navAI: 'AI',
    navAssistant: 'Assistant',
    navLiveMonitor: 'Live Monitor',
    navOBD: 'OBD/CAN',
    navRemote: 'Remote',
    navPredictive: 'Predictive',
    navRecording: 'Recording',
    navManuals: 'Manuals',

    needHelp: 'Need Help?',
    callSupport: 'Call Support',
    whatsappSupport: 'WhatsApp',
    emailSupport: 'Email Support',
  },

  // ==================== SWAHILI ====================
  sw: {
    appTitle: 'Oracle ya Jenereta',
    appSubtitle: 'Mfumo wa Kitaalamu wa Uchunguzi wa Kidhibiti',
    faultCodes: 'Msimbo wa Hitilafu',
    controllers: 'Vidhibiti',
    offlineReady: 'Iko Tayari Bila Mtandao',

    selectBrand: 'Chagua Chapa',
    selectModel: 'Chagua Modeli',
    selectFirmware: 'Chagua Toleo la Firmware',
    recentControllers: 'Vidhibiti vya Hivi Karibuni',

    searchPlaceholder: 'Tafuta msimbo wa hitilafu, dalili, au maelezo...',
    searchButton: 'Tafuta',
    searching: 'Inatafuta...',
    noResults: 'Hakuna matokeo. Jaribu neno lingine.',
    resultsFound: 'matokeo yamepatikana',
    clearSearch: 'Futa Utafutaji',

    faultCode: 'Msimbo wa Hitilafu',
    brand: 'Chapa',
    model: 'Modeli',
    category: 'Kategoria',
    subcategory: 'Kategoria Ndogo',
    severity: 'Ukali',
    alarmType: 'Aina ya Kengele',
    description: 'Maelezo',
    symptoms: 'Dalili',
    possibleCauses: 'Sababu Zinazowezekana',
    diagnosticSteps: 'Hatua za Uchunguzi',
    resetPathways: 'Njia za Kuweka Upya',
    solutions: 'Masuluhisho',
    safetyWarnings: 'Onyo za Usalama',
    preventiveMeasures: 'Hatua za Kuzuia',

    severityInfo: 'Taarifa',
    severityWarning: 'Onyo',
    severityCritical: 'Muhimu',
    severityShutdown: 'Kuzima',

    alarmWarning: 'Onyo',
    alarmTrip: 'Kusimama',
    alarmShutdown: 'Kuzima',
    alarmLockout: 'Kufungwa',

    difficultyEasy: 'Rahisi',
    difficultyModerate: 'Wastani',
    difficultyAdvanced: 'Ya Juu',
    difficultyExpert: 'Mtaalamu Pekee',

    resetMethod: 'Njia ya Kuweka Upya',
    resetAuto: 'Otomatiki',
    resetManual: 'Mwongozo',
    resetKeypad: 'Kibonyezo',
    resetSoftware: 'Programu',
    applicableFirmware: 'Firmware Inayofaa',
    requiredConditions: 'Masharti Yanayohitajika',
    resetSteps: 'Hatua za Kuweka Upya',
    successIndicator: 'Kiashiria cha Mafanikio',
    keySequence: 'Mfuatano wa Funguo',
    menuPath: 'Njia ya Menyu',
    expectedResponse: 'Jibu Linalotarajiwa',

    liveParameters: 'Vigezo vya Moja kwa Moja',
    voltage: 'Voltage',
    frequency: 'Masafa',
    rpm: 'RPM ya Injini',
    oilPressure: 'Shinikizo la Mafuta',
    coolantTemp: 'Joto la Kipozeshi',
    batteryVoltage: 'Voltage ya Betri',
    loadPercent: 'Asilimia ya Mzigo',
    fuelLevel: 'Kiwango cha Mafuta',
    enterValue: 'Ingiza thamani',
    outOfRange: 'Nje ya Kipimo',
    withinRange: 'Ndani ya Kipimo',

    runDiagnosis: 'Fanya Uchunguzi',
    diagnosisResults: 'Matokeo ya Uchunguzi',
    matchingFaults: 'Hitilafu Zinazolingana',
    confidence: 'Uhakika',
    noFaultsDetected: 'Hakuna hitilafu kulingana na vigezo',

    feedbackTitle: 'Maoni ya Fundi',
    didItWork: 'Je, suluhisho hili limefanya kazi?',
    yes: 'Ndiyo',
    no: 'Hapana',
    partiallyWorked: 'Kwa Kiasi',
    addNotes: 'Ongeza maelezo (si lazima)',
    submitFeedback: 'Tuma Maoni',
    thankYou: 'Asante kwa maoni yako!',

    offlineMode: 'Hali ya Nje ya Mtandao',
    syncPending: 'Usawazishaji Unasubiri',
    lastSynced: 'Ilisawazishwa Mwisho',
    syncNow: 'Sawazisha Sasa',

    viewDetails: 'Tazama Maelezo',
    hideDetails: 'Ficha Maelezo',
    printReport: 'Chapisha Ripoti',
    shareResult: 'Shiriki Matokeo',
    copyCode: 'Nakili Msimbo',
    exportPDF: 'Hamisha PDF',

    psi: 'PSI',
    bar: 'bar',
    celsius: '°C',
    fahrenheit: '°F',
    volts: 'V',
    amps: 'A',
    hertz: 'Hz',
    percent: '%',

    tabSearch: 'Tafuta',
    tabDiagnose: 'Chunguza',
    tabHistory: 'Historia',
    tabSettings: 'Mipangilio',

    navCommand: 'Amri',
    navEngine: 'Injini',
    navElectrical: 'Umeme',
    navFaults: 'Hitilafu',
    navFaultAnalysis: 'Uchambuzi wa Hitilafu',
    navSimulator: 'Kiigaji',
    navDiagrams: 'Michoro',
    navAllWiring: 'Waya Zote',
    navInput: 'Ingizo',
    navAI: 'AI',
    navAssistant: 'Msaidizi',
    navLiveMonitor: 'Ufuatiliaji',
    navOBD: 'OBD/CAN',
    navRemote: 'Mbali',
    navPredictive: 'Utabiri',
    navRecording: 'Kurekodi',
    navManuals: 'Miongozo',

    needHelp: 'Unahitaji Msaada?',
    callSupport: 'Piga Simu',
    whatsappSupport: 'WhatsApp',
    emailSupport: 'Barua Pepe',
  },

  // ==================== FRENCH ====================
  fr: {
    appTitle: 'Générateur Oracle',
    appSubtitle: 'Système de Diagnostic Professionnel',
    faultCodes: 'Codes Défaut',
    controllers: 'Contrôleurs',
    offlineReady: 'Disponible Hors Ligne',

    selectBrand: 'Sélectionner la Marque',
    selectModel: 'Sélectionner le Modèle',
    selectFirmware: 'Sélectionner la Version Firmware',
    recentControllers: 'Contrôleurs Récents',

    searchPlaceholder: 'Rechercher code défaut, symptôme ou description...',
    searchButton: 'Rechercher',
    searching: 'Recherche en cours...',
    noResults: 'Aucun résultat. Essayez un autre terme.',
    resultsFound: 'résultats trouvés',
    clearSearch: 'Effacer la Recherche',

    faultCode: 'Code Défaut',
    brand: 'Marque',
    model: 'Modèle',
    category: 'Catégorie',
    subcategory: 'Sous-catégorie',
    severity: 'Gravité',
    alarmType: "Type d'Alarme",
    description: 'Description',
    symptoms: 'Symptômes',
    possibleCauses: 'Causes Possibles',
    diagnosticSteps: 'Étapes de Diagnostic',
    resetPathways: 'Procédures de Réinitialisation',
    solutions: 'Solutions',
    safetyWarnings: 'Avertissements de Sécurité',
    preventiveMeasures: 'Mesures Préventives',

    severityInfo: 'Information',
    severityWarning: 'Avertissement',
    severityCritical: 'Critique',
    severityShutdown: 'Arrêt',

    alarmWarning: 'Avertissement',
    alarmTrip: 'Déclenchement',
    alarmShutdown: 'Arrêt',
    alarmLockout: 'Verrouillage',

    difficultyEasy: 'Facile',
    difficultyModerate: 'Modéré',
    difficultyAdvanced: 'Avancé',
    difficultyExpert: 'Expert Uniquement',

    resetMethod: 'Méthode de Réinitialisation',
    resetAuto: 'Automatique',
    resetManual: 'Manuel',
    resetKeypad: 'Clavier',
    resetSoftware: 'Logiciel',
    applicableFirmware: 'Firmware Applicable',
    requiredConditions: 'Conditions Requises',
    resetSteps: 'Étapes de Réinitialisation',
    successIndicator: 'Indicateur de Succès',
    keySequence: 'Séquence de Touches',
    menuPath: 'Chemin du Menu',
    expectedResponse: 'Réponse Attendue',

    liveParameters: 'Paramètres en Direct',
    voltage: 'Tension',
    frequency: 'Fréquence',
    rpm: 'Régime Moteur',
    oilPressure: "Pression d'Huile",
    coolantTemp: 'Température Liquide de Refroidissement',
    batteryVoltage: 'Tension Batterie',
    loadPercent: 'Pourcentage de Charge',
    fuelLevel: 'Niveau de Carburant',
    enterValue: 'Entrez la valeur',
    outOfRange: 'Hors Plage',
    withinRange: 'Dans la Plage',

    runDiagnosis: 'Lancer le Diagnostic',
    diagnosisResults: 'Résultats du Diagnostic',
    matchingFaults: 'Défauts Correspondants',
    confidence: 'Confiance',
    noFaultsDetected: 'Aucun défaut détecté selon les paramètres',

    feedbackTitle: 'Retour Technicien',
    didItWork: 'Cette solution a-t-elle fonctionné?',
    yes: 'Oui',
    no: 'Non',
    partiallyWorked: 'Partiellement',
    addNotes: 'Ajouter des notes (optionnel)',
    submitFeedback: 'Envoyer le Retour',
    thankYou: 'Merci pour votre retour!',

    offlineMode: 'Mode Hors Ligne',
    syncPending: 'Synchronisation en Attente',
    lastSynced: 'Dernière Synchronisation',
    syncNow: 'Synchroniser Maintenant',

    viewDetails: 'Voir les Détails',
    hideDetails: 'Masquer les Détails',
    printReport: 'Imprimer le Rapport',
    shareResult: 'Partager le Résultat',
    copyCode: 'Copier le Code',
    exportPDF: 'Exporter en PDF',

    psi: 'PSI',
    bar: 'bar',
    celsius: '°C',
    fahrenheit: '°F',
    volts: 'V',
    amps: 'A',
    hertz: 'Hz',
    percent: '%',

    tabSearch: 'Recherche',
    tabDiagnose: 'Diagnostic',
    tabHistory: 'Historique',
    tabSettings: 'Paramètres',

    navCommand: 'Commande',
    navEngine: 'Moteur',
    navElectrical: 'Électrique',
    navFaults: 'Défauts',
    navFaultAnalysis: 'Analyse des Défauts',
    navSimulator: 'Simulateur',
    navDiagrams: 'Schémas',
    navAllWiring: 'Tous Câblages',
    navInput: 'Entrée',
    navAI: 'IA',
    navAssistant: 'Assistant',
    navLiveMonitor: 'Moniteur',
    navOBD: 'OBD/CAN',
    navRemote: 'À Distance',
    navPredictive: 'Prédictif',
    navRecording: 'Enregistrement',
    navManuals: 'Manuels',

    needHelp: "Besoin d'Aide?",
    callSupport: 'Appeler le Support',
    whatsappSupport: 'WhatsApp',
    emailSupport: 'Email Support',
  },

  // ==================== SPANISH ====================
  es: {
    appTitle: 'Generador Oracle',
    appSubtitle: 'Sistema de Diagnóstico Profesional',
    faultCodes: 'Códigos de Falla',
    controllers: 'Controladores',
    offlineReady: 'Listo Sin Conexión',

    selectBrand: 'Seleccionar Marca',
    selectModel: 'Seleccionar Modelo',
    selectFirmware: 'Seleccionar Versión de Firmware',
    recentControllers: 'Controladores Recientes',

    searchPlaceholder: 'Buscar código de falla, síntoma o descripción...',
    searchButton: 'Buscar',
    searching: 'Buscando...',
    noResults: 'Sin resultados. Intente otro término.',
    resultsFound: 'resultados encontrados',
    clearSearch: 'Limpiar Búsqueda',

    faultCode: 'Código de Falla',
    brand: 'Marca',
    model: 'Modelo',
    category: 'Categoría',
    subcategory: 'Subcategoría',
    severity: 'Gravedad',
    alarmType: 'Tipo de Alarma',
    description: 'Descripción',
    symptoms: 'Síntomas',
    possibleCauses: 'Causas Posibles',
    diagnosticSteps: 'Pasos de Diagnóstico',
    resetPathways: 'Procedimientos de Reinicio',
    solutions: 'Soluciones',
    safetyWarnings: 'Advertencias de Seguridad',
    preventiveMeasures: 'Medidas Preventivas',

    severityInfo: 'Información',
    severityWarning: 'Advertencia',
    severityCritical: 'Crítico',
    severityShutdown: 'Apagado',

    alarmWarning: 'Advertencia',
    alarmTrip: 'Disparo',
    alarmShutdown: 'Apagado',
    alarmLockout: 'Bloqueo',

    difficultyEasy: 'Fácil',
    difficultyModerate: 'Moderado',
    difficultyAdvanced: 'Avanzado',
    difficultyExpert: 'Solo Expertos',

    resetMethod: 'Método de Reinicio',
    resetAuto: 'Automático',
    resetManual: 'Manual',
    resetKeypad: 'Teclado',
    resetSoftware: 'Software',
    applicableFirmware: 'Firmware Aplicable',
    requiredConditions: 'Condiciones Requeridas',
    resetSteps: 'Pasos de Reinicio',
    successIndicator: 'Indicador de Éxito',
    keySequence: 'Secuencia de Teclas',
    menuPath: 'Ruta del Menú',
    expectedResponse: 'Respuesta Esperada',

    liveParameters: 'Parámetros en Vivo',
    voltage: 'Voltaje',
    frequency: 'Frecuencia',
    rpm: 'RPM del Motor',
    oilPressure: 'Presión de Aceite',
    coolantTemp: 'Temperatura del Refrigerante',
    batteryVoltage: 'Voltaje de Batería',
    loadPercent: 'Porcentaje de Carga',
    fuelLevel: 'Nivel de Combustible',
    enterValue: 'Ingrese valor',
    outOfRange: 'Fuera de Rango',
    withinRange: 'Dentro del Rango',

    runDiagnosis: 'Ejecutar Diagnóstico',
    diagnosisResults: 'Resultados del Diagnóstico',
    matchingFaults: 'Fallas Coincidentes',
    confidence: 'Confianza',
    noFaultsDetected: 'No se detectaron fallas según los parámetros',

    feedbackTitle: 'Retroalimentación del Técnico',
    didItWork: '¿Funcionó esta solución?',
    yes: 'Sí',
    no: 'No',
    partiallyWorked: 'Parcialmente',
    addNotes: 'Agregar notas (opcional)',
    submitFeedback: 'Enviar Retroalimentación',
    thankYou: '¡Gracias por su retroalimentación!',

    offlineMode: 'Modo Sin Conexión',
    syncPending: 'Sincronización Pendiente',
    lastSynced: 'Última Sincronización',
    syncNow: 'Sincronizar Ahora',

    viewDetails: 'Ver Detalles',
    hideDetails: 'Ocultar Detalles',
    printReport: 'Imprimir Informe',
    shareResult: 'Compartir Resultado',
    copyCode: 'Copiar Código',
    exportPDF: 'Exportar PDF',

    psi: 'PSI',
    bar: 'bar',
    celsius: '°C',
    fahrenheit: '°F',
    volts: 'V',
    amps: 'A',
    hertz: 'Hz',
    percent: '%',

    tabSearch: 'Buscar',
    tabDiagnose: 'Diagnosticar',
    tabHistory: 'Historial',
    tabSettings: 'Configuración',

    navCommand: 'Comando',
    navEngine: 'Motor',
    navElectrical: 'Eléctrico',
    navFaults: 'Fallas',
    navFaultAnalysis: 'Análisis de Fallas',
    navSimulator: 'Simulador',
    navDiagrams: 'Diagramas',
    navAllWiring: 'Todo Cableado',
    navInput: 'Entrada',
    navAI: 'IA',
    navAssistant: 'Asistente',
    navLiveMonitor: 'Monitor',
    navOBD: 'OBD/CAN',
    navRemote: 'Remoto',
    navPredictive: 'Predictivo',
    navRecording: 'Grabación',
    navManuals: 'Manuales',

    needHelp: '¿Necesita Ayuda?',
    callSupport: 'Llamar Soporte',
    whatsappSupport: 'WhatsApp',
    emailSupport: 'Email Soporte',
  },

  // ==================== ARABIC (RTL) ====================
  ar: {
    appTitle: 'أوراكل المولدات',
    appSubtitle: 'نظام تشخيص احترافي للتحكم',
    faultCodes: 'رموز الأعطال',
    controllers: 'وحدات التحكم',
    offlineReady: 'يعمل بدون إنترنت',

    selectBrand: 'اختر العلامة التجارية',
    selectModel: 'اختر الطراز',
    selectFirmware: 'اختر إصدار البرنامج',
    recentControllers: 'وحدات التحكم الأخيرة',

    searchPlaceholder: 'ابحث عن رمز العطل أو العرض أو الوصف...',
    searchButton: 'بحث',
    searching: 'جاري البحث...',
    noResults: 'لا توجد نتائج. جرب كلمة أخرى.',
    resultsFound: 'نتيجة وجدت',
    clearSearch: 'مسح البحث',

    faultCode: 'رمز العطل',
    brand: 'العلامة التجارية',
    model: 'الطراز',
    category: 'الفئة',
    subcategory: 'الفئة الفرعية',
    severity: 'الخطورة',
    alarmType: 'نوع الإنذار',
    description: 'الوصف',
    symptoms: 'الأعراض',
    possibleCauses: 'الأسباب المحتملة',
    diagnosticSteps: 'خطوات التشخيص',
    resetPathways: 'إجراءات إعادة الضبط',
    solutions: 'الحلول',
    safetyWarnings: 'تحذيرات السلامة',
    preventiveMeasures: 'التدابير الوقائية',

    severityInfo: 'معلومات',
    severityWarning: 'تحذير',
    severityCritical: 'حرج',
    severityShutdown: 'إيقاف',

    alarmWarning: 'تحذير',
    alarmTrip: 'فصل',
    alarmShutdown: 'إيقاف',
    alarmLockout: 'قفل',

    difficultyEasy: 'سهل',
    difficultyModerate: 'متوسط',
    difficultyAdvanced: 'متقدم',
    difficultyExpert: 'خبراء فقط',

    resetMethod: 'طريقة إعادة الضبط',
    resetAuto: 'تلقائي',
    resetManual: 'يدوي',
    resetKeypad: 'لوحة المفاتيح',
    resetSoftware: 'البرنامج',
    applicableFirmware: 'البرنامج المطبق',
    requiredConditions: 'الشروط المطلوبة',
    resetSteps: 'خطوات إعادة الضبط',
    successIndicator: 'مؤشر النجاح',
    keySequence: 'تسلسل المفاتيح',
    menuPath: 'مسار القائمة',
    expectedResponse: 'الاستجابة المتوقعة',

    liveParameters: 'المعاملات الحية',
    voltage: 'الجهد',
    frequency: 'التردد',
    rpm: 'دورات المحرك',
    oilPressure: 'ضغط الزيت',
    coolantTemp: 'درجة حرارة المبرد',
    batteryVoltage: 'جهد البطارية',
    loadPercent: 'نسبة الحمل',
    fuelLevel: 'مستوى الوقود',
    enterValue: 'أدخل القيمة',
    outOfRange: 'خارج النطاق',
    withinRange: 'ضمن النطاق',

    runDiagnosis: 'تشغيل التشخيص',
    diagnosisResults: 'نتائج التشخيص',
    matchingFaults: 'الأعطال المطابقة',
    confidence: 'الثقة',
    noFaultsDetected: 'لم يتم اكتشاف أعطال بناءً على المعاملات',

    feedbackTitle: 'ملاحظات الفني',
    didItWork: 'هل نجح هذا الحل؟',
    yes: 'نعم',
    no: 'لا',
    partiallyWorked: 'جزئياً',
    addNotes: 'إضافة ملاحظات (اختياري)',
    submitFeedback: 'إرسال الملاحظات',
    thankYou: 'شكراً لملاحظاتك!',

    offlineMode: 'وضع عدم الاتصال',
    syncPending: 'المزامنة معلقة',
    lastSynced: 'آخر مزامنة',
    syncNow: 'مزامنة الآن',

    viewDetails: 'عرض التفاصيل',
    hideDetails: 'إخفاء التفاصيل',
    printReport: 'طباعة التقرير',
    shareResult: 'مشاركة النتيجة',
    copyCode: 'نسخ الرمز',
    exportPDF: 'تصدير PDF',

    psi: 'رطل/بوصة²',
    bar: 'بار',
    celsius: '°م',
    fahrenheit: '°ف',
    volts: 'فولت',
    amps: 'أمبير',
    hertz: 'هرتز',
    percent: '%',

    tabSearch: 'بحث',
    tabDiagnose: 'تشخيص',
    tabHistory: 'السجل',
    tabSettings: 'الإعدادات',

    navCommand: 'القيادة',
    navEngine: 'المحرك',
    navElectrical: 'الكهرباء',
    navFaults: 'الأعطال',
    navFaultAnalysis: 'تحليل الأعطال',
    navSimulator: 'المحاكي',
    navDiagrams: 'المخططات',
    navAllWiring: 'جميع الأسلاك',
    navInput: 'الإدخال',
    navAI: 'الذكاء الاصطناعي',
    navAssistant: 'المساعد',
    navLiveMonitor: 'المراقبة',
    navOBD: 'OBD/CAN',
    navRemote: 'عن بعد',
    navPredictive: 'التنبؤي',
    navRecording: 'التسجيل',
    navManuals: 'الأدلة',

    needHelp: 'تحتاج مساعدة؟',
    callSupport: 'اتصل بالدعم',
    whatsappSupport: 'واتساب',
    emailSupport: 'البريد الإلكتروني',
  },

  // ==================== HINDI ====================
  hi: {
    appTitle: 'जनरेटर ओरेकल',
    appSubtitle: 'पेशेवर नियंत्रक निदान प्रणाली',
    faultCodes: 'फॉल्ट कोड',
    controllers: 'नियंत्रक',
    offlineReady: 'ऑफ़लाइन तैयार',

    selectBrand: 'ब्रांड चुनें',
    selectModel: 'मॉडल चुनें',
    selectFirmware: 'फर्मवेयर संस्करण चुनें',
    recentControllers: 'हाल के नियंत्रक',

    searchPlaceholder: 'फॉल्ट कोड, लक्षण या विवरण खोजें...',
    searchButton: 'खोजें',
    searching: 'खोज रहा है...',
    noResults: 'कोई परिणाम नहीं। अन्य शब्द आज़माएं।',
    resultsFound: 'परिणाम मिले',
    clearSearch: 'खोज साफ़ करें',

    faultCode: 'फॉल्ट कोड',
    brand: 'ब्रांड',
    model: 'मॉडल',
    category: 'श्रेणी',
    subcategory: 'उप-श्रेणी',
    severity: 'गंभीरता',
    alarmType: 'अलार्म प्रकार',
    description: 'विवरण',
    symptoms: 'लक्षण',
    possibleCauses: 'संभावित कारण',
    diagnosticSteps: 'निदान चरण',
    resetPathways: 'रीसेट प्रक्रियाएं',
    solutions: 'समाधान',
    safetyWarnings: 'सुरक्षा चेतावनियां',
    preventiveMeasures: 'निवारक उपाय',

    severityInfo: 'जानकारी',
    severityWarning: 'चेतावनी',
    severityCritical: 'गंभीर',
    severityShutdown: 'बंद',

    alarmWarning: 'चेतावनी',
    alarmTrip: 'ट्रिप',
    alarmShutdown: 'बंद',
    alarmLockout: 'लॉकआउट',

    difficultyEasy: 'आसान',
    difficultyModerate: 'मध्यम',
    difficultyAdvanced: 'उन्नत',
    difficultyExpert: 'केवल विशेषज्ञ',

    resetMethod: 'रीसेट विधि',
    resetAuto: 'स्वचालित',
    resetManual: 'मैनुअल',
    resetKeypad: 'कीपैड',
    resetSoftware: 'सॉफ्टवेयर',
    applicableFirmware: 'लागू फर्मवेयर',
    requiredConditions: 'आवश्यक शर्तें',
    resetSteps: 'रीसेट चरण',
    successIndicator: 'सफलता संकेतक',
    keySequence: 'की अनुक्रम',
    menuPath: 'मेनू पथ',
    expectedResponse: 'अपेक्षित प्रतिक्रिया',

    liveParameters: 'लाइव पैरामीटर',
    voltage: 'वोल्टेज',
    frequency: 'फ्रीक्वेंसी',
    rpm: 'इंजन RPM',
    oilPressure: 'तेल दबाव',
    coolantTemp: 'शीतलक तापमान',
    batteryVoltage: 'बैटरी वोल्टेज',
    loadPercent: 'लोड प्रतिशत',
    fuelLevel: 'ईंधन स्तर',
    enterValue: 'मान दर्ज करें',
    outOfRange: 'सीमा से बाहर',
    withinRange: 'सीमा के भीतर',

    runDiagnosis: 'निदान चलाएं',
    diagnosisResults: 'निदान परिणाम',
    matchingFaults: 'मिलते-जुलते फॉल्ट',
    confidence: 'विश्वास',
    noFaultsDetected: 'पैरामीटर के आधार पर कोई फॉल्ट नहीं मिला',

    feedbackTitle: 'तकनीशियन फीडबैक',
    didItWork: 'क्या यह समाधान काम किया?',
    yes: 'हां',
    no: 'नहीं',
    partiallyWorked: 'आंशिक रूप से',
    addNotes: 'नोट्स जोड़ें (वैकल्पिक)',
    submitFeedback: 'फीडबैक जमा करें',
    thankYou: 'आपकी प्रतिक्रिया के लिए धन्यवाद!',

    offlineMode: 'ऑफ़लाइन मोड',
    syncPending: 'सिंक लंबित',
    lastSynced: 'अंतिम सिंक',
    syncNow: 'अभी सिंक करें',

    viewDetails: 'विवरण देखें',
    hideDetails: 'विवरण छुपाएं',
    printReport: 'रिपोर्ट प्रिंट करें',
    shareResult: 'परिणाम साझा करें',
    copyCode: 'कोड कॉपी करें',
    exportPDF: 'PDF निर्यात करें',

    psi: 'PSI',
    bar: 'बार',
    celsius: '°C',
    fahrenheit: '°F',
    volts: 'V',
    amps: 'A',
    hertz: 'Hz',
    percent: '%',

    tabSearch: 'खोज',
    tabDiagnose: 'निदान',
    tabHistory: 'इतिहास',
    tabSettings: 'सेटिंग्स',

    navCommand: 'कमांड',
    navEngine: 'इंजन',
    navElectrical: 'विद्युत',
    navFaults: 'दोष',
    navFaultAnalysis: 'दोष विश्लेषण',
    navSimulator: 'सिम्युलेटर',
    navDiagrams: 'आरेख',
    navAllWiring: 'सभी वायरिंग',
    navInput: 'इनपुट',
    navAI: 'AI',
    navAssistant: 'सहायक',
    navLiveMonitor: 'लाइव मॉनिटर',
    navOBD: 'OBD/CAN',
    navRemote: 'रिमोट',
    navPredictive: 'भविष्यसूचक',
    navRecording: 'रिकॉर्डिंग',
    navManuals: 'मैनुअल',

    needHelp: 'सहायता चाहिए?',
    callSupport: 'सहायता कॉल करें',
    whatsappSupport: 'WhatsApp',
    emailSupport: 'ईमेल सहायता',
  },

  // ==================== MANDARIN CHINESE ====================
  zh: {
    appTitle: '发电机智能诊断',
    appSubtitle: '专业控制器诊断系统',
    faultCodes: '故障代码',
    controllers: '控制器',
    offlineReady: '离线可用',

    selectBrand: '选择品牌',
    selectModel: '选择型号',
    selectFirmware: '选择固件版本',
    recentControllers: '最近使用的控制器',

    searchPlaceholder: '搜索故障代码、症状或描述...',
    searchButton: '搜索',
    searching: '正在搜索...',
    noResults: '未找到结果。请尝试其他关键词。',
    resultsFound: '个结果',
    clearSearch: '清除搜索',

    faultCode: '故障代码',
    brand: '品牌',
    model: '型号',
    category: '类别',
    subcategory: '子类别',
    severity: '严重程度',
    alarmType: '报警类型',
    description: '描述',
    symptoms: '症状',
    possibleCauses: '可能原因',
    diagnosticSteps: '诊断步骤',
    resetPathways: '复位程序',
    solutions: '解决方案',
    safetyWarnings: '安全警告',
    preventiveMeasures: '预防措施',

    severityInfo: '信息',
    severityWarning: '警告',
    severityCritical: '严重',
    severityShutdown: '停机',

    alarmWarning: '警告',
    alarmTrip: '跳闸',
    alarmShutdown: '停机',
    alarmLockout: '锁定',

    difficultyEasy: '简单',
    difficultyModerate: '中等',
    difficultyAdvanced: '高级',
    difficultyExpert: '仅限专家',

    resetMethod: '复位方法',
    resetAuto: '自动',
    resetManual: '手动',
    resetKeypad: '键盘',
    resetSoftware: '软件',
    applicableFirmware: '适用固件',
    requiredConditions: '必要条件',
    resetSteps: '复位步骤',
    successIndicator: '成功指示',
    keySequence: '按键顺序',
    menuPath: '菜单路径',
    expectedResponse: '预期响应',

    liveParameters: '实时参数',
    voltage: '电压',
    frequency: '频率',
    rpm: '发动机转速',
    oilPressure: '油压',
    coolantTemp: '冷却液温度',
    batteryVoltage: '电池电压',
    loadPercent: '负载百分比',
    fuelLevel: '燃油液位',
    enterValue: '输入数值',
    outOfRange: '超出范围',
    withinRange: '在范围内',

    runDiagnosis: '运行诊断',
    diagnosisResults: '诊断结果',
    matchingFaults: '匹配故障',
    confidence: '置信度',
    noFaultsDetected: '根据参数未检测到故障',

    feedbackTitle: '技术员反馈',
    didItWork: '此解决方案有效吗？',
    yes: '是',
    no: '否',
    partiallyWorked: '部分有效',
    addNotes: '添加备注（可选）',
    submitFeedback: '提交反馈',
    thankYou: '感谢您的反馈！',

    offlineMode: '离线模式',
    syncPending: '等待同步',
    lastSynced: '上次同步',
    syncNow: '立即同步',

    viewDetails: '查看详情',
    hideDetails: '隐藏详情',
    printReport: '打印报告',
    shareResult: '分享结果',
    copyCode: '复制代码',
    exportPDF: '导出PDF',

    psi: 'PSI',
    bar: 'bar',
    celsius: '°C',
    fahrenheit: '°F',
    volts: 'V',
    amps: 'A',
    hertz: 'Hz',
    percent: '%',

    tabSearch: '搜索',
    tabDiagnose: '诊断',
    tabHistory: '历史',
    tabSettings: '设置',

    navCommand: '命令',
    navEngine: '发动机',
    navElectrical: '电气',
    navFaults: '故障',
    navFaultAnalysis: '故障分析',
    navSimulator: '模拟器',
    navDiagrams: '图表',
    navAllWiring: '所有接线',
    navInput: '输入',
    navAI: '人工智能',
    navAssistant: '助手',
    navLiveMonitor: '实时监控',
    navOBD: 'OBD/CAN',
    navRemote: '远程',
    navPredictive: '预测',
    navRecording: '录制',
    navManuals: '手册',

    needHelp: '需要帮助？',
    callSupport: '致电支持',
    whatsappSupport: 'WhatsApp',
    emailSupport: '邮件支持',
  },
};

export function getOracleTranslation(lang: string): OracleTranslations {
  return ORACLE_TRANSLATIONS[lang] || ORACLE_TRANSLATIONS['en'];
}

export const SUPPORTED_ORACLE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', rtl: false },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', rtl: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'es', name: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', rtl: false },
  { code: 'zh', name: '中文', flag: '🇨🇳', rtl: false },
];
