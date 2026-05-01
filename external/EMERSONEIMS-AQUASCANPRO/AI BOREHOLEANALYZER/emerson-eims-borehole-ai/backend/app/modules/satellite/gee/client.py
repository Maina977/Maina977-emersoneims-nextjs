class GEEClient:
    """
    Google Earth Engine client (modules/satellite/gee).

    Requires the earthengine-api package and valid GEE credentials.
    Will NOT return fake data — raises RuntimeError if not authenticated.
    """

    def __init__(self, project_id, credentials=None):
        self.project_id = project_id
        self.credentials = credentials
        self.initialized = False

    def initialize(self):
        """Initialize GEE client — requires real credentials."""
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
                "earthengine-api not installed. Run: pip install earthengine-api"
            )
        except Exception as exc:
            raise RuntimeError(
                f"GEE initialization failed (credentials missing or invalid): {exc}"
            )

    def _require_init(self):
        if not self.initialized:
            raise RuntimeError(
                "GEE client not initialized. Call initialize() with valid "
                "service-account credentials. No fake data will be returned."
            )

    def get_image_collection(self, collection_id, start_date, end_date):
        """Get real image collection from GEE."""
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