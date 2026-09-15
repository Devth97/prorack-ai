param(
    [string]$SourceDir = "dist",
    [string]$ZipFile = "dist.zip"
)

$sourceFullPath = (Resolve-Path $SourceDir).Path

if (Test-Path $ZipFile) {
    Remove-Item $ZipFile -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipArchive = [System.IO.Compression.ZipFile]::Open($ZipFile, [System.IO.Compression.ZipArchiveMode]::Create)
$files = Get-ChildItem -Path $SourceDir -Recurse -File

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($sourceFullPath.Length + 1)
    $zipEntryName = $relativePath.Replace('\', '/')
    $compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipArchive, $file.FullName, $zipEntryName, $compressionLevel)
}

$zipArchive.Dispose()
Write-Output "dist.zip created with $($files.Count) entries (forward slashes)."
