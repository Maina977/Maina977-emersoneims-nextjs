# Generator Oracle Professional Diagnostic System

## Technical Capabilities Documentation

**Document Date:** March 2026
**System Version:** Generator Oracle v3.0
**Developer:** EmersonEIMS

---

## SYSTEM OVERVIEW

Generator Oracle is a **universal generator diagnostic platform** providing direct hardware communication with Engine Control Modules (ECMs) across multiple equipment manufacturers. Unlike single-brand proprietary tools, Generator Oracle supports 10+ controller brands through standardized industrial protocols.

---

## GENERATOR ORACLE CORE CAPABILITIES

### Direct ECM Hardware Communication

| Capability | Generator Oracle Implementation | Protocol Used |
|------------|--------------------------------|---------------|
| **Live Engine Data** | Real-time streaming at 1-20 Hz | J1939, CAN, Modbus |
| **Diagnostic Code Reading** | Direct ECM memory access | J1939 DM1/DM2/DM6 |
| **Diagnostic Code Clearing** | Hardware-level reset commands | J1939 DM3/DM11 |
| **Component Testing** | Direct actuator control | UDS, J1939 commands |
| **Parameter Reading** | ECM configuration access | SPN/PGN protocol |
| **Security Authentication** | Seed/key challenge response | ISO 14229 |

---

## DIAGNOSTIC CAPABILITIES

### 1. DIAGNOSTIC TROUBLE CODE MANAGEMENT

**Generator Oracle Features:**
- **Direct ECM Code Reading** via standardized J1939 diagnostic messages
- **Hardware-Level Code Clearing** using industry-standard reset commands
- **Comprehensive Code Database** - 400,000+ codes across all supported brands
- **Real-Time Fault Monitoring** - Active, Pending, and Historical codes
- **Snapshot Data Capture** - Engine parameters at time of fault
- **Cross-Reference System** - SPN/FMI to manufacturer-specific codes
- **Guided Troubleshooting** - Step-by-step repair procedures
- **Parts Integration** - OEM part numbers with internal ordering

**Supported Controller Brands:**
- DSE (DeepSea Electronics) - All series
- ComAp - InteliLite, InteliGen, InteliSys
- SmartGen - HGM6100 through HGM9500
- Woodward - EasyGen series
- PowerWizard controllers
- DATAKOM - DKG and D-series
- Lovato Electric - RGK, ATL series
- Siemens - Industrial controllers
- ENKO - GCU, AMF, SYNC series
- Volvo Penta controllers

---

### 2. REAL-TIME ENGINE MONITORING

**Generator Oracle Data Streaming:**
- **Direct Protocol Connection** via USB-CAN or Bluetooth adapters
- **Multi-Protocol Support:**
  - J1939 (Heavy-duty diesel standard)
  - CAN Bus 2.0A/2.0B
  - Modbus RTU and TCP/IP
  - ISO 15765 diagnostic protocol
  - Unified Diagnostic Services (UDS)

**Live Parameters Monitored:**
| Parameter | SPN | Unit | Update Rate |
|-----------|-----|------|-------------|
| Engine Speed | 190 | RPM | 20 Hz |
| Coolant Temperature | 110 | °C | 5 Hz |
| Oil Pressure | 100 | kPa | 10 Hz |
| Fuel Consumption | 183 | L/hr | 5 Hz |
| Battery Voltage | 168 | V | 5 Hz |
| Boost Pressure | 102 | kPa | 10 Hz |
| Exhaust Temperature | 173 | °C | 5 Hz |
| Engine Load | 92 | % | 10 Hz |
| Intake Manifold Temp | 105 | °C | 5 Hz |
| Fuel Pressure | 94 | kPa | 10 Hz |

**Display Features:**
- Visual gauge clusters with threshold warnings
- Real-time trend graphs
- Data logging with timestamps
- Snapshot capture on fault events
- Export to CSV/PDF formats

---

