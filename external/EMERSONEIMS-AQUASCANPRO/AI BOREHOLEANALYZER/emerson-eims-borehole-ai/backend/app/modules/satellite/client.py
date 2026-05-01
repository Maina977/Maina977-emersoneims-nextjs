class GEEClient:
    """
    Google Earth Engine client.

    Requires a GEE service account with credentials JSON.
    Without valid credentials, all methods raise RuntimeError
    instead of returning fake data.
    """

    def __init__(self, project_id, credentials=None):
        self.project_id = project_id
        self.credentials = credentials
        self.initialized = False

    def initialize(self):
        """Initialize GEE client — requires valid credentials."""
        try:
            import ee

            if self.credentials:
                ee.Initialize(credentials=self.credentials, project=self.project_id)
            else:
                ee.Initialize(project=self.project_id)
            self.initialized = True
            print(f"GEE client initialized for project {self.project_id}")
        except ImportError:
            raise RuntimeError(
                "earthengine-api not installed. "
                "Run: pip install earthengine-api"
            )
        except Exception as exc:
            raise RuntimeError(
                f"GEE initialization failed (credentials missing or invalid): {exc}"
            )

    def _require_init(self):
        if not self.initialized:
            raise RuntimeError(
                "GEE client not initialized. Call initialize() with valid "
                "service-account credentials first. No fake data will be returned."
            )

    def get_image_collection(self, collection_id, start_date, end_date):
        """Get image collection from GEE — requires active authentication."""
        self._require_init()
        import ee

        collection = (
            ee.ImageCollection(collection_id)
            .filterDate(start_date, end_date)
        )
        count = collection.size().getInfo()
        return {
            "collection_id": collection_id,
            "start_date": start_date,
            "end_date": end_date,
            "image_count": count,
        }