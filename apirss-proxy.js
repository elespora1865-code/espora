export default async function handler(req, res) {
    const feedUrl = req.query.url;

    if (!feedUrl) {
        return res.status(400).json({ error: "Falta el parámetro 'url'" });
    }

    try {
        const respuestaOrigen = await fetch(feedUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; ElEsporaBot/1.0)"
            },
            signal: AbortSignal.timeout(9000)
        });

        if (!respuestaOrigen.ok) {
            return res.status(respuestaOrigen.status).json({ error: `El medio respondió ${respuestaOrigen.status}` });
        }

        const textoXml = await respuestaOrigen.text();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/xml; charset=utf-8");
        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

        return res.status(200).send(textoXml);

    } catch (error) {
        return res.status(500).json({ error: "No se pudo obtener el feed", detalle: error.message });
    }
}