### 3. COMPONENT ACTUATION TESTING

**Generator Oracle Active Test Capabilities:**

| Test Type | Components | Method |
|-----------|------------|--------|
| **Cylinder Balance Test** | Individual injectors | Sequential cut-out |
| **Glow System Test** | Glow plugs/grid heater | Timed activation |
| **Fuel System Test** | Lift pump, transfer pump | On/off actuation |
| **Cooling System Test** | Electric fans, water pump | Cycle testing |
| **Electrical Tests** | Relays, solenoids | Output forcing |
| **Governor Test** | Speed control actuator | Ramp testing |

**Safety Features:**
- Engine state verification before test execution
- Automatic timeout protection
- Security access verification
- Clear safety warnings displayed
- Test result logging

---

### 4. ECM CONFIGURATION ACCESS

**Parameter Reading:**
- Direct access to ECM stored parameters
- Default value reference
- Acceptable range documentation
- Parameter descriptions and functions

**Configuration Backup:**
- ECM configuration snapshot
- Parameter export capability
- Configuration comparison tools

**Note:** Parameter writing is limited to non-emission parameters in accordance with environmental regulations. Factory-level security access requires manufacturer authorization.

---

### 5. SERVICE DOCUMENTATION

**Integrated Reference System:**
- Maintenance interval tracking
- Service procedure guides
- Controller navigation instructions
- Password/PIN references by brand
- Wiring diagram integration

---

## 10 PROFESSIONAL DIAGNOSTIC INTERFACES

Generator Oracle includes 10 specialized diagnostic interfaces, each optimized for specific equipment types. **All interfaces share the same real hardware communication system:**

| Interface | Code | Target Equipment | Protocols |
|-----------|------|------------------|-----------|
| **Heavy Equipment Diagnostic Suite** | HEDS | Heavy machinery, industrial | J1939, CAN |
| **Marine Engine Diagnostic System** | MEDS | Marine, industrial engines | J1939, Modbus |
| **Industrial Engine Analyzer** | IEA | Power generation, industrial | J1939, CAN |
| **Controller Configuration Suite** | CCS | Generator controllers | Modbus, CAN |
| **Intelligent Controller Interface** | ICI | Smart controllers | CAN, Modbus |
| **Precision Governor Diagnostic** | PGD | Speed control systems | J1939, CAN |
| **Engine Service Terminal** | EST | Engine service/repair | J1939, UDS |
| **Agricultural Power Diagnostic** | APD | Agricultural equipment | J1939, CAN |
| **High-Power Engine Analyzer** | HPEA | Large diesel engines | J1939, CAN |
| **Standby Power Diagnostic** | SPD | Standby generators | CAN, Modbus |

**Each Interface Provides:**
- Direct ECM communication (not simulation)
- Real-time data streaming
- Diagnostic code read/clear
- Component actuation tests
- Parameter access
- Guided troubleshooting
- Parts ordering integration

---

## HARDWARE REQUIREMENTS

### Supported Adapters

| Adapter Type | Connection | Protocols | Use Case |
|--------------|------------|-----------|----------|
| **USB-CAN Adapter** | USB Serial | J1939, CAN | Primary diagnostic |
| **Bluetooth CAN** | Wireless BLE | J1939, CAN | Mobile diagnostics |
| **USB-Modbus** | USB Serial | Modbus RTU | Controller config |
| **Ethernet Gateway** | TCP/IP | Modbus TCP | Remote diagnostics |

**Browser Requirements:**
- Chrome 89+ or Edge 89+ (for Web Serial API)
- Bluetooth-enabled device (for wireless adapters)
- HTTPS connection required for hardware access

---

## PROTOCOL SPECIFICATIONS

### J1939 Implementation

Generator Oracle implements SAE J1939 standard messaging:

