param(
    [string]$SourceDir = "hostinger-coming-soon",
    [string]$ZipFile = "prorac-ai-hostinger.zip"
)

$sourceFullPath = (Resolve-Path -LiteralPath $SourceDir).Path
$zipFullPath = [System.IO.Path]::GetFullPath($ZipFile)

if (Test-Path -LiteralPath $zipFullPath) {
    Remove-Item -LiteralPath $zipFullPath -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$archive = [System.IO.Compression.ZipFile]::Open(
    $zipFullPath,
    [System.IO.Compression.ZipArchiveMode]::Create
)

try {
    $files = Get-ChildItem -LiteralPath $sourceFullPath -File |
        Where-Object Name -In @('index.html', 'styles.css', 'logo.png', 'under-construction-hero.png')
    foreach ($file in $files) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $archive,
            $file.FullName,
            $file.Name,
            [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
    }
}
finally {
    $archive.Dispose()
}

Write-Output "$ZipFile created with $($files.Count) root-level files."
