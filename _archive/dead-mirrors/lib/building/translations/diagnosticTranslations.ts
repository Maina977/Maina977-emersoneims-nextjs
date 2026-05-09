/**
 * DIAGNOSTIC MODULE TRANSLATIONS
 * Real multilingual support for the Generator Diagnostic Suite
 *
 * 12 Languages with FULL translations:
 * - English, Swahili, French, Arabic, Spanish, Chinese
 * - Hindi, Portuguese, German, Japanese, Russian, Korean
 */

export interface TranslationStrings {
  // Header
  title: string;
  subtitle: string;
  errorCodes: string;
  brands: string;
  languages: string;
  accessible: string;

  // Search
  searchPlaceholder: string;
  searchButton: string;
  searching: string;
  noResults: string;
  resultsFound: string;

  // Error Details
  errorCode: string;
  brand: string;
  category: string;
  severity: string;
  description: string;
  symptoms: string;
  causes: string;
  solutions: string;
  diagnosticSteps: string;
  tools: string;
  parts: string;
  estimatedCost: string;
  estimatedTime: string;
  safetyWarnings: string;
  preventiveMeasures: string;
  whenToCallExpert: string;

  // Severity Levels
  severityInfo: string;
  severityWarning: string;
  severityCritical: string;
  severityEmergency: string;

  // Difficulty Levels
  difficultyEasy: string;
  difficultyModerate: string;
  difficultyAdvanced: string;
  difficultyExpert: string;

  // Actions
  callNow: string;
  whatsApp: string;
  email: string;
  getQuote: string;
  viewDetails: string;
  hideDetails: string;
  printReport: string;
  shareResults: string;

  // AI Analysis
  aiAnalysis: string;
  analyzing: string;
  confidence: string;
  primaryCause: string;
  repairTime: string;
  partsCost: string;
  safetyRating: string;

  // Filters
  filterByBrand: string;
  filterBySeverity: string;
  filterByCategory: string;
  allBrands: string;
  allSeverities: string;
  allCategories: string;

  // Settings
  settings: string;
  voiceControl: string;
  audioAlerts: string;
  highContrast: string;
  screenReader: string;
  fontSize: string;

  // Contact
  emergencySupport: string;
  technicalSupport: string;
  availableNow: string;

  // Footer
  poweredBy: string;
  disclaimer: string;
}

