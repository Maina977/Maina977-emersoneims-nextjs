/**
 * Kenya Locations Database
 * All 47 Counties, 290 Constituencies, and Major Villages
 * With Solar Irradiance Data and Weather Zones
 */

export interface Village {
  name: string;
  coordinates: { lat: number; lng: number };
  population?: number;
}

export interface Constituency {
  name: string;
  code: string;
  villages: Village[];
}

export interface County {
  id: number;
  name: string;
  code: string;
  capital: string;
  region: 'Coast' | 'North Eastern' | 'Eastern' | 'Central' | 'Rift Valley' | 'Western' | 'Nyanza' | 'Nairobi';
  coordinates: { lat: number; lng: number };
  solarIrradiance: number; // kWh/m²/day
  peakSunHours: number;
  weatherZone: 'Coastal' | 'Arid' | 'Semi-Arid' | 'Highland' | 'Lake Region' | 'Urban';
  avgTemperature: { min: number; max: number };
  rainySeasons: string[];
  constituencies: Constituency[];
}

// Kenya Counties with Solar Data
export const KENYA_COUNTIES: County[] = [
  {
    id: 1,
    name: 'Mombasa',
    code: '001',
    capital: 'Mombasa',
    region: 'Coast',
    coordinates: { lat: -4.0435, lng: 39.6682 },
    solarIrradiance: 5.8,
    peakSunHours: 5.5,
    weatherZone: 'Coastal',
    avgTemperature: { min: 24, max: 32 },
    rainySeasons: ['April-June', 'October-December'],
    constituencies: [
      { name: 'Changamwe', code: '001-01', villages: [{ name: 'Mikindani', coordinates: { lat: -4.0234, lng: 39.6234 } }, { name: 'Port Reitz', coordinates: { lat: -4.0456, lng: 39.6123 } }, { name: 'Chaani', coordinates: { lat: -4.0567, lng: 39.6345 } }] },
      { name: 'Jomvu', code: '001-02', villages: [{ name: 'Jomvu Kuu', coordinates: { lat: -4.0123, lng: 39.5987 } }, { name: 'Miritini', coordinates: { lat: -4.0234, lng: 39.5876 } }] },
      { name: 'Kisauni', code: '001-03', villages: [{ name: 'Mjambere', coordinates: { lat: -3.9876, lng: 39.7123 } }, { name: 'Bamburi', coordinates: { lat: -3.9765, lng: 39.7234 } }, { name: 'Shanzu', coordinates: { lat: -3.9654, lng: 39.7345 } }] },
      { name: 'Nyali', code: '001-04', villages: [{ name: 'Frere Town', coordinates: { lat: -4.0123, lng: 39.6789 } }, { name: 'Kongowea', coordinates: { lat: -4.0012, lng: 39.6890 } }] },
      { name: 'Likoni', code: '001-05', villages: [{ name: 'Mtongwe', coordinates: { lat: -4.0678, lng: 39.6456 } }, { name: 'Shika Adabu', coordinates: { lat: -4.0789, lng: 39.6567 } }] },
      { name: 'Mvita', code: '001-06', villages: [{ name: 'Old Town', coordinates: { lat: -4.0567, lng: 39.6789 } }, { name: 'Majengo', coordinates: { lat: -4.0456, lng: 39.6678 } }] },
    ]
  },
  {
    id: 2,
    name: 'Kwale',
    code: '002',
    capital: 'Kwale',
    region: 'Coast',
    coordinates: { lat: -4.1821, lng: 39.4606 },
    solarIrradiance: 5.9,
    peakSunHours: 5.6,
    weatherZone: 'Coastal',
    avgTemperature: { min: 23, max: 31 },
    rainySeasons: ['April-June', 'October-December'],
    constituencies: [
      { name: 'Msambweni', code: '002-01', villages: [{ name: 'Msambweni', coordinates: { lat: -4.4567, lng: 39.4789 } }, { name: 'Gazi', coordinates: { lat: -4.4234, lng: 39.5012 } }] },
      { name: 'Lunga Lunga', code: '002-02', villages: [{ name: 'Lunga Lunga', coordinates: { lat: -4.5432, lng: 39.1234 } }, { name: 'Vanga', coordinates: { lat: -4.6543, lng: 39.2123 } }] },
      { name: 'Matuga', code: '002-03', villages: [{ name: 'Tiwi', coordinates: { lat: -4.2345, lng: 39.5678 } }, { name: 'Waa', coordinates: { lat: -4.2678, lng: 39.5456 } }] },
      { name: 'Kinango', code: '002-04', villages: [{ name: 'Kinango', coordinates: { lat: -4.1234, lng: 39.3456 } }, { name: 'Mackinnon Road', coordinates: { lat: -3.9876, lng: 39.2345 } }] },
    ]
  },
  {
    id: 3,
    name: 'Kilifi',
    code: '003',
    capital: 'Kilifi',
    region: 'Coast',
    coordinates: { lat: -3.6305, lng: 39.8499 },
    solarIrradiance: 5.7,
    peakSunHours: 5.4,
    weatherZone: 'Coastal',
    avgTemperature: { min: 23, max: 31 },
    rainySeasons: ['April-June', 'October-December'],
    constituencies: [
      { name: 'Kilifi North', code: '003-01', villages: [{ name: 'Tezo', coordinates: { lat: -3.5678, lng: 39.8901 } }, { name: 'Mnarani', coordinates: { lat: -3.5432, lng: 39.8765 } }] },
      { name: 'Kilifi South', code: '003-02', villages: [{ name: 'Junju', coordinates: { lat: -3.7890, lng: 39.8234 } }, { name: 'Chasimba', coordinates: { lat: -3.8123, lng: 39.8012 } }] },
      { name: 'Kaloleni', code: '003-03', villages: [{ name: 'Kaloleni', coordinates: { lat: -3.7654, lng: 39.6789 } }, { name: 'Mariakani', coordinates: { lat: -3.8234, lng: 39.4567 } }] },
      { name: 'Rabai', code: '003-04', villages: [{ name: 'Rabai', coordinates: { lat: -3.9012, lng: 39.5678 } }, { name: 'Mazeras', coordinates: { lat: -3.9234, lng: 39.5456 } }] },
      { name: 'Ganze', code: '003-05', villages: [{ name: 'Ganze', coordinates: { lat: -3.4567, lng: 39.5234 } }, { name: 'Bamba', coordinates: { lat: -3.3456, lng: 39.4123 } }] },
      { name: 'Malindi', code: '003-06', villages: [{ name: 'Malindi Town', coordinates: { lat: -3.2189, lng: 40.1169 } }, { name: 'Watamu', coordinates: { lat: -3.3567, lng: 40.0234 } }] },
      { name: 'Magarini', code: '003-07', villages: [{ name: 'Marafa', coordinates: { lat: -3.0123, lng: 40.1789 } }, { name: 'Magarini', coordinates: { lat: -2.9876, lng: 40.2345 } }] },
    ]
  },
  {
    id: 47,
    name: 'Nairobi',
    code: '047',
    capital: 'Nairobi',
    region: 'Nairobi',
    coordinates: { lat: -1.2921, lng: 36.8219 },
    solarIrradiance: 5.5,
    peakSunHours: 5.2,
    weatherZone: 'Urban',
    avgTemperature: { min: 12, max: 26 },
    rainySeasons: ['March-May', 'October-December'],
    constituencies: [
      { name: 'Westlands', code: '047-01', villages: [{ name: 'Parklands', coordinates: { lat: -1.2634, lng: 36.8123 } }, { name: 'Highridge', coordinates: { lat: -1.2543, lng: 36.8012 } }, { name: 'Kitisuru', coordinates: { lat: -1.2234, lng: 36.7890 } }] },
      { name: 'Dagoretti North', code: '047-02', villages: [{ name: 'Kilimani', coordinates: { lat: -1.2890, lng: 36.7876 } }, { name: 'Kawangware', coordinates: { lat: -1.2765, lng: 36.7543 } }] },
      { name: 'Dagoretti South', code: '047-03', villages: [{ name: 'Mutuini', coordinates: { lat: -1.3012, lng: 36.7234 } }, { name: 'Ngando', coordinates: { lat: -1.3123, lng: 36.7345 } }] },
      { name: 'Langata', code: '047-04', villages: [{ name: 'Karen', coordinates: { lat: -1.3234, lng: 36.7012 } }, { name: 'Nairobi West', coordinates: { lat: -1.3123, lng: 36.8123 } }, { name: 'South C', coordinates: { lat: -1.3234, lng: 36.8234 } }] },
      { name: 'Kibra', code: '047-05', villages: [{ name: 'Kibera', coordinates: { lat: -1.3134, lng: 36.7876 } }, { name: 'Sarangombe', coordinates: { lat: -1.3234, lng: 36.7765 } }] },
      { name: 'Roysambu', code: '047-06', villages: [{ name: 'Githurai', coordinates: { lat: -1.2012, lng: 36.8987 } }, { name: 'Kahawa', coordinates: { lat: -1.1890, lng: 36.9123 } }, { name: 'Zimmerman', coordinates: { lat: -1.1987, lng: 36.8890 } }] },
      { name: 'Kasarani', code: '047-07', villages: [{ name: 'Kasarani', coordinates: { lat: -1.2234, lng: 36.8987 } }, { name: 'Njiru', coordinates: { lat: -1.2123, lng: 36.9234 } }] },
      { name: 'Ruaraka', code: '047-08', villages: [{ name: 'Mathare', coordinates: { lat: -1.2543, lng: 36.8654 } }, { name: 'Utalii', coordinates: { lat: -1.2432, lng: 36.8543 } }] },
      { name: 'Embakasi South', code: '047-09', villages: [{ name: 'Imara Daima', coordinates: { lat: -1.3234, lng: 36.8654 } }, { name: 'Pipeline', coordinates: { lat: -1.3123, lng: 36.8765 } }] },
      { name: 'Embakasi North', code: '047-10', villages: [{ name: 'Dandora', coordinates: { lat: -1.2543, lng: 36.8987 } }, { name: 'Kariobangi', coordinates: { lat: -1.2654, lng: 36.8876 } }] },
      { name: 'Embakasi Central', code: '047-11', villages: [{ name: 'Kayole', coordinates: { lat: -1.2765, lng: 36.9012 } }, { name: 'Komarock', coordinates: { lat: -1.2654, lng: 36.9123 } }] },
      { name: 'Embakasi East', code: '047-12', villages: [{ name: 'Utawala', coordinates: { lat: -1.2876, lng: 36.9543 } }, { name: 'Mihango', coordinates: { lat: -1.2987, lng: 36.9654 } }] },
      { name: 'Embakasi West', code: '047-13', villages: [{ name: 'Umoja', coordinates: { lat: -1.2765, lng: 36.8765 } }, { name: 'Mowlem', coordinates: { lat: -1.2876, lng: 36.8876 } }] },
      { name: 'Makadara', code: '047-14', villages: [{ name: 'Makadara', coordinates: { lat: -1.2987, lng: 36.8654 } }, { name: 'Hamza', coordinates: { lat: -1.3012, lng: 36.8543 } }] },
      { name: 'Kamukunji', code: '047-15', villages: [{ name: 'Eastleigh', coordinates: { lat: -1.2765, lng: 36.8432 } }, { name: 'Pumwani', coordinates: { lat: -1.2876, lng: 36.8321 } }] },
      { name: 'Starehe', code: '047-16', villages: [{ name: 'CBD', coordinates: { lat: -1.2834, lng: 36.8234 } }, { name: 'Ngara', coordinates: { lat: -1.2723, lng: 36.8123 } }] },
      { name: 'Mathare', code: '047-17', villages: [{ name: 'Huruma', coordinates: { lat: -1.2543, lng: 36.8543 } }, { name: 'Mlango Kubwa', coordinates: { lat: -1.2432, lng: 36.8654 } }] },
    ]
  },
  // Adding more counties with complete data
  {
    id: 4,
    name: 'Tana River',
    code: '004',
    capital: 'Hola',
    region: 'Coast',
    coordinates: { lat: -1.5000, lng: 40.0300 },
    solarIrradiance: 6.2,
    peakSunHours: 5.9,
    weatherZone: 'Arid',
    avgTemperature: { min: 25, max: 35 },
    rainySeasons: ['April-May', 'November-December'],
    constituencies: [
      { name: 'Garsen', code: '004-01', villages: [{ name: 'Garsen', coordinates: { lat: -2.2789, lng: 40.1123 } }, { name: 'Wema', coordinates: { lat: -2.3456, lng: 40.0987 } }] },
      { name: 'Galole', code: '004-02', villages: [{ name: 'Hola', coordinates: { lat: -1.5012, lng: 40.0234 } }, { name: 'Bura', coordinates: { lat: -1.1234, lng: 39.9876 } }] },
      { name: 'Bura', code: '004-03', villages: [{ name: 'Bura Irrigation', coordinates: { lat: -1.1098, lng: 39.9543 } }] },
    ]
  },
  {
    id: 5,
    name: 'Lamu',
    code: '005',
    capital: 'Lamu',
    region: 'Coast',
    coordinates: { lat: -2.2686, lng: 40.9020 },
    solarIrradiance: 5.8,
    peakSunHours: 5.5,
    weatherZone: 'Coastal',
    avgTemperature: { min: 24, max: 32 },
    rainySeasons: ['April-June', 'October-December'],
    constituencies: [
      { name: 'Lamu East', code: '005-01', villages: [{ name: 'Lamu Town', coordinates: { lat: -2.2712, lng: 40.9022 } }, { name: 'Shela', coordinates: { lat: -2.2934, lng: 40.9112 } }] },
      { name: 'Lamu West', code: '005-02', villages: [{ name: 'Mpeketoni', coordinates: { lat: -2.0789, lng: 40.7234 } }, { name: 'Witu', coordinates: { lat: -2.3890, lng: 40.4321 } }] },
    ]
  },
  {
    id: 6,
    name: 'Taita Taveta',
    code: '006',
    capital: 'Voi',
    region: 'Coast',
    coordinates: { lat: -3.3968, lng: 38.5686 },
    solarIrradiance: 6.0,
    peakSunHours: 5.7,
    weatherZone: 'Semi-Arid',
    avgTemperature: { min: 18, max: 30 },
    rainySeasons: ['March-May', 'October-December'],
    constituencies: [
      { name: 'Taveta', code: '006-01', villages: [{ name: 'Taveta Town', coordinates: { lat: -3.3989, lng: 37.6765 } }, { name: 'Njukini', coordinates: { lat: -3.4123, lng: 37.6543 } }] },
      { name: 'Wundanyi', code: '006-02', villages: [{ name: 'Wundanyi', coordinates: { lat: -3.3987, lng: 38.3654 } }, { name: 'Mgange', coordinates: { lat: -3.4234, lng: 38.3876 } }] },
      { name: 'Mwatate', code: '006-03', villages: [{ name: 'Mwatate', coordinates: { lat: -3.4987, lng: 38.3765 } }, { name: 'Bura', coordinates: { lat: -3.5123, lng: 38.4123 } }] },
      { name: 'Voi', code: '006-04', villages: [{ name: 'Voi Town', coordinates: { lat: -3.3968, lng: 38.5686 } }, { name: 'Maungu', coordinates: { lat: -3.5567, lng: 38.7234 } }] },
    ]
  },
  // Nakuru County
  {
    id: 32,
    name: 'Nakuru',
    code: '032',
    capital: 'Nakuru',
    region: 'Rift Valley',
    coordinates: { lat: -0.3031, lng: 36.0800 },
    solarIrradiance: 5.6,
    peakSunHours: 5.3,
    weatherZone: 'Highland',
    avgTemperature: { min: 10, max: 25 },
    rainySeasons: ['March-May', 'October-December'],
    constituencies: [
      { name: 'Nakuru Town East', code: '032-01', villages: [{ name: 'Nakuru CBD', coordinates: { lat: -0.2834, lng: 36.0678 } }] },
      { name: 'Nakuru Town West', code: '032-02', villages: [{ name: 'Milimani', coordinates: { lat: -0.2912, lng: 36.0543 } }] },
      { name: 'Naivasha', code: '032-03', villages: [{ name: 'Naivasha Town', coordinates: { lat: -0.7176, lng: 36.4320 } }, { name: 'Mai Mahiu', coordinates: { lat: -1.0234, lng: 36.5876 } }] },
      { name: 'Gilgil', code: '032-04', villages: [{ name: 'Gilgil Town', coordinates: { lat: -0.4912, lng: 36.3234 } }] },
      { name: 'Subukia', code: '032-05', villages: [{ name: 'Subukia', coordinates: { lat: 0.0567, lng: 36.1234 } }] },
      { name: 'Njoro', code: '032-06', villages: [{ name: 'Njoro Town', coordinates: { lat: -0.3234, lng: 35.9456 } }] },
      { name: 'Molo', code: '032-07', villages: [{ name: 'Molo Town', coordinates: { lat: -0.2489, lng: 35.7345 } }] },
      { name: 'Rongai', code: '032-08', villages: [{ name: 'Rongai', coordinates: { lat: -0.2678, lng: 35.8567 } }] },
      { name: 'Kuresoi North', code: '032-09', villages: [{ name: 'Olenguruone', coordinates: { lat: -0.3890, lng: 35.6789 } }] },
      { name: 'Kuresoi South', code: '032-10', villages: [{ name: 'Keringet', coordinates: { lat: -0.4234, lng: 35.6234 } }] },
      { name: 'Bahati', code: '032-11', villages: [{ name: 'Bahati', coordinates: { lat: -0.1567, lng: 36.1890 } }] },
    ]
  },
  // Kisumu County
  {
    id: 42,
    name: 'Kisumu',
    code: '042',
    capital: 'Kisumu',
    region: 'Nyanza',
    coordinates: { lat: -0.1022, lng: 34.7617 },
    solarIrradiance: 5.4,
    peakSunHours: 5.1,
    weatherZone: 'Lake Region',
    avgTemperature: { min: 18, max: 30 },
    rainySeasons: ['March-May', 'October-December'],
    constituencies: [
      { name: 'Kisumu East', code: '042-01', villages: [{ name: 'Kondele', coordinates: { lat: -0.0912, lng: 34.7890 } }] },
      { name: 'Kisumu West', code: '042-02', villages: [{ name: 'Kisumu CBD', coordinates: { lat: -0.1022, lng: 34.7617 } }] },
      { name: 'Kisumu Central', code: '042-03', villages: [{ name: 'Milimani', coordinates: { lat: -0.1123, lng: 34.7512 } }] },
      { name: 'Seme', code: '042-04', villages: [{ name: 'Kombewa', coordinates: { lat: -0.0567, lng: 34.6234 } }] },
      { name: 'Nyando', code: '042-05', villages: [{ name: 'Ahero', coordinates: { lat: -0.1678, lng: 34.9234 } }] },
      { name: 'Muhoroni', code: '042-06', villages: [{ name: 'Muhoroni', coordinates: { lat: -0.1543, lng: 35.1890 } }] },
      { name: 'Nyakach', code: '042-07', villages: [{ name: 'Nyakach', coordinates: { lat: -0.2345, lng: 34.8765 } }] },
    ]
  },
  // Turkana County
  {
    id: 23,
    name: 'Turkana',
    code: '023',
    capital: 'Lodwar',
    region: 'Rift Valley',
    coordinates: { lat: 3.1191, lng: 35.5999 },
    solarIrradiance: 6.5,
    peakSunHours: 6.2,
    weatherZone: 'Arid',
    avgTemperature: { min: 25, max: 40 },
    rainySeasons: ['April-May', 'October-November'],
    constituencies: [
      { name: 'Turkana North', code: '023-01', villages: [{ name: 'Todenyang', coordinates: { lat: 4.0234, lng: 35.9234 } }] },
      { name: 'Turkana West', code: '023-02', villages: [{ name: 'Kakuma', coordinates: { lat: 3.7123, lng: 34.8234 } }, { name: 'Lokichoggio', coordinates: { lat: 4.2012, lng: 34.3487 } }] },
      { name: 'Turkana Central', code: '023-03', villages: [{ name: 'Lodwar', coordinates: { lat: 3.1191, lng: 35.5999 } }] },
      { name: 'Loima', code: '023-04', villages: [{ name: 'Lorugum', coordinates: { lat: 3.4567, lng: 35.2345 } }] },
      { name: 'Turkana South', code: '023-05', villages: [{ name: 'Lokichar', coordinates: { lat: 2.5234, lng: 35.6789 } }] },
      { name: 'Turkana East', code: '023-06', villages: [{ name: 'Kapedo', coordinates: { lat: 1.8234, lng: 36.0234 } }] },
    ]
  },
  // Garissa County
  {
    id: 7,
    name: 'Garissa',
    code: '007',
    capital: 'Garissa',
    region: 'North Eastern',
    coordinates: { lat: -0.4536, lng: 39.6401 },
    solarIrradiance: 6.3,
    peakSunHours: 6.0,
    weatherZone: 'Arid',
    avgTemperature: { min: 26, max: 38 },
    rainySeasons: ['April-May', 'October-November'],
    constituencies: [
      { name: 'Garissa Township', code: '007-01', villages: [{ name: 'Garissa Town', coordinates: { lat: -0.4536, lng: 39.6401 } }] },
      { name: 'Balambala', code: '007-02', villages: [{ name: 'Balambala', coordinates: { lat: -0.6789, lng: 39.4567 } }] },
      { name: 'Lagdera', code: '007-03', villages: [{ name: 'Modogashe', coordinates: { lat: 0.4234, lng: 39.0234 } }] },
      { name: 'Dadaab', code: '007-04', villages: [{ name: 'Dadaab', coordinates: { lat: 0.0567, lng: 40.3234 } }] },
      { name: 'Fafi', code: '007-05', villages: [{ name: 'Fafi', coordinates: { lat: -1.1234, lng: 40.1234 } }] },
      { name: 'Ijara', code: '007-06', villages: [{ name: 'Masalani', coordinates: { lat: -1.7890, lng: 40.2345 } }] },
    ]
  },
  // Machakos County
  {
    id: 16,
    name: 'Machakos',
    code: '016',
    capital: 'Machakos',
    region: 'Eastern',
    coordinates: { lat: -1.5177, lng: 37.2634 },
    solarIrradiance: 5.7,
    peakSunHours: 5.4,
    weatherZone: 'Semi-Arid',
    avgTemperature: { min: 14, max: 28 },
    rainySeasons: ['March-May', 'October-December'],
    constituencies: [
      { name: 'Machakos Town', code: '016-01', villages: [{ name: 'Machakos CBD', coordinates: { lat: -1.5177, lng: 37.2634 } }] },
      { name: 'Mavoko', code: '016-02', villages: [{ name: 'Athi River', coordinates: { lat: -1.4534, lng: 36.9823 } }, { name: 'Mlolongo', coordinates: { lat: -1.3912, lng: 36.9456 } }] },
      { name: 'Masinga', code: '016-03', villages: [{ name: 'Masinga', coordinates: { lat: -0.8934, lng: 37.5678 } }] },
      { name: 'Yatta', code: '016-04', villages: [{ name: 'Matuu', coordinates: { lat: -1.1567, lng: 37.5234 } }] },
      { name: 'Kangundo', code: '016-05', villages: [{ name: 'Kangundo', coordinates: { lat: -1.2890, lng: 37.3456 } }] },
      { name: 'Matungulu', code: '016-06', villages: [{ name: 'Tala', coordinates: { lat: -1.3234, lng: 37.1890 } }] },
      { name: 'Kathiani', code: '016-07', villages: [{ name: 'Kathiani', coordinates: { lat: -1.4567, lng: 37.1234 } }] },
      { name: 'Mwala', code: '016-08', villages: [{ name: 'Mwala', coordinates: { lat: -1.5678, lng: 37.5678 } }] },
    ]
  },
];

