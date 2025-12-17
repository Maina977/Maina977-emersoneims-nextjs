(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/diagnostics/MetalBezel.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MetalBezel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function MetalBezel({ children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `metal-bezel ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/components/diagnostics/MetalBezel.jsx",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
_c = MetalBezel;
var _c;
__turbopack_context__.k.register(_c, "MetalBezel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/diagnostics/NineInOneCalculator.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NineInOneCalculator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$diagnostics$2f$MetalBezel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/diagnostics/MetalBezel.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const SERVICES = [
    'Solar Systems',
    'Diesel Generators',
    'Controls',
    'AC & UPS',
    'Automation',
    'Pumps',
    'Incinerators',
    'Motors/Rewinding',
    'Diagnostics Hub'
];
function NineInOneCalculator() {
    _s();
    const [service, setService] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(SERVICES[0]);
    const [fields, setFields] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const cfg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "NineInOneCalculator.useMemo[cfg]": ()=>getServiceConfig(service)
    }["NineInOneCalculator.useMemo[cfg]"], [
        service
    ]);
    const onChange = (name, value)=>{
        setFields((p)=>({
                ...p,
                [name]: value
            }));
    };
    const validate = ()=>{
        const e = {};
        cfg.inputs.forEach((inp)=>{
            const v = Number(fields[inp.name]);
            if (inp.required && (isNaN(v) || v === null)) e[inp.name] = 'Required';
            if (inp.min !== undefined && v < inp.min) e[inp.name] = `>= ${inp.min}`;
            if (inp.max !== undefined && v > inp.max) e[inp.name] = `<= ${inp.max}`;
        });
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const compute = ()=>{
        if (!validate()) return;
        const out = cfg.compute(fields);
        setResult(out);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$diagnostics$2f$MetalBezel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        title: "9‑in‑1 Engineering Calculator",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-sm font-bold text-gray-300",
                            children: "SERVICE MODE"
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-2",
                            children: SERVICES.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setService(s);
                                        setFields({});
                                        setResult(null);
                                        setErrors({});
                                    },
                                    className: `px-3 py-2 text-left rounded border-2 font-mono ${service === s ? 'bg-green-700 border-green-500 text-white' : 'bg-gray-800 border-gray-600 text-green-300'}`,
                                    children: s
                                }, s, false, {
                                    fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                                    lineNumber: 56,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-sm font-bold text-gray-300 mb-2",
                            children: "INPUTS"
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                            children: cfg.inputs.map((inp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs text-gray-400 mb-1 font-mono",
                                            children: [
                                                inp.label,
                                                " ",
                                                inp.unit ? `(${inp.unit})` : ''
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                                            lineNumber: 82,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            step: "any",
                                            value: fields[inp.name] ?? '',
                                            onChange: (e)=>onChange(inp.name, e.target.value),
                                            placeholder: inp.placeholder ?? '',
                                            className: `w-full px-3 py-2 bg-black border ${errors[inp.name] ? 'border-red-500' : 'border-gray-600'} rounded text-green-300 font-mono`
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                                            lineNumber: 85,
                                            columnNumber: 17
                                        }, this),
                                        errors[inp.name] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-red-400 text-xs mt-1 font-mono",
                                            children: errors[inp.name]
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                                            lineNumber: 96,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, inp.name, true, {
                                    fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 flex items-center gap-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: compute,
                                className: "px-4 py-2 bg-blue-600 text-white rounded border-2 border-blue-400 font-mono",
                                children: "COMPUTE"
                            }, void 0, false, {
                                fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 p-3 bg-black border border-green-500 rounded font-mono text-green-300",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "text-sm font-bold mb-2",
                                    children: "OUTPUTS"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                                    lineNumber: 115,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-2",
                                    children: Object.entries(result).map(([k, v])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-400",
                                                    children: k
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                                                    lineNumber: 119,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold",
                                                    children: formatValue(v)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                                                    lineNumber: 120,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, k, true, {
                                            fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                                            lineNumber: 118,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                                    lineNumber: 116,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                            lineNumber: 114,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
            lineNumber: 50,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/diagnostics/NineInOneCalculator.jsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(NineInOneCalculator, "mFV64FWpAbPcZX2C5ESLDl3GCRQ=");
_c = NineInOneCalculator;
function formatValue(v) {
    if (typeof v === 'number' && !Number.isInteger(v)) return v.toFixed(3);
    return String(v);
}
/* ----- Per-service configuration ----- */ function getServiceConfig(service) {
    switch(service){
        case 'Solar Systems':
            return {
                inputs: [
                    {
                        name: 'panels',
                        label: 'Number of panels',
                        min: 1,
                        required: true
                    },
                    {
                        name: 'panelW',
                        label: 'Panel wattage',
                        unit: 'W',
                        min: 50,
                        required: true
                    },
                    {
                        name: 'psh',
                        label: 'Peak sun hours',
                        unit: 'h/day',
                        min: 1,
                        max: 9,
                        required: true
                    },
                    {
                        name: 'eff',
                        label: 'System efficiency',
                        unit: '',
                        min: 0.6,
                        max: 1,
                        placeholder: '0.8',
                        required: true
                    },
                    {
                        name: 'autonomy',
                        label: 'Autonomy days',
                        unit: 'days',
                        min: 0,
                        placeholder: '1',
                        required: true
                    },
                    {
                        name: 'vdc',
                        label: 'Battery/system voltage',
                        unit: 'V',
                        min: 12,
                        required: true
                    },
                    {
                        name: 'dod',
                        label: 'Depth of discharge',
                        unit: '',
                        min: 0.2,
                        max: 0.9,
                        placeholder: '0.5',
                        required: true
                    },
                    {
                        name: 'peakLoad',
                        label: 'Peak load',
                        unit: 'W',
                        min: 100,
                        required: true
                    },
                    {
                        name: 'sf',
                        label: 'Safety factor',
                        unit: '',
                        min: 1.1,
                        max: 1.5,
                        placeholder: '1.25',
                        required: true
                    }
                ],
                compute: (f)=>{
                    const Parray = Number(f.panels) * Number(f.panelW);
                    const Edaily = Parray * Number(f.psh) * Number(f.eff);
                    const C_Ah = Edaily * Number(f.autonomy) / (Number(f.vdc) * Number(f.dod));
                    const Pinv = Number(f.peakLoad) * Number(f.sf);
                    return {
                        'Array power (W)': Parray,
                        'Daily energy (Wh/day)': Edaily,
                        'Battery capacity (Ah)': C_Ah,
                        'Inverter size (W)': Pinv
                    };
                }
            };
        case 'Diesel Generators':
            return {
                inputs: [
                    {
                        name: 'pload',
                        label: 'Load',
                        unit: 'kW',
                        min: 1,
                        required: true
                    },
                    {
                        name: 'prated',
                        label: 'Generator rated power',
                        unit: 'kW',
                        min: 1,
                        required: true
                    },
                    {
                        name: 'alpha',
                        label: 'Fuel slope',
                        unit: 'L/kWh',
                        min: 0.15,
                        max: 0.35,
                        placeholder: '0.25',
                        required: true
                    },
                    {
                        name: 'beta',
                        label: 'Idle offset',
                        unit: 'L/h',
                        min: 0,
                        placeholder: '0',
                        required: true
                    },
                    {
                        name: 'fuelVol',
                        label: 'Fuel volume',
                        unit: 'L',
                        min: 0,
                        placeholder: '100',
                        required: true
                    }
                ],
                compute: (f)=>{
                    const LF = Number(f.pload) / Number(f.prated);
                    const F = Number(f.alpha) * Number(f.pload) + Number(f.beta);
                    const t = F > 0 ? Number(f.fuelVol) / F : 0;
                    return {
                        'Load factor (ratio)': LF,
                        'Fuel consumption (L/h)': F,
                        'Runtime (h)': t
                    };
                }
            };
        case 'Controls':
            return {
                inputs: [
                    {
                        name: 'alarms',
                        label: 'Alarms observed',
                        min: 0,
                        required: true
                    },
                    {
                        name: 'timeH',
                        label: 'Observation time',
                        unit: 'h',
                        min: 0.1,
                        required: true
                    },
                    {
                        name: 'startsOK',
                        label: 'Successful starts',
                        min: 0,
                        required: true
                    },
                    {
                        name: 'startsTot',
                        label: 'Total starts',
                        min: 1,
                        required: true
                    }
                ],
                compute: (f)=>{
                    const lambda = Number(f.alarms) / Number(f.timeH);
                    const mtbf = lambda > 0 ? 1 / lambda : Infinity;
                    const ssr = Number(f.startsOK) / Number(f.startsTot);
                    return {
                        'Alarm rate (per h)': lambda,
                        'MTBF (h)': mtbf,
                        'Start success ratio': ssr
                    };
                }
            };
        case 'AC & UPS':
            return {
                inputs: [
                    {
                        name: 'vbat',
                        label: 'Battery bus voltage',
                        unit: 'V',
                        min: 12,
                        required: true
                    },
                    {
                        name: 'capAh',
                        label: 'Battery capacity',
                        unit: 'Ah',
                        min: 1,
                        required: true
                    },
                    {
                        name: 'eff',
                        label: 'Inverter efficiency',
                        unit: '',
                        min: 0.7,
                        max: 1,
                        placeholder: '0.9',
                        required: true
                    },
                    {
                        name: 'pload',
                        label: 'Load',
                        unit: 'W',
                        min: 10,
                        required: true
                    },
                    {
                        name: 'pf',
                        label: 'Power factor',
                        unit: '',
                        min: 0.5,
                        max: 1,
                        placeholder: '0.9',
                        required: true
                    }
                ],
                compute: (f)=>{
                    const Ein = Number(f.vbat) * Number(f.capAh);
                    const tmin = Ein * Number(f.eff) / Number(f.pload) * 60;
                    const S = Number(f.pload) / Number(f.pf);
                    return {
                        'UPS runtime (min)': tmin,
                        'Apparent power (VA)': S
                    };
                }
            };
        case 'Automation':
            return {
                inputs: [
                    {
                        name: 't1',
                        label: 'Step 1 time',
                        unit: 's',
                        min: 0,
                        required: true
                    },
                    {
                        name: 't2',
                        label: 'Step 2 time',
                        unit: 's',
                        min: 0,
                        required: true
                    },
                    {
                        name: 't3',
                        label: 'Step 3 time',
                        unit: 's',
                        min: 0,
                        required: true
                    },
                    {
                        name: 'busy',
                        label: 'Busy time per cycle',
                        unit: 's',
                        min: 0,
                        required: true
                    }
                ],
                compute: (f)=>{
                    const Tcycle = Number(f.t1) + Number(f.t2) + Number(f.t3);
                    const Q = Tcycle > 0 ? 3600 / Tcycle : 0;
                    const U = Tcycle > 0 ? Number(f.busy) / Tcycle : 0;
                    return {
                        'Cycle time (s)': Tcycle,
                        'Throughput (units/h)': Q,
                        'Utilization (ratio)': U
                    };
                }
            };
        case 'Pumps':
            return {
                inputs: [
                    {
                        name: 'rho',
                        label: 'Fluid density',
                        unit: 'kg/m3',
                        min: 200,
                        max: 2000,
                        placeholder: '1000',
                        required: true
                    },
                    {
                        name: 'g',
                        label: 'Gravity',
                        unit: 'm/s2',
                        min: 9.7,
                        max: 9.9,
                        placeholder: '9.81',
                        required: true
                    },
                    {
                        name: 'Q',
                        label: 'Flow',
                        unit: 'm3/s',
                        min: 0.0001,
                        required: true
                    },
                    {
                        name: 'H',
                        label: 'Head',
                        unit: 'm',
                        min: 0.5,
                        required: true
                    },
                    {
                        name: 'eta',
                        label: 'Efficiency',
                        unit: '',
                        min: 0.4,
                        max: 1,
                        placeholder: '0.75',
                        required: true
                    }
                ],
                compute: (f)=>{
                    const Ph = Number(f.rho) * Number(f.g) * Number(f.Q) * Number(f.H);
                    const Pm = Ph / Number(f.eta);
                    return {
                        'Hydraulic power (W)': Ph,
                        'Motor power (W)': Pm
                    };
                }
            };
        case 'Incinerators':
            return {
                inputs: [
                    {
                        name: 'mass',
                        label: 'Waste mass',
                        unit: 'kg',
                        min: 1,
                        required: true
                    },
                    {
                        name: 'lhv',
                        label: 'Waste LHV',
                        unit: 'MJ/kg',
                        min: 5,
                        max: 25,
                        placeholder: '10',
                        required: true
                    },
                    {
                        name: 'eff',
                        label: 'System efficiency',
                        unit: '',
                        min: 0.3,
                        max: 0.9,
                        placeholder: '0.7',
                        required: true
                    },
                    {
                        name: 'fuelLHV',
                        label: 'Fuel LHV',
                        unit: 'MJ/Nm3',
                        min: 30,
                        max: 45,
                        placeholder: '35',
                        required: true
                    }
                ],
                compute: (f)=>{
                    const E = Number(f.mass) * Number(f.lhv) / Number(f.eff);
                    const flow = E / Number(f.fuelLHV);
                    return {
                        'Thermal energy (MJ)': E,
                        'Fuel gas flow (Nm3)': flow
                    };
                }
            };
        case 'Motors/Rewinding':
            return {
                inputs: [
                    {
                        name: 'pout',
                        label: 'Shaft power',
                        unit: 'kW',
                        min: 0.1,
                        required: true
                    },
                    {
                        name: 'eff',
                        label: 'Efficiency',
                        unit: '',
                        min: 0.6,
                        max: 1,
                        placeholder: '0.9',
                        required: true
                    },
                    {
                        name: 'V',
                        label: 'Line voltage',
                        unit: 'V',
                        min: 200,
                        required: true
                    },
                    {
                        name: 'pf',
                        label: 'Power factor',
                        unit: '',
                        min: 0.5,
                        max: 1,
                        placeholder: '0.85',
                        required: true
                    }
                ],
                compute: (f)=>{
                    const Pin = Number(f.pout) / Number(f.eff); // kW
                    const I = Pin * 1000 / (Math.sqrt(3) * Number(f.V) * Number(f.pf));
                    return {
                        'Input power (kW)': Pin,
                        'Phase current (A)': I
                    };
                }
            };
        case 'Diagnostics Hub':
            return {
                inputs: [
                    {
                        name: 'reported',
                        label: 'Errors reported',
                        min: 1,
                        required: true
                    },
                    {
                        name: 'resolved',
                        label: 'Errors resolved',
                        min: 0,
                        required: true
                    },
                    {
                        name: 'sumTime',
                        label: 'Sum resolution time',
                        unit: 'h',
                        min: 0,
                        required: true
                    }
                ],
                compute: (f)=>{
                    const RR = Number(f.resolved) / Number(f.reported);
                    const Tavg = Number(f.resolved) > 0 ? Number(f.sumTime) / Number(f.resolved) : 0;
                    return {
                        'Resolution rate (ratio)': RR,
                        'Avg time to resolve (h)': Tavg
                    };
                }
            };
        default:
            return {
                inputs: [],
                compute: ()=>({})
            };
    }
}
var _c;
__turbopack_context__.k.register(_c, "NineInOneCalculator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/diagnostics/NineInOneCalculator.jsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/components/diagnostics/NineInOneCalculator.jsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=app_components_diagnostics_4d17f880._.js.map