export const TRANSLATIONS: Record<string, TranslationStrings> = {
  // ========== ENGLISH ==========
  en: {
    title: 'GENERATOR DIAGNOSTIC BIBLE',
    subtitle: 'World\'s Most Comprehensive Generator Troubleshooting System',
    errorCodes: 'ERROR CODES',
    brands: 'BRANDS',
    languages: 'LANGUAGES',
    accessible: 'ACCESSIBLE',

    searchPlaceholder: 'Search error code, symptom, or brand...',
    searchButton: 'Search',
    searching: 'Searching...',
    noResults: 'No results found. Try a different search term.',
    resultsFound: 'results found',

    errorCode: 'Error Code',
    brand: 'Brand',
    category: 'Category',
    severity: 'Severity',
    description: 'Description',
    symptoms: 'Symptoms',
    causes: 'Possible Causes',
    solutions: 'Solutions',
    diagnosticSteps: 'Diagnostic Steps',
    tools: 'Tools Required',
    parts: 'Parts Needed',
    estimatedCost: 'Estimated Cost',
    estimatedTime: 'Estimated Time',
    safetyWarnings: 'Safety Warnings',
    preventiveMeasures: 'Preventive Measures',
    whenToCallExpert: 'When to Call Expert',

    severityInfo: 'Information',
    severityWarning: 'Warning',
    severityCritical: 'Critical',
    severityEmergency: 'Emergency',

    difficultyEasy: 'Easy',
    difficultyModerate: 'Moderate',
    difficultyAdvanced: 'Advanced',
    difficultyExpert: 'Expert Only',

    callNow: 'Call Now',
    whatsApp: 'WhatsApp',
    email: 'Email',
    getQuote: 'Get Quote',
    viewDetails: 'View Details',
    hideDetails: 'Hide Details',
    printReport: 'Print Report',
    shareResults: 'Share Results',

    aiAnalysis: 'AI Analysis Engine',
    analyzing: 'Analyzing...',
    confidence: 'Confidence',
    primaryCause: 'Primary Cause',
    repairTime: 'Repair Time',
    partsCost: 'Parts Cost',
    safetyRating: 'Safety Rating',

    filterByBrand: 'Filter by Brand',
    filterBySeverity: 'Filter by Severity',
    filterByCategory: 'Filter by Category',
    allBrands: 'All Brands',
    allSeverities: 'All Severities',
    allCategories: 'All Categories',

    settings: 'Settings',
    voiceControl: 'Voice Control',
    audioAlerts: 'Audio Alerts',
    highContrast: 'High Contrast',
    screenReader: 'Screen Reader Mode',
    fontSize: 'Font Size',

    emergencySupport: 'Emergency Support',
    technicalSupport: 'Technical Support',
    availableNow: 'Available 24/7',

    poweredBy: 'Powered by EmersonEIMS',
    disclaimer: 'For informational purposes. Consult certified technicians for repairs.',
  },

  // ========== SWAHILI (Kenya) ==========
  sw: {
    title: 'BIBLIA YA UCHUNGUZI WA JENERETA',
    subtitle: 'Mfumo Kamili Zaidi wa Kutatua Matatizo ya Jenereta Duniani',
    errorCodes: 'NAMBARI ZA HITILAFU',
    brands: 'BRAND',
    languages: 'LUGHA',
    accessible: 'INAFIKIWA',

    searchPlaceholder: 'Tafuta nambari ya hitilafu, dalili, au brand...',
    searchButton: 'Tafuta',
    searching: 'Inatafuta...',
    noResults: 'Hakuna matokeo. Jaribu neno tofauti.',
    resultsFound: 'matokeo yamepatikana',

    errorCode: 'Nambari ya Hitilafu',
    brand: 'Brand',
    category: 'Kategoria',
    severity: 'Ukali',
    description: 'Maelezo',
    symptoms: 'Dalili',
    causes: 'Sababu Zinazowezekana',
    solutions: 'Suluhisho',
    diagnosticSteps: 'Hatua za Uchunguzi',
    tools: 'Zana Zinazohitajika',
    parts: 'Vipuri Vinavyohitajika',
    estimatedCost: 'Gharama Inayokadiriwa',
    estimatedTime: 'Muda Unaokadiriwa',
    safetyWarnings: 'Onyo za Usalama',
    preventiveMeasures: 'Hatua za Kuzuia',
    whenToCallExpert: 'Wakati wa Kumpigia Mtaalamu',

    severityInfo: 'Taarifa',
    severityWarning: 'Onyo',
    severityCritical: 'Muhimu',
    severityEmergency: 'Dharura',

    difficultyEasy: 'Rahisi',
    difficultyModerate: 'Wastani',
    difficultyAdvanced: 'Juu',
    difficultyExpert: 'Mtaalamu Pekee',

    callNow: 'Piga Simu Sasa',
    whatsApp: 'WhatsApp',
    email: 'Barua Pepe',
    getQuote: 'Pata Bei',
    viewDetails: 'Angalia Maelezo',
    hideDetails: 'Ficha Maelezo',
    printReport: 'Chapisha Ripoti',
    shareResults: 'Shiriki Matokeo',

    aiAnalysis: 'Injini ya Uchambuzi wa AI',
    analyzing: 'Inachambua...',
    confidence: 'Uhakika',
    primaryCause: 'Sababu Kuu',
    repairTime: 'Muda wa Kurekebisha',
    partsCost: 'Gharama ya Vipuri',
    safetyRating: 'Kiwango cha Usalama',

    filterByBrand: 'Chuja kwa Brand',
    filterBySeverity: 'Chuja kwa Ukali',
    filterByCategory: 'Chuja kwa Kategoria',
    allBrands: 'Brand Zote',
    allSeverities: 'Ukali Wote',
    allCategories: 'Kategoria Zote',

    settings: 'Mipangilio',
    voiceControl: 'Udhibiti wa Sauti',
    audioAlerts: 'Tahadhari za Sauti',
    highContrast: 'Tofauti Kubwa',
    screenReader: 'Msomaji wa Skrini',
    fontSize: 'Ukubwa wa Fonti',

    emergencySupport: 'Msaada wa Dharura',
    technicalSupport: 'Msaada wa Kiufundi',
    availableNow: 'Inapatikana 24/7',

    poweredBy: 'Imetengenezwa na EmersonEIMS',
    disclaimer: 'Kwa madhumuni ya taarifa. Wasiliana na mafundi wenye cheti kwa marekebisho.',
  },

  // ========== FRENCH ==========
  fr: {
    title: 'BIBLE DE DIAGNOSTIC GENERATEUR',
    subtitle: 'Systeme de Depannage de Generateur le Plus Complet au Monde',
    errorCodes: 'CODES D\'ERREUR',
    brands: 'MARQUES',
    languages: 'LANGUES',
    accessible: 'ACCESSIBLE',

    searchPlaceholder: 'Rechercher code d\'erreur, symptome ou marque...',
    searchButton: 'Rechercher',
    searching: 'Recherche...',
    noResults: 'Aucun resultat. Essayez un autre terme.',
    resultsFound: 'resultats trouves',

    errorCode: 'Code d\'Erreur',
    brand: 'Marque',
    category: 'Categorie',
    severity: 'Gravite',
    description: 'Description',
    symptoms: 'Symptomes',
    causes: 'Causes Possibles',
    solutions: 'Solutions',
    diagnosticSteps: 'Etapes de Diagnostic',
    tools: 'Outils Requis',
    parts: 'Pieces Necessaires',
    estimatedCost: 'Cout Estime',
    estimatedTime: 'Temps Estime',
    safetyWarnings: 'Avertissements de Securite',
    preventiveMeasures: 'Mesures Preventives',
    whenToCallExpert: 'Quand Appeler un Expert',

    severityInfo: 'Information',
    severityWarning: 'Avertissement',
    severityCritical: 'Critique',
    severityEmergency: 'Urgence',

    difficultyEasy: 'Facile',
    difficultyModerate: 'Modere',
    difficultyAdvanced: 'Avance',
    difficultyExpert: 'Expert Seulement',

    callNow: 'Appeler Maintenant',
    whatsApp: 'WhatsApp',
    email: 'Email',
    getQuote: 'Obtenir un Devis',
    viewDetails: 'Voir Details',
    hideDetails: 'Masquer Details',
    printReport: 'Imprimer Rapport',
    shareResults: 'Partager Resultats',

    aiAnalysis: 'Moteur d\'Analyse IA',
    analyzing: 'Analyse...',
    confidence: 'Confiance',
    primaryCause: 'Cause Principale',
    repairTime: 'Temps de Reparation',
    partsCost: 'Cout des Pieces',
    safetyRating: 'Note de Securite',

    filterByBrand: 'Filtrer par Marque',
    filterBySeverity: 'Filtrer par Gravite',
    filterByCategory: 'Filtrer par Categorie',
    allBrands: 'Toutes les Marques',
    allSeverities: 'Toutes les Gravites',
    allCategories: 'Toutes les Categories',

    settings: 'Parametres',
    voiceControl: 'Controle Vocal',
    audioAlerts: 'Alertes Audio',
    highContrast: 'Contraste Eleve',
    screenReader: 'Mode Lecteur d\'Ecran',
    fontSize: 'Taille de Police',

    emergencySupport: 'Support d\'Urgence',
    technicalSupport: 'Support Technique',
    availableNow: 'Disponible 24/7',

    poweredBy: 'Propulse par EmersonEIMS',
    disclaimer: 'A titre informatif. Consultez des techniciens certifies pour les reparations.',
  },

  // ========== ARABIC ==========
  ar: {
    title: 'دليل تشخيص المولدات',
    subtitle: 'أشمل نظام لاستكشاف أخطاء المولدات في العالم',
    errorCodes: 'رموز الأخطاء',
    brands: 'العلامات التجارية',
    languages: 'اللغات',
    accessible: 'سهل الوصول',

    searchPlaceholder: 'ابحث عن رمز الخطأ أو العرض أو العلامة التجارية...',
    searchButton: 'بحث',
    searching: 'جاري البحث...',
    noResults: 'لا توجد نتائج. جرب مصطلح بحث مختلف.',
    resultsFound: 'نتائج وجدت',

    errorCode: 'رمز الخطأ',
    brand: 'العلامة التجارية',
    category: 'الفئة',
    severity: 'الخطورة',
    description: 'الوصف',
    symptoms: 'الأعراض',
    causes: 'الأسباب المحتملة',
    solutions: 'الحلول',
    diagnosticSteps: 'خطوات التشخيص',
    tools: 'الأدوات المطلوبة',
    parts: 'القطع المطلوبة',
    estimatedCost: 'التكلفة المقدرة',
    estimatedTime: 'الوقت المقدر',
    safetyWarnings: 'تحذيرات السلامة',
    preventiveMeasures: 'الإجراءات الوقائية',
    whenToCallExpert: 'متى تتصل بخبير',

    severityInfo: 'معلومات',
    severityWarning: 'تحذير',
    severityCritical: 'حرج',
    severityEmergency: 'طوارئ',

    difficultyEasy: 'سهل',
    difficultyModerate: 'متوسط',
    difficultyAdvanced: 'متقدم',
    difficultyExpert: 'خبير فقط',

    callNow: 'اتصل الآن',
    whatsApp: 'واتساب',
    email: 'بريد إلكتروني',
    getQuote: 'احصل على عرض سعر',
    viewDetails: 'عرض التفاصيل',
    hideDetails: 'إخفاء التفاصيل',
    printReport: 'طباعة التقرير',
    shareResults: 'مشاركة النتائج',

    aiAnalysis: 'محرك تحليل الذكاء الاصطناعي',
    analyzing: 'جاري التحليل...',
    confidence: 'الثقة',
    primaryCause: 'السبب الرئيسي',
    repairTime: 'وقت الإصلاح',
    partsCost: 'تكلفة القطع',
    safetyRating: 'تصنيف السلامة',

    filterByBrand: 'تصفية حسب العلامة التجارية',
    filterBySeverity: 'تصفية حسب الخطورة',
    filterByCategory: 'تصفية حسب الفئة',
    allBrands: 'جميع العلامات التجارية',
    allSeverities: 'جميع مستويات الخطورة',
    allCategories: 'جميع الفئات',

    settings: 'الإعدادات',
    voiceControl: 'التحكم الصوتي',
    audioAlerts: 'تنبيهات صوتية',
    highContrast: 'تباين عالي',
    screenReader: 'وضع قارئ الشاشة',
    fontSize: 'حجم الخط',

    emergencySupport: 'دعم الطوارئ',
    technicalSupport: 'الدعم الفني',
    availableNow: 'متاح 24/7',

    poweredBy: 'مدعوم من EmersonEIMS',
    disclaimer: 'لأغراض إعلامية. استشر فنيين معتمدين للإصلاحات.',
  },

  // ========== SPANISH ==========
  es: {
    title: 'BIBLIA DE DIAGNOSTICO DE GENERADORES',
    subtitle: 'El Sistema de Solucion de Problemas de Generadores Mas Completo del Mundo',
    errorCodes: 'CODIGOS DE ERROR',
    brands: 'MARCAS',
    languages: 'IDIOMAS',
    accessible: 'ACCESIBLE',

    searchPlaceholder: 'Buscar codigo de error, sintoma o marca...',
    searchButton: 'Buscar',
    searching: 'Buscando...',
    noResults: 'Sin resultados. Intente otro termino.',
    resultsFound: 'resultados encontrados',

    errorCode: 'Codigo de Error',
    brand: 'Marca',
    category: 'Categoria',
    severity: 'Gravedad',
    description: 'Descripcion',
    symptoms: 'Sintomas',
    causes: 'Causas Posibles',
    solutions: 'Soluciones',
    diagnosticSteps: 'Pasos de Diagnostico',
    tools: 'Herramientas Requeridas',
    parts: 'Piezas Necesarias',
    estimatedCost: 'Costo Estimado',
    estimatedTime: 'Tiempo Estimado',
    safetyWarnings: 'Advertencias de Seguridad',
    preventiveMeasures: 'Medidas Preventivas',
    whenToCallExpert: 'Cuando Llamar a un Experto',

    severityInfo: 'Informacion',
    severityWarning: 'Advertencia',
    severityCritical: 'Critico',
    severityEmergency: 'Emergencia',

    difficultyEasy: 'Facil',
    difficultyModerate: 'Moderado',
    difficultyAdvanced: 'Avanzado',
    difficultyExpert: 'Solo Expertos',

    callNow: 'Llamar Ahora',
    whatsApp: 'WhatsApp',
    email: 'Correo',
    getQuote: 'Obtener Cotizacion',
    viewDetails: 'Ver Detalles',
    hideDetails: 'Ocultar Detalles',
    printReport: 'Imprimir Informe',
    shareResults: 'Compartir Resultados',

    aiAnalysis: 'Motor de Analisis IA',
    analyzing: 'Analizando...',
    confidence: 'Confianza',
    primaryCause: 'Causa Principal',
    repairTime: 'Tiempo de Reparacion',
    partsCost: 'Costo de Piezas',
    safetyRating: 'Calificacion de Seguridad',

    filterByBrand: 'Filtrar por Marca',
    filterBySeverity: 'Filtrar por Gravedad',
    filterByCategory: 'Filtrar por Categoria',
    allBrands: 'Todas las Marcas',
    allSeverities: 'Todas las Gravedades',
    allCategories: 'Todas las Categorias',

    settings: 'Configuracion',
    voiceControl: 'Control por Voz',
    audioAlerts: 'Alertas de Audio',
    highContrast: 'Alto Contraste',
    screenReader: 'Modo Lector de Pantalla',
    fontSize: 'Tamano de Fuente',

    emergencySupport: 'Soporte de Emergencia',
    technicalSupport: 'Soporte Tecnico',
    availableNow: 'Disponible 24/7',

    poweredBy: 'Desarrollado por EmersonEIMS',
    disclaimer: 'Solo para fines informativos. Consulte tecnicos certificados para reparaciones.',
  },

  // ========== CHINESE ==========
  zh: {
    title: '发电机诊断圣经',
    subtitle: '世界上最全面的发电机故障排除系统',
    errorCodes: '错误代码',
    brands: '品牌',
    languages: '语言',
    accessible: '无障碍',

    searchPlaceholder: '搜索错误代码、症状或品牌...',
    searchButton: '搜索',
    searching: '搜索中...',
    noResults: '未找到结果。请尝试其他搜索词。',
    resultsFound: '找到结果',

    errorCode: '错误代码',
    brand: '品牌',
    category: '类别',
    severity: '严重程度',
    description: '描述',
    symptoms: '症状',
    causes: '可能原因',
    solutions: '解决方案',
    diagnosticSteps: '诊断步骤',
    tools: '所需工具',
    parts: '所需零件',
    estimatedCost: '预计成本',
    estimatedTime: '预计时间',
    safetyWarnings: '安全警告',
    preventiveMeasures: '预防措施',
    whenToCallExpert: '何时联系专家',

    severityInfo: '信息',
    severityWarning: '警告',
    severityCritical: '严重',
    severityEmergency: '紧急',

    difficultyEasy: '简单',
    difficultyModerate: '中等',
    difficultyAdvanced: '高级',
    difficultyExpert: '仅限专家',

    callNow: '立即致电',
    whatsApp: 'WhatsApp',
    email: '电子邮件',
    getQuote: '获取报价',
    viewDetails: '查看详情',
    hideDetails: '隐藏详情',
    printReport: '打印报告',
    shareResults: '分享结果',

    aiAnalysis: 'AI分析引擎',
    analyzing: '分析中...',
    confidence: '置信度',
    primaryCause: '主要原因',
    repairTime: '维修时间',
    partsCost: '零件成本',
    safetyRating: '安全等级',

    filterByBrand: '按品牌筛选',
    filterBySeverity: '按严重程度筛选',
    filterByCategory: '按类别筛选',
    allBrands: '所有品牌',
    allSeverities: '所有严重程度',
    allCategories: '所有类别',

    settings: '设置',
    voiceControl: '语音控制',
    audioAlerts: '音频警报',
    highContrast: '高对比度',
    screenReader: '屏幕阅读器模式',
    fontSize: '字体大小',

    emergencySupport: '紧急支持',
    technicalSupport: '技术支持',
    availableNow: '24/7全天候',

    poweredBy: '由EmersonEIMS提供',
    disclaimer: '仅供参考。维修请咨询认证技术人员。',
  },

  // ========== HINDI ==========
  hi: {
    title: 'जनरेटर डायग्नोस्टिक बाइबल',
    subtitle: 'दुनिया का सबसे व्यापक जनरेटर समस्या निवारण सिस्टम',
    errorCodes: 'त्रुटि कोड',
    brands: 'ब्रांड',
    languages: 'भाषाएं',
    accessible: 'सुलभ',

    searchPlaceholder: 'त्रुटि कोड, लक्षण या ब्रांड खोजें...',
    searchButton: 'खोजें',
    searching: 'खोज रहा है...',
    noResults: 'कोई परिणाम नहीं। कोई अन्य शब्द आज़माएं।',
    resultsFound: 'परिणाम मिले',

    errorCode: 'त्रुटि कोड',
    brand: 'ब्रांड',
    category: 'श्रेणी',
    severity: 'गंभीरता',
    description: 'विवरण',
    symptoms: 'लक्षण',
    causes: 'संभावित कारण',
    solutions: 'समाधान',
    diagnosticSteps: 'निदान चरण',
    tools: 'आवश्यक उपकरण',
    parts: 'आवश्यक पुर्जे',
    estimatedCost: 'अनुमानित लागत',
    estimatedTime: 'अनुमानित समय',
    safetyWarnings: 'सुरक्षा चेतावनियां',
    preventiveMeasures: 'निवारक उपाय',
    whenToCallExpert: 'विशेषज्ञ को कब बुलाएं',

    severityInfo: 'जानकारी',
    severityWarning: 'चेतावनी',
    severityCritical: 'गंभीर',
    severityEmergency: 'आपातकालीन',

    difficultyEasy: 'आसान',
    difficultyModerate: 'मध्यम',
    difficultyAdvanced: 'उन्नत',
    difficultyExpert: 'केवल विशेषज्ञ',

    callNow: 'अभी कॉल करें',
    whatsApp: 'WhatsApp',
    email: 'ईमेल',
    getQuote: 'कोटेशन प्राप्त करें',
    viewDetails: 'विवरण देखें',
    hideDetails: 'विवरण छुपाएं',
    printReport: 'रिपोर्ट प्रिंट करें',
    shareResults: 'परिणाम साझा करें',

    aiAnalysis: 'AI विश्लेषण इंजन',
    analyzing: 'विश्लेषण हो रहा है...',
    confidence: 'विश्वास',
    primaryCause: 'मुख्य कारण',
    repairTime: 'मरम्मत का समय',
    partsCost: 'पुर्जों की लागत',
    safetyRating: 'सुरक्षा रेटिंग',

    filterByBrand: 'ब्रांड द्वारा फ़िल्टर करें',
    filterBySeverity: 'गंभीरता द्वारा फ़िल्टर करें',
    filterByCategory: 'श्रेणी द्वारा फ़िल्टर करें',
    allBrands: 'सभी ब्रांड',
    allSeverities: 'सभी गंभीरताएं',
    allCategories: 'सभी श्रेणियां',

    settings: 'सेटिंग्स',
    voiceControl: 'वॉयस कंट्रोल',
    audioAlerts: 'ऑडियो अलर्ट',
    highContrast: 'उच्च कंट्रास्ट',
    screenReader: 'स्क्रीन रीडर मोड',
    fontSize: 'फ़ॉन्ट आकार',

    emergencySupport: 'आपातकालीन सहायता',
    technicalSupport: 'तकनीकी सहायता',
    availableNow: '24/7 उपलब्ध',

    poweredBy: 'EmersonEIMS द्वारा संचालित',
    disclaimer: 'केवल सूचनात्मक उद्देश्यों के लिए। मरम्मत के लिए प्रमाणित तकनीशियनों से परामर्श करें।',
  },

  // ========== PORTUGUESE ==========
  pt: {
    title: 'BIBLIA DE DIAGNOSTICO DE GERADORES',
    subtitle: 'O Sistema de Solucao de Problemas de Geradores Mais Completo do Mundo',
    errorCodes: 'CODIGOS DE ERRO',
    brands: 'MARCAS',
    languages: 'IDIOMAS',
    accessible: 'ACESSIVEL',

    searchPlaceholder: 'Pesquisar codigo de erro, sintoma ou marca...',
    searchButton: 'Pesquisar',
    searching: 'Pesquisando...',
    noResults: 'Nenhum resultado. Tente outro termo.',
    resultsFound: 'resultados encontrados',

    errorCode: 'Codigo de Erro',
    brand: 'Marca',
    category: 'Categoria',
    severity: 'Gravidade',
    description: 'Descricao',
    symptoms: 'Sintomas',
    causes: 'Causas Possiveis',
    solutions: 'Solucoes',
    diagnosticSteps: 'Etapas de Diagnostico',
    tools: 'Ferramentas Necessarias',
    parts: 'Pecas Necessarias',
    estimatedCost: 'Custo Estimado',
    estimatedTime: 'Tempo Estimado',
    safetyWarnings: 'Avisos de Seguranca',
    preventiveMeasures: 'Medidas Preventivas',
    whenToCallExpert: 'Quando Chamar um Especialista',

    severityInfo: 'Informacao',
    severityWarning: 'Aviso',
    severityCritical: 'Critico',
    severityEmergency: 'Emergencia',

    difficultyEasy: 'Facil',
    difficultyModerate: 'Moderado',
    difficultyAdvanced: 'Avancado',
    difficultyExpert: 'Apenas Especialistas',

    callNow: 'Ligar Agora',
    whatsApp: 'WhatsApp',
    email: 'Email',
    getQuote: 'Obter Orcamento',
    viewDetails: 'Ver Detalhes',
    hideDetails: 'Ocultar Detalhes',
    printReport: 'Imprimir Relatorio',
    shareResults: 'Compartilhar Resultados',

    aiAnalysis: 'Motor de Analise IA',
    analyzing: 'Analisando...',
    confidence: 'Confianca',
    primaryCause: 'Causa Principal',
    repairTime: 'Tempo de Reparo',
    partsCost: 'Custo das Pecas',
    safetyRating: 'Classificacao de Seguranca',

    filterByBrand: 'Filtrar por Marca',
    filterBySeverity: 'Filtrar por Gravidade',
    filterByCategory: 'Filtrar por Categoria',
    allBrands: 'Todas as Marcas',
    allSeverities: 'Todas as Gravidades',
    allCategories: 'Todas as Categorias',

    settings: 'Configuracoes',
    voiceControl: 'Controle por Voz',
    audioAlerts: 'Alertas de Audio',
    highContrast: 'Alto Contraste',
    screenReader: 'Modo Leitor de Tela',
    fontSize: 'Tamanho da Fonte',

    emergencySupport: 'Suporte de Emergencia',
    technicalSupport: 'Suporte Tecnico',
    availableNow: 'Disponivel 24/7',

    poweredBy: 'Desenvolvido por EmersonEIMS',
    disclaimer: 'Apenas para fins informativos. Consulte tecnicos certificados para reparos.',
  },

  // ========== GERMAN ==========
  de: {
    title: 'GENERATOR-DIAGNOSE-BIBEL',
    subtitle: 'Das umfassendste Generator-Fehlerbehebungssystem der Welt',
    errorCodes: 'FEHLERCODES',
    brands: 'MARKEN',
    languages: 'SPRACHEN',
    accessible: 'BARRIEREFREI',

    searchPlaceholder: 'Fehlercode, Symptom oder Marke suchen...',
    searchButton: 'Suchen',
    searching: 'Suche...',
    noResults: 'Keine Ergebnisse. Versuchen Sie einen anderen Begriff.',
    resultsFound: 'Ergebnisse gefunden',

    errorCode: 'Fehlercode',
    brand: 'Marke',
    category: 'Kategorie',
    severity: 'Schweregrad',
    description: 'Beschreibung',
    symptoms: 'Symptome',
    causes: 'Mogliche Ursachen',
    solutions: 'Losungen',
    diagnosticSteps: 'Diagnoseschritte',
    tools: 'Benotige Werkzeuge',
    parts: 'Benotige Teile',
    estimatedCost: 'Geschatzte Kosten',
    estimatedTime: 'Geschatzte Zeit',
    safetyWarnings: 'Sicherheitswarnungen',
    preventiveMeasures: 'Vorbeugende Maßnahmen',
    whenToCallExpert: 'Wann einen Experten rufen',

    severityInfo: 'Information',
    severityWarning: 'Warnung',
    severityCritical: 'Kritisch',
    severityEmergency: 'Notfall',

    difficultyEasy: 'Einfach',
    difficultyModerate: 'Mittel',
    difficultyAdvanced: 'Fortgeschritten',
    difficultyExpert: 'Nur Experten',

    callNow: 'Jetzt Anrufen',
    whatsApp: 'WhatsApp',
    email: 'E-Mail',
    getQuote: 'Angebot Anfordern',
    viewDetails: 'Details Anzeigen',
    hideDetails: 'Details Ausblenden',
    printReport: 'Bericht Drucken',
    shareResults: 'Ergebnisse Teilen',

    aiAnalysis: 'KI-Analyse-Engine',
    analyzing: 'Analysiere...',
    confidence: 'Vertrauen',
    primaryCause: 'Hauptursache',
    repairTime: 'Reparaturzeit',
    partsCost: 'Teilekosten',
    safetyRating: 'Sicherheitsbewertung',

    filterByBrand: 'Nach Marke Filtern',
    filterBySeverity: 'Nach Schweregrad Filtern',
    filterByCategory: 'Nach Kategorie Filtern',
    allBrands: 'Alle Marken',
    allSeverities: 'Alle Schweregrade',
    allCategories: 'Alle Kategorien',

    settings: 'Einstellungen',
    voiceControl: 'Sprachsteuerung',
    audioAlerts: 'Audio-Warnungen',
    highContrast: 'Hoher Kontrast',
    screenReader: 'Bildschirmleser-Modus',
    fontSize: 'Schriftgroße',

    emergencySupport: 'Notfall-Support',
    technicalSupport: 'Technischer Support',
    availableNow: 'Verfugbar 24/7',

    poweredBy: 'Betrieben von EmersonEIMS',
    disclaimer: 'Nur zu Informationszwecken. Konsultieren Sie zertifizierte Techniker fur Reparaturen.',
  },

  // ========== JAPANESE ==========
  ja: {
    title: '発電機診断バイブル',
    subtitle: '世界で最も包括的な発電機トラブルシューティングシステム',
    errorCodes: 'エラーコード',
    brands: 'ブランド',
    languages: '言語',
    accessible: 'アクセシブル',

    searchPlaceholder: 'エラーコード、症状、またはブランドを検索...',
    searchButton: '検索',
    searching: '検索中...',
    noResults: '結果が見つかりません。別の用語をお試しください。',
    resultsFound: '件の結果が見つかりました',

    errorCode: 'エラーコード',
    brand: 'ブランド',
    category: 'カテゴリ',
    severity: '重大度',
    description: '説明',
    symptoms: '症状',
    causes: '考えられる原因',
    solutions: '解決策',
    diagnosticSteps: '診断手順',
    tools: '必要な工具',
    parts: '必要な部品',
    estimatedCost: '推定コスト',
    estimatedTime: '推定時間',
    safetyWarnings: '安全警告',
    preventiveMeasures: '予防措置',
    whenToCallExpert: '専門家に連絡するタイミング',

    severityInfo: '情報',
    severityWarning: '警告',
    severityCritical: '重大',
    severityEmergency: '緊急',

    difficultyEasy: '簡単',
    difficultyModerate: '中程度',
    difficultyAdvanced: '上級',
    difficultyExpert: '専門家のみ',

    callNow: '今すぐ電話',
    whatsApp: 'WhatsApp',
    email: 'メール',
    getQuote: '見積もりを取得',
    viewDetails: '詳細を表示',
    hideDetails: '詳細を非表示',
    printReport: 'レポートを印刷',
    shareResults: '結果を共有',

    aiAnalysis: 'AI分析エンジン',
    analyzing: '分析中...',
    confidence: '信頼度',
    primaryCause: '主な原因',
    repairTime: '修理時間',
    partsCost: '部品コスト',
    safetyRating: '安全評価',

    filterByBrand: 'ブランドでフィルタ',
    filterBySeverity: '重大度でフィルタ',
    filterByCategory: 'カテゴリでフィルタ',
    allBrands: 'すべてのブランド',
    allSeverities: 'すべての重大度',
    allCategories: 'すべてのカテゴリ',

    settings: '設定',
    voiceControl: '音声コントロール',
    audioAlerts: '音声アラート',
    highContrast: 'ハイコントラスト',
    screenReader: 'スクリーンリーダーモード',
    fontSize: 'フォントサイズ',

    emergencySupport: '緊急サポート',
    technicalSupport: '技術サポート',
    availableNow: '24時間年中無休',

    poweredBy: 'EmersonEIMSが提供',
    disclaimer: '情報提供のみを目的としています。修理については認定技術者にご相談ください。',
  },

  // ========== RUSSIAN ==========
  ru: {
    title: 'БИБЛИЯ ДИАГНОСТИКИ ГЕНЕРАТОРОВ',
    subtitle: 'Самая полная в мире система устранения неисправностей генераторов',
    errorCodes: 'КОДЫ ОШИБОК',
    brands: 'БРЕНДЫ',
    languages: 'ЯЗЫКИ',
    accessible: 'ДОСТУПНО',

    searchPlaceholder: 'Поиск кода ошибки, симптома или бренда...',
    searchButton: 'Поиск',
    searching: 'Поиск...',
    noResults: 'Результаты не найдены. Попробуйте другой запрос.',
    resultsFound: 'результатов найдено',

    errorCode: 'Код ошибки',
    brand: 'Бренд',
    category: 'Категория',
    severity: 'Серьезность',
    description: 'Описание',
    symptoms: 'Симптомы',
    causes: 'Возможные причины',
    solutions: 'Решения',
    diagnosticSteps: 'Диагностические шаги',
    tools: 'Необходимые инструменты',
    parts: 'Необходимые детали',
    estimatedCost: 'Расчетная стоимость',
    estimatedTime: 'Расчетное время',
    safetyWarnings: 'Предупреждения о безопасности',
    preventiveMeasures: 'Профилактические меры',
    whenToCallExpert: 'Когда вызывать специалиста',

    severityInfo: 'Информация',
    severityWarning: 'Предупреждение',
    severityCritical: 'Критично',
    severityEmergency: 'Экстренно',

    difficultyEasy: 'Легко',
    difficultyModerate: 'Средне',
    difficultyAdvanced: 'Сложно',
    difficultyExpert: 'Только для экспертов',

    callNow: 'Позвонить сейчас',
    whatsApp: 'WhatsApp',
    email: 'Эл. почта',
    getQuote: 'Получить цену',
    viewDetails: 'Показать детали',
    hideDetails: 'Скрыть детали',
    printReport: 'Печать отчета',
    shareResults: 'Поделиться результатами',

    aiAnalysis: 'Движок ИИ-анализа',
    analyzing: 'Анализ...',
    confidence: 'Уверенность',
    primaryCause: 'Основная причина',
    repairTime: 'Время ремонта',
    partsCost: 'Стоимость деталей',
    safetyRating: 'Рейтинг безопасности',

    filterByBrand: 'Фильтр по бренду',
    filterBySeverity: 'Фильтр по серьезности',
    filterByCategory: 'Фильтр по категории',
    allBrands: 'Все бренды',
    allSeverities: 'Все уровни',
    allCategories: 'Все категории',

    settings: 'Настройки',
    voiceControl: 'Голосовое управление',
    audioAlerts: 'Звуковые оповещения',
    highContrast: 'Высокий контраст',
    screenReader: 'Режим чтения с экрана',
    fontSize: 'Размер шрифта',

    emergencySupport: 'Экстренная поддержка',
    technicalSupport: 'Техническая поддержка',
    availableNow: 'Доступно 24/7',

    poweredBy: 'Работает на EmersonEIMS',
    disclaimer: 'Только для информационных целей. Обратитесь к сертифицированным техникам для ремонта.',
  },

  // ========== KOREAN ==========
  ko: {
    title: '발전기 진단 바이블',
    subtitle: '세계에서 가장 포괄적인 발전기 문제 해결 시스템',
    errorCodes: '오류 코드',
    brands: '브랜드',
    languages: '언어',
    accessible: '접근성',

    searchPlaceholder: '오류 코드, 증상 또는 브랜드 검색...',
    searchButton: '검색',
    searching: '검색 중...',
    noResults: '결과가 없습니다. 다른 검색어를 시도해 보세요.',
    resultsFound: '개의 결과를 찾았습니다',

    errorCode: '오류 코드',
    brand: '브랜드',
    category: '카테고리',
    severity: '심각도',
    description: '설명',
    symptoms: '증상',
    causes: '가능한 원인',
    solutions: '해결책',
    diagnosticSteps: '진단 단계',
    tools: '필요한 도구',
    parts: '필요한 부품',
    estimatedCost: '예상 비용',
    estimatedTime: '예상 시간',
    safetyWarnings: '안전 경고',
    preventiveMeasures: '예방 조치',
    whenToCallExpert: '전문가에게 문의할 시기',

    severityInfo: '정보',
    severityWarning: '경고',
    severityCritical: '심각',
    severityEmergency: '긴급',

    difficultyEasy: '쉬움',
    difficultyModerate: '보통',
    difficultyAdvanced: '고급',
    difficultyExpert: '전문가만',

    callNow: '지금 전화',
    whatsApp: 'WhatsApp',
    email: '이메일',
    getQuote: '견적 받기',
    viewDetails: '상세 보기',
    hideDetails: '상세 숨기기',
    printReport: '보고서 인쇄',
    shareResults: '결과 공유',

    aiAnalysis: 'AI 분석 엔진',
    analyzing: '분석 중...',
    confidence: '신뢰도',
    primaryCause: '주요 원인',
    repairTime: '수리 시간',
    partsCost: '부품 비용',
    safetyRating: '안전 등급',

    filterByBrand: '브랜드별 필터',
    filterBySeverity: '심각도별 필터',
    filterByCategory: '카테고리별 필터',
    allBrands: '모든 브랜드',
    allSeverities: '모든 심각도',
    allCategories: '모든 카테고리',

    settings: '설정',
    voiceControl: '음성 제어',
    audioAlerts: '오디오 알림',
    highContrast: '고대비',
    screenReader: '화면 읽기 모드',
    fontSize: '글꼴 크기',

    emergencySupport: '긴급 지원',
    technicalSupport: '기술 지원',
    availableNow: '24시간 연중무휴',

    poweredBy: 'EmersonEIMS 제공',
    disclaimer: '정보 제공 목적으로만 사용됩니다. 수리는 인증된 기술자에게 문의하세요.',
  },
};

// Get translation for a specific language code
export function getTranslation(langCode: string): TranslationStrings {
  return TRANSLATIONS[langCode] || TRANSLATIONS.en;
}

// Get all supported language codes
export function getSupportedLanguageCodes(): string[] {
  return Object.keys(TRANSLATIONS);
}

// Check if a language is supported
export function isLanguageSupported(langCode: string): boolean {
  return langCode in TRANSLATIONS;
}
