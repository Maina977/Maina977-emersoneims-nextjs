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
"[project]/app/components/diagnostics/RadarScope.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RadarScope
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function RadarScope({ size = 400, sweepSpeed = 0.024, blipCount = 10 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        style: {
            width: size,
            height: size
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: size,
            height: size,
            className: "radar-scope",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: size / 2,
                    cy: size / 2,
                    r: size / 2 - 10,
                    fill: "none",
                    stroke: "#0f0",
                    strokeWidth: "2"
                }, void 0, false, {
                    fileName: "[project]/app/components/diagnostics/RadarScope.jsx",
                    lineNumber: 7,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: size / 2,
                    cy: size / 2,
                    r: size / 3,
                    fill: "none",
                    stroke: "#0f0",
                    strokeWidth: "1",
                    opacity: "0.5"
                }, void 0, false, {
                    fileName: "[project]/app/components/diagnostics/RadarScope.jsx",
                    lineNumber: 8,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: size / 2,
                    cy: size / 2,
                    r: size / 6,
                    fill: "none",
                    stroke: "#0f0",
                    strokeWidth: "1",
                    opacity: "0.5"
                }, void 0, false, {
                    fileName: "[project]/app/components/diagnostics/RadarScope.jsx",
                    lineNumber: 9,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: size / 2,
                    y1: size / 2,
                    x2: size / 2,
                    y2: "0",
                    stroke: "#0f0",
                    strokeWidth: "1"
                }, void 0, false, {
                    fileName: "[project]/app/components/diagnostics/RadarScope.jsx",
                    lineNumber: 10,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: size / 2,
                    y1: size / 2,
                    x2: size,
                    y2: size / 2,
                    stroke: "#0f0",
                    strokeWidth: "1"
                }, void 0, false, {
                    fileName: "[project]/app/components/diagnostics/RadarScope.jsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, this),
                Array.from({
                    length: blipCount
                }).map((_, i)=>{
                    const angle = i / blipCount * Math.PI * 2;
                    const radius = (size / 2 - 20) * (0.3 + Math.random() * 0.7);
                    const x = size / 2 + Math.cos(angle) * radius;
                    const y = size / 2 + Math.sin(angle) * radius;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: x,
                        cy: y,
                        r: "3",
                        fill: "#0f0",
                        opacity: "0.8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.8;0.2;0.8",
                            dur: "2s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/RadarScope.jsx",
                            lineNumber: 20,
                            columnNumber: 15
                        }, this)
                    }, i, false, {
                        fileName: "[project]/app/components/diagnostics/RadarScope.jsx",
                        lineNumber: 19,
                        columnNumber: 13
                    }, this);
                })
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/diagnostics/RadarScope.jsx",
            lineNumber: 6,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/diagnostics/RadarScope.jsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = RadarScope;
