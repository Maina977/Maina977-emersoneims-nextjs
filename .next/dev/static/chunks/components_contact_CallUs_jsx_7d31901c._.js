(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/contact/CallUs.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CallUs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function CallUs({ performanceTier }) {
    _s();
    const root = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rippleScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CallUs.useMemo[rippleScale]": ()=>performanceTier === "low" ? 1 : performanceTier === "medium" ? 1.3 : 1.6
    }["CallUs.useMemo[rippleScale]"], [
        performanceTier
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallUs.useEffect": ()=>{
            if (!root.current) return;
            const orbs = root.current.querySelectorAll(".orb");
            const animations = Array.from(orbs).map({
                "CallUs.useEffect.animations": (orb, i)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].fromTo(orb, {
                        scale: 0.9,
                        opacity: 0.7
                    }, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.8 + i * 0.2,
                        ease: "power3.out"
                    })
            }["CallUs.useEffect.animations"]);
            return ({
                "CallUs.useEffect": ()=>{
                    animations.forEach({
                        "CallUs.useEffect": (anim)=>anim.kill()
                    }["CallUs.useEffect"]);
                }
            })["CallUs.useEffect"];
        }
    }["CallUs.useEffect"], [
        performanceTier
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "call-us",
        className: "call-us section-pad",
        "aria-labelledby": "call-us-heading",
        ref: root,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                id: "call-us-heading",
                children: "Call Us"
            }, void 0, false, {
                fileName: "[project]/components/contact/CallUs.jsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "orb-buttons",
                role: "group",
                "aria-label": "Phone numbers",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "orb",
                        "aria-label": "Call 0768 860 655",
                        onMouseEnter: (e)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(e.currentTarget, {
                                scale: rippleScale,
                                duration: 0.3
                            }),
                        onMouseLeave: (e)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(e.currentTarget, {
                                scale: 1,
                                duration: 0.3
                            }),
                        onClick: ()=>window.location.href = "tel:+254768860655",
                        children: "0768 860 655"
                    }, void 0, false, {
                        fileName: "[project]/components/contact/CallUs.jsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "orb",
                        "aria-label": "Call 0782 914 717",
                        onMouseEnter: (e)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(e.currentTarget, {
                                scale: rippleScale,
                                duration: 0.3
                            }),
                        onMouseLeave: (e)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].to(e.currentTarget, {
                                scale: 1,
                                duration: 0.3
                            }),
                        onClick: ()=>window.location.href = "tel:+254782914717",
                        children: "0782 914 717"
                    }, void 0, false, {
                        fileName: "[project]/components/contact/CallUs.jsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/contact/CallUs.jsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/contact/CallUs.jsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_s(CallUs, "GY9cZwnxook7+KPtwDVp+of16KI=");
_c = CallUs;
var _c;
__turbopack_context__.k.register(_c, "CallUs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_contact_CallUs_jsx_7d31901c._.js.map