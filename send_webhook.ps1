$webhookUrl = "https://espora.app.n8n.cloud/webhook/3d2c24a1-a8df-4ec3-bcbf-e0a6b5d8136b"

$html = [System.IO.File]::ReadAllText("C:\Users\bauty\.gemini\antigravity\scratch\el-espora-periodico\index.html", [System.Text.Encoding]::UTF8)
$css = [System.IO.File]::ReadAllText("C:\Users\bauty\.gemini\antigravity\scratch\el-espora-periodico\styles.css", [System.Text.Encoding]::UTF8)
$js = [System.IO.File]::ReadAllText("C:\Users\bauty\.gemini\antigravity\scratch\el-espora-periodico\app.js", [System.Text.Encoding]::UTF8)

$payload = [PSCustomObject]@{
    project = "El Espora"
    timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:sszzz")
    business_info = [PSCustomObject]@{
        name = "El Espora"
        tagline = "periodico local (patagonia argentina)"
        value_proposition = "ser un medio de informacion que condense las noticias mas importantes del mundo pero con prioridad y mirada local"
        sector = "medio de comunicacion"
        website_type = "personal"
        primary_color = "blanco hueso semejante a un periodico con finos detalles en azul navy oscuro"
        aesthetic = "periodico antiguo elegante"
    }
    assets = @(
        [PSCustomObject]@{ name = "logo"; file = "assets/logo.jpg"; type = "image/jpeg"; description = "Sello grabado vintage circular El Espora" },
        [PSCustomObject]@{ name = "hero"; file = "assets/hero-patagonia.jpg"; type = "image/jpeg"; description = "Fotoperiodismo glaciar Patagonia" },
        [PSCustomObject]@{ name = "mundo"; file = "assets/mundo-geopolitica.jpg"; type = "image/jpeg"; description = "Despacho internacional y cartas nauticas" },
        [PSCustomObject]@{ name = "cronicas"; file = "assets/cronicas-viento.jpg"; type = "image/jpeg"; description = "Don Anselmo en Cabo Blanco" },
        [PSCustomObject]@{ name = "archivo"; file = "assets/archivo-prensa.jpg"; type = "image/jpeg"; description = "Taller de imprenta historica" }
    )
    code = [PSCustomObject]@{
        html = $html
        css = $css
        js = $js
    }
}

$json = $payload | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($json)) -ContentType "application/json; charset=utf-8"
    Write-Host "HTTP_STATUS_OK"
    Write-Host ($response | ConvertTo-Json -Compress)
} catch {
    Write-Host "HTTP_ERROR: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)"
    }
}
