"""
EMERSON EIMS - Manual backup utility.

Copies eims.db and the uploads/ directory to a timestamped folder.
Gitignored data (DB, user uploads, audit log) is the ONLY data not preserved
by git, so this script is your second line of defense.

Usage:
    python backup.py                       # writes to ./backups/<timestamp>/
    python backup.py /path/to/external     # writes to /path/to/external/<timestamp>/

Run regularly (weekly at minimum). For daily automation, schedule via
Windows Task Scheduler or cron pointing at this script.
"""
import shutil
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCES = [
    ROOT / 'eims.db',       # Flask SQLite DB (users, sessions, projects)
    ROOT / 'uploads',       # user uploads + audit log + eims_projects.db
]


def main() -> int:
    dest_parent = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'backups'
    stamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    dest = dest_parent / stamp
    dest.mkdir(parents=True, exist_ok=True)

    copied = 0
    skipped = []
    for src in SOURCES:
        if not src.exists():
            skipped.append(str(src))
            continue
        target = dest / src.name
        if src.is_dir():
            shutil.copytree(src, target, dirs_exist_ok=True)
        else:
            shutil.copy2(src, target)
        size_mb = sum(p.stat().st_size for p in ([src] if src.is_file() else src.rglob('*')) if p.is_file()) / 1024 / 1024
        print(f'  copied {src.name}  ({size_mb:.1f} MB)')
        copied += 1

    print(f'\nBackup written to: {dest}')
    if skipped:
        print(f'Skipped (not present): {", ".join(skipped)}')
    return 0 if copied else 1


if __name__ == '__main__':
    sys.exit(main())
