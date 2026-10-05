USE master;
GO

IF SUSER_ID(N'space_finder_app') IS NULL
BEGIN
    CREATE LOGIN [space_finder_app1]
    WITH PASSWORD = N'gaurav01';
END
ELSE
BEGIN
    ALTER LOGIN [space_finder_app1]
    WITH PASSWORD = N'gaurav01';
END
GO

ALTER LOGIN [space_finder_app1] ENABLE;
GO