| Message Type | PGN | Function |
|--------------|-----|----------|
| Engine Controller 1 | 61444 | Speed, torque, mode |
| Engine Temperature | 65262 | Coolant, oil, fuel temps |
| Fluid Level/Pressure | 65263 | Oil, fuel, coolant pressure |
| Active Diagnostics | 65226 | Current fault codes (DM1) |
| Previous Diagnostics | 65227 | Historical faults (DM2) |
| Pending Diagnostics | 65231 | Pending faults (DM6) |
| Clear Diagnostics | 65235 | Code clearing (DM11) |
| Vehicle ID | 65260 | ECM identification |

### Failure Mode Identifiers (FMI)

| FMI | Description |
|-----|-------------|
| 0 | Data above normal - severe |
| 1 | Data below normal - severe |
| 2 | Erratic or incorrect data |
| 3 | Voltage above normal |
| 4 | Voltage below normal |
| 5 | Current below normal |
| 6 | Current above normal |
| 7 | Mechanical not responding |
| 11 | Root cause unknown |
| 31 | Condition exists |

---

## COMPETITIVE ADVANTAGES

### Multi-Brand Universal Support
- Single platform for 10+ equipment brands
- Standardized interface across all brands
- No need for multiple proprietary tools

### Cost Efficiency
- Subscription model: $49-299/year
- Uses standard off-the-shelf adapters
- No proprietary hardware lock-in

### Accessibility
- Web-based platform (PWA)
- Works offline after initial load
- Mobile and desktop compatible
- No software installation required

### Comprehensive Database
- 400,000+ diagnostic codes
- OEM part number cross-reference
- Repair cost estimation
- Internal parts ordering

---

## TECHNICAL LIMITATIONS

### Operations Requiring Manufacturer Files
- ECM firmware updates
- Calibration file programming
- Injector trim code writing
- Emission-related parameter changes

These operations require proprietary manufacturer files and higher security access levels, consistent with environmental regulations and manufacturer licensing requirements.

---

## SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                  Generator Oracle Platform               │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ 10 Diag     │  │ 400K+ Code  │  │ AI Analysis │     │
│  │ Interfaces  │  │ Database    │  │ Engine      │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│  ┌──────┴────────────────┴────────────────┴──────┐     │
│  │         ECM Communication Service              │     │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐         │     │
│  │  │ J1939   │ │ CAN Bus │ │ Modbus  │         │     │
│  │  │ Protocol│ │ Protocol│ │ Protocol│         │     │
│  │  └────┬────┘ └────┬────┘ └────┬────┘         │     │
│  └───────┼───────────┼───────────┼───────────────┘     │
│          │           │           │                      │
├──────────┼───────────┼───────────┼──────────────────────┤
│   ┌──────┴───────────┴───────────┴──────┐              │
│   │      Hardware Adapter Layer          │              │
│   │  Web Serial │ Bluetooth │ WebUSB    │              │
│   └──────────────────┬───────────────────┘              │
└──────────────────────┼──────────────────────────────────┘
                       │
              ┌────────┴────────┐
              │  USB-CAN/BT     │
              │  Adapter        │
              └────────┬────────┘
                       │
              ┌────────┴────────┐
              │  Engine ECM     │
              │  (J1939/CAN)    │
              └─────────────────┘
```

---

## CONCLUSION

Generator Oracle provides **direct ECM hardware communication** through standardized industrial protocols. The platform delivers:

- **Universal Compatibility** - 10+ equipment brands with single tool
- **Direct Hardware Access** - Real ECM communication, not simulation
- **Comprehensive Diagnostics** - Code read/clear, live data, active tests
- **Cost Efficiency** - 95% lower cost than single-brand proprietary tools
- **Accessibility** - Web-based, works on any modern browser

Generator Oracle is designed and developed by EmersonEIMS as an independent diagnostic platform utilizing open industry standards (SAE J1939, CAN Bus, Modbus) for universal equipment compatibility.

---

*Generator Oracle Professional Diagnostic System*
*Developed by EmersonEIMS*
*© 2026 EmersonEIMS. All Rights Reserved.*
