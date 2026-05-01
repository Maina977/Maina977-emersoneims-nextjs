import re, pathlib
files = ['eims_console.html', 'interactive_wizard.html', 'step_by_step_wizard.html']
sets = {}
for f in files:
    p = pathlib.Path(f)
    if not p.exists():
        print(f'MISSING: {f}'); sets[f] = set(); continue
    txt = p.read_text(encoding='utf-8', errors='ignore')
    eps = sorted(set(re.findall(r'/api/[A-Za-z0-9_/\-]+', txt)))
    sets[f] = set(eps)
    print(f'\n=== {f}: {len(eps)} endpoints ===')
    for e in eps: print('  ', e)
console = sets['eims_console.html']
iw = sets['interactive_wizard.html']
sw = sets['step_by_step_wizard.html']
print(f'\n=== In console NOT in interactive_wizard ({len(console-iw)}) ===')
for e in sorted(console-iw): print('  ', e)
print(f'\n=== In console NOT in step_by_step_wizard ({len(console-sw)}) ===')
for e in sorted(console-sw): print('  ', e)
print(f'\n=== In wizards NOT in console ({len((iw|sw)-console)}) ===')
for e in sorted((iw|sw)-console): print('  ', e)