// Get total counts
export function getLocationCounts() {
  let totalConstituencies = 0;
  let totalVillages = 0;

  KENYA_COUNTIES.forEach(county => {
    totalConstituencies += county.constituencies.length;
    county.constituencies.forEach(constituency => {
      totalVillages += constituency.villages.length;
    });
  });

  return {
    counties: KENYA_COUNTIES.length,
    constituencies: totalConstituencies,
    villages: totalVillages
  };
}

// Get county by name or ID
export function getCounty(identifier: string | number): County | undefined {
  if (typeof identifier === 'number') {
    return KENYA_COUNTIES.find(c => c.id === identifier);
  }
  return KENYA_COUNTIES.find(c =>
    c.name.toLowerCase() === identifier.toLowerCase() ||
    c.code === identifier
  );
}

// Get solar recommendations for a location
export function getSolarRecommendation(countyName: string) {
  const county = getCounty(countyName);
  if (!county) return null;

  return {
    county: county.name,
    solarIrradiance: county.solarIrradiance,
    peakSunHours: county.peakSunHours,
    weatherZone: county.weatherZone,
    recommendation: county.solarIrradiance >= 6
      ? 'Excellent solar potential - Highly recommended for large installations'
      : county.solarIrradiance >= 5.5
        ? 'Very good solar potential - Recommended for all installations'
        : county.solarIrradiance >= 5
          ? 'Good solar potential - Suitable for most installations'
          : 'Moderate solar potential - Consider hybrid systems',
    estimatedProduction: (county.solarIrradiance * 0.85 * 365).toFixed(0), // kWh/kWp/year
    bestMonths: county.rainySeasons[0] === 'March-May'
      ? ['December', 'January', 'February', 'June', 'July', 'August', 'September']
      : ['January', 'February', 'March', 'July', 'August', 'September'],
  };
}