var _c;
__turbopack_context__.k.register(_c, "RadarScope");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/diagnostics/SystemLogs.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SystemLogs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function SystemLogs({ initialLogs = [] }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-black border border-gray-700 rounded p-2 h-48 overflow-y-auto font-mono text-xs",
        children: initialLogs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-gray-500",
            children: "No logs available"
        }, void 0, false, {
            fileName: "[project]/app/components/diagnostics/SystemLogs.jsx",
            lineNumber: 7,
            columnNumber: 9
        }, this) : initialLogs.map((log, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-green-400 mb-1",
                children: log
            }, i, false, {
                fileName: "[project]/app/components/diagnostics/SystemLogs.jsx",
                lineNumber: 10,
                columnNumber: 11
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/components/diagnostics/SystemLogs.jsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = SystemLogs;
var _c;
__turbopack_context__.k.register(_c, "SystemLogs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/diagnostics/CockpitSwitches.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CockpitSwitches
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function CockpitSwitches({ labels = [], onToggle, initialState = {} }) {
    _s();
    const [states, setStates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialState);
    const handleToggle = (label)=>{
        const newState = !states[label];
        setStates((prev)=>({
                ...prev,
                [label]: newState
            }));
        if (onToggle) onToggle(label, newState);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: labels.map((label)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between p-2 bg-gray-800 rounded",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-gray-300",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/app/components/diagnostics/CockpitSwitches.jsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleToggle(label),
                        className: `w-12 h-6 rounded-full transition-colors ${states[label] ? 'bg-amber-500' : 'bg-gray-600'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `w-5 h-5 bg-white rounded-full transition-transform ${states[label] ? 'translate-x-6' : 'translate-x-0.5'}`
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/CockpitSwitches.jsx",
                            lineNumber: 25,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/diagnostics/CockpitSwitches.jsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, this)
                ]
            }, label, true, {
                fileName: "[project]/app/components/diagnostics/CockpitSwitches.jsx",
                lineNumber: 17,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/components/diagnostics/CockpitSwitches.jsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_s(CockpitSwitches, "bzJ1Qr8FuHPqsaOJHNzHvx5aW2M=");
_c = CockpitSwitches;
var _c;
__turbopack_context__.k.register(_c, "CockpitSwitches");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/diagnostics/PopUps.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PopUps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function PopUps({ alerts = [], onClear }) {
    if (alerts.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-gray-500 text-sm",
            children: "No active alerts"
        }, void 0, false, {
            fileName: "[project]/app/components/diagnostics/PopUps.jsx",
            lineNumber: 5,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            alerts.map((alert)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `p-3 rounded border-l-4 ${alert.level === 'HIGH' ? 'bg-red-900/30 border-red-500' : 'bg-amber-900/30 border-amber-500'}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "font-bold text-xs mb-1",
                            children: alert.title
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/PopUps.jsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-gray-300",
                            children: alert.message
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/PopUps.jsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this)
                    ]
                }, alert.id, true, {
                    fileName: "[project]/app/components/diagnostics/PopUps.jsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, this)),
            onClear && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onClear,
                className: "mt-2 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded",
                children: "Clear All"
            }, void 0, false, {
                fileName: "[project]/app/components/diagnostics/PopUps.jsx",
                lineNumber: 24,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/diagnostics/PopUps.jsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = PopUps;
var _c;
__turbopack_context__.k.register(_c, "PopUps");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UniversalDiagnosticMachine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$diagnostics$2f$MetalBezel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/diagnostics/MetalBezel.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$diagnostics$2f$RadarScope$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/diagnostics/RadarScope.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$diagnostics$2f$SystemLogs$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/diagnostics/SystemLogs.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$diagnostics$2f$CockpitSwitches$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/diagnostics/CockpitSwitches.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$diagnostics$2f$PopUps$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/diagnostics/PopUps.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
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
function UniversalDiagnosticMachine({ onSeverityUpdate = null }) {
    _s();
    const [activeService, setActiveService] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(SERVICES[0]);
    const [health, setHealth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('green'); // green | amber | red
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialLogs());
    const [alerts, setAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Derived radar blip density per service (purely visual; replace with real data later)
    const blipCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UniversalDiagnosticMachine.useMemo[blipCount]": ()=>getBlipCount(activeService)
    }["UniversalDiagnosticMachine.useMemo[blipCount]"], [
        activeService
    ]);
    // Simulate diagnostics: append log lines and adjust health state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UniversalDiagnosticMachine.useEffect": ()=>{
            const interval = setInterval({
                "UniversalDiagnosticMachine.useEffect.interval": ()=>{
                    const { line, severity } = generateDiagnosticLine(activeService);
                    setLogs({
                        "UniversalDiagnosticMachine.useEffect.interval": (prev)=>[
                                ...prev.slice(-49),
                                line
                            ]
                    }["UniversalDiagnosticMachine.useEffect.interval"]);
                    // Health rule-of-thumb: escalate if severity is high
                    setHealth({
                        "UniversalDiagnosticMachine.useEffect.interval": (prev)=>{
                            if (severity === 'HIGH') return 'red';
                            if (severity === 'MED') return prev === 'green' ? 'amber' : prev;
                            return prev;
                        }
                    }["UniversalDiagnosticMachine.useEffect.interval"]);
                    // Call onSeverityUpdate callback if provided
                    if (onSeverityUpdate && typeof onSeverityUpdate === 'function') {
                        onSeverityUpdate(activeService, severity);
                    }
                    // Optional popup alerts
                    if (severity !== 'LOW') {
                        setAlerts({
                            "UniversalDiagnosticMachine.useEffect.interval": (prev)=>[
                                    ...prev.slice(-2),
                                    {
                                        id: Date.now(),
                                        title: severity === 'HIGH' ? 'CRITICAL ALERT' : 'ATTENTION',
                                        message: line,
                                        level: severity
                                    }
                                ]
                        }["UniversalDiagnosticMachine.useEffect.interval"]);
                    }
                }
            }["UniversalDiagnosticMachine.useEffect.interval"], 2500);
            return ({
                "UniversalDiagnosticMachine.useEffect": ()=>clearInterval(interval)
            })["UniversalDiagnosticMachine.useEffect"];
        }
    }["UniversalDiagnosticMachine.useEffect"], [
        activeService,
        onSeverityUpdate
    ]);
    const onSwitchToggle = (label, state)=>{
        // Use CockpitSwitches to choose service mode; map switches to services
        // Example mapping: just set active service when a switch flips ON
        if (state) setActiveService(label);
    };
    const clearAlerts = ()=>setAlerts([]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$diagnostics$2f$MetalBezel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        title: "Universal Diagnostic Machine (All 9 Services)",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 xl:grid-cols-[380px,1fr] gap-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Panel, {
                            title: "SERVICE STATUS",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ServiceStatusLights, {
                                activeService: activeService,
                                health: health
                            }, void 0, false, {
                                fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Panel, {
                            title: "SERVICE SELECTOR",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$diagnostics$2f$CockpitSwitches$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                labels: SERVICES,
                                onToggle: onSwitchToggle,
                                // Preselect current service (optional)
                                initialState: SERVICES.reduce((acc, s)=>({
                                        ...acc,
                                        [s]: s === activeService
                                    }), {})
                            }, void 0, false, {
                                fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Panel, {
                            title: "DIAGNOSTIC LOGS",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$diagnostics$2f$SystemLogs$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                initialLogs: logs
                            }, void 0, false, {
                                fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Panel, {
                            title: `RADAR — ${activeService}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$diagnostics$2f$RadarScope$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    size: 400,
                                    sweepSpeed: 0.024,
                                    blipCount: blipCount
                                }, void 0, false, {
                                    fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ServiceHint, {
                                    activeService: activeService
                                }, void 0, false, {
                                    fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                                    lineNumber: 109,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Panel, {
                            title: "ALERTS / RECOMMENDATIONS",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$diagnostics$2f$PopUps$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                alerts: alerts,
                                onClear: clearAlerts
                            }, void 0, false, {
                                fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
            lineNumber: 81,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_s(UniversalDiagnosticMachine, "TOwXhu4A3ItYoz1O6yZ01IVAubs=");
_c = UniversalDiagnosticMachine;
/* ---------- Helpers & small subcomponents ---------- */ function Panel({ title, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-3 bg-gray-900 border-2 border-gray-600 rounded-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xs font-bold text-gray-300 tracking-widest mb-2",
                children: title
            }, void 0, false, {
                fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
_c1 = Panel;
function ServiceStatusLights({ activeService, health }) {
    // Map health to lamp color
    const color = health === 'green' ? 'bg-green-500' : health === 'amber' ? 'bg-yellow-400' : 'bg-red-600';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 p-2 border border-gray-700 rounded",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `w-5 h-5 rounded-full ${color} animate-pulse`
                    }, void 0, false, {
                        fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-mono text-gray-200",
                        children: activeService
                    }, void 0, false, {
                        fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 p-2 border border-gray-700 rounded",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-5 h-5 rounded-full bg-blue-500 animate-ping"
                    }, void 0, false, {
                        fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-mono text-gray-200",
                        children: "HEARTBEAT"
                    }, void 0, false, {
                        fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
                lineNumber: 146,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
}
_c2 = ServiceStatusLights;
function ServiceHint({ activeService }) {
    const copy = {
        'Solar Systems': 'Check array voltage, MPPT status, string balance, and irradiance vs PSH.',
        'Diesel Generators': 'Review load factor, fuel rate, coolant temp, oil pressure, and start logs.',
        Controls: 'Inspect controller alarms, inputs/outputs, sensor scaling, and firmware revision.',
        'AC & UPS': 'Verify battery bus voltage, runtime estimates, PF, and inverter thermal status.',
        Automation: 'Confirm cycle steps, interlocks, safety PLC states, and throughput targets.',
        Pumps: 'Validate flow, head, NPSH, motor current, and cavitation risk indicators.',
        Incinerators: 'Check chamber temp, LHV inputs, air-fuel ratio, and burner ignition cycles.',
        'Motors/Rewinding': 'Measure phase current, vibration, insulation resistance, and slip.',
        'Diagnostics Hub': 'Aggregate error codes, resolution rate, and average time to resolve.'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-3 p-2 bg-black border border-gray-700 rounded text-xs text-gray-300 font-mono",
        children: copy[activeService]
    }, void 0, false, {
        fileName: "[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx",
        lineNumber: 167,
        columnNumber: 5
    }, this);
}
_c3 = ServiceHint;
function getBlipCount(service) {
    const base = 16;
    const map = {
        'Solar Systems': base + 6,
        'Diesel Generators': base + 8,
        Controls: base + 4,
        'AC & UPS': base + 5,
        Automation: base + 7,
        Pumps: base + 5,
        Incinerators: base + 3,
        'Motors/Rewinding': base + 6,
        'Diagnostics Hub': base + 10
    };
    return map[service] ?? base;
}
function initialLogs() {
    return [
        '[INIT] Universal Diagnostic Machine online',
        '[CHECK] Sensors synced, heartbeat nominal',
        '[INFO] Awaiting service selection...'
    ];
}
function generateDiagnosticLine(service) {
    const ts = new Date().toLocaleTimeString();
    const msgs = {
        'Solar Systems': [
            'String voltage imbalance detected; recommend IV sweep',
            'Irradiance below threshold, PSH recalibration recommended',
            'MPPT tracking nominal'
        ],
        'Diesel Generators': [
            'Oil pressure transient observed; check filter',
            'Load factor stable at 0.72',
            'Fuel rate high; inspect injector calibration'
        ],
        Controls: [
            'Controller alarm A12: Sensor scaling mismatch',
            'Firmware OK; CRC verified',
            'I/O mapping updated'
        ],
        'AC & UPS': [
            'Runtime estimate 42 min at current load',
            'PF low; corrective tuning advised',
            'Bus voltage ripple within tolerance'
        ],
        Automation: [
            'Cycle time trending up; bottleneck at Step 2',
            'Interlock confirmed; safety loop closed',
            'Throughput stable at 180 u/h'
        ],
        Pumps: [
            'NPSH margin tight; cavitation risk',
            'Motor current nominal',
            'Head/flow within curve'
        ],
        Incinerators: [
            'AFR drift; burner tuning required',
            'Chamber temperature stable',
            'LHV variability detected'
        ],
        'Motors/Rewinding': [
            'Insulation resistance borderline; schedule IR test',
            'Vibration spike at 48 Hz; check bearing',
            'Slip within expected limits'
        ],
        'Diagnostics Hub': [
            'Resolution rate improved to 0.86',
            'Avg time to resolve: 1.9 h',
            'New error codes ingested'
        ]
    };
    const pool = msgs[service] || [
        'System check OK'
    ];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    // Severity heuristic
    let severity = 'LOW';
    if (pick.toLowerCase().includes('risk') || pick.toLowerCase().includes('critical')) severity = 'HIGH';
    else if (pick.toLowerCase().includes('borderline') || pick.toLowerCase().includes('drift')) severity = 'MED';
    return {
        line: `[${ts}] ${service}: ${pick}`,
        severity
    };
}
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "UniversalDiagnosticMachine");
__turbopack_context__.k.register(_c1, "Panel");
__turbopack_context__.k.register(_c2, "ServiceStatusLights");
__turbopack_context__.k.register(_c3, "ServiceHint");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/components/diagnostics/UniversalDiagnosticMachine.jsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=app_components_diagnostics_1ff55c1e._.js.map