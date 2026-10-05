IF OBJECT_ID(N'dbo.spaces', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.spaces (
    id INT NOT NULL PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    type NVARCHAR(50) NOT NULL,
    image NVARCHAR(1000) NOT NULL,
    accessibility_score INT NOT NULL CHECK (accessibility_score BETWEEN 0 AND 100),
    features NVARCHAR(MAX) NOT NULL,
    distance NVARCHAR(50) NOT NULL,
    rating DECIMAL(2, 1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    review_count INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    crowd_level NVARCHAR(20) NOT NULL,
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    address NVARCHAR(300) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    open_hours NVARCHAR(100) NOT NULL,
    last_updated DATE NOT NULL,
    environment_score INT NOT NULL CHECK (environment_score BETWEEN 0 AND 100),
    noise_level NVARCHAR(30) NOT NULL,
    surface_type NVARCHAR(50) NOT NULL,
    lighting NVARCHAR(30) NOT NULL,
    nearby_facilities NVARCHAR(MAX) NOT NULL,
    ai_confidence INT NOT NULL CHECK (ai_confidence BETWEEN 0 AND 100)
  );
END;

IF OBJECT_ID(N'dbo.reviews', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.reviews (
    id INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    space_id INT NOT NULL REFERENCES dbo.spaces(id) ON DELETE CASCADE,
    user_name NVARCHAR(80) NOT NULL,
    avatar NVARCHAR(8) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment NVARCHAR(2000) NOT NULL CHECK (LEN(comment) BETWEEN 1 AND 2000),
    review_date DATE NOT NULL DEFAULT CONVERT(date, GETDATE()),
    helpful INT NOT NULL DEFAULT 0 CHECK (helpful >= 0)
  );
END;

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = N'reviews_space_id_idx' AND object_id = OBJECT_ID(N'dbo.reviews')
)
BEGIN
  CREATE INDEX reviews_space_id_idx ON dbo.reviews(space_id);
END;
