"""EIMS engineering modules.

Each submodule exposes a `register(app, **deps)` function that wires its
routes onto the given Flask app. Modules MUST:

* Provide an offline fallback for any external data source.
* Tag every numeric output with `source`, `method`, and (where applicable)
  `code_clause` so downstream PDFs/BOQs can cite provenance.
* Use the shared `eims` logger.
"""

import logging

logger = logging.getLogger('eims')

__all__ = ['logger']
