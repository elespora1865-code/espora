// 1. BASE DE DATOS DE FUENTES RSS
const RSS_SOURCES = [
    // --- PATAGONIA ---
    { id: "adnsur-comodoro", name: "ADNSUR", categoryKey: "patagonia", categoryLabel: "Patagonia & Chubut", url: "https://www.adnsur.com.ar/rss", icon: "⛽", badgeColor: "#0284c7" },
    { id: "las-heras-noticias", name: "Las Heras Noticias", categoryKey: "patagonia", categoryLabel: "Patagonia & Santa Cruz", url: "https://lasherasnoticias.com.ar/feed/", icon: "⛏️", badgeColor: "#0284c7" },
    { id: "caleta-noticias", name: "Caleta Noticias", categoryKey: "patagonia", categoryLabel: "Patagonia & Santa Cruz", url: "https://caletanoticias.com.ar/feed/", icon: "🌊", badgeColor: "#0284c7" },
    { id: "ahora-calafate", name: "Ahora Calafate", categoryKey: "patagonia", categoryLabel: "Patagonia & Santa Cruz", url: "https://ahoracalafate.com.ar/rss", icon: "🏔️", badgeColor: "#0284c7" },
    { id: "red43-esquel", name: "Red43", categoryKey: "patagonia", categoryLabel: "Patagonia & Chubut", url: "https://www.red43.com.ar/feed/", icon: "🏔️", badgeColor: "#0284c7" },
    { id: "tiempo-sur", name: "Tiempo Sur", categoryKey: "patagonia", categoryLabel: "Patagonia & Santa Cruz", url: "https://www.tiemposur.com.ar/rss", icon: "❄️", badgeColor: "#0284c7" },
    { id: "el-patagonico", name: "El Patagónico", categoryKey: "patagonia", categoryLabel: "Patagonia & Chubut", url: "https://www.elpatagonico.com/rss", icon: "📰", badgeColor: "#0369a1" },

    // --- NACIONAL ---
    { id: "el-cronista", name: "El Cronista", categoryKey: "nacional", categoryLabel: "Argentina & Economía", url: "https://www.cronista.com/rss/feed.xml", icon: "📈", badgeColor: "#15803d" },
    { id: "diario-perfil", name: "Perfil", categoryKey: "nacional", categoryLabel: "Argentina & Nacional", url: "https://www.perfil.com/feed/", icon: "🗞️", badgeColor: "#0284c7" },
    { id: "todo-noticias", name: "TN", categoryKey: "nacional", categoryLabel: "Argentina & Nacional", url: "https://tn.com.ar/rss.xml", icon: "📺", badgeColor: "#dc2626" },
    { id: "clarin-lo-ultimo", name: "Clarín", categoryKey: "nacional", categoryLabel: "Argentina & Nacional", url: "https://www.clarin.com/rss/lo-ultimo/", icon: "📰", badgeColor: "#dc2626" },

    // --- INTERNACIONAL / GEOPOLÍTICA ---
    { id: "bbc-mundo", name: "BBC Mundo", categoryKey: "geopolitica", categoryLabel: "Geopolítica Global", url: "https://feeds.bbci.co.uk/mundo/rss.xml", icon: "🌐", badgeColor: "#0f2c59" },
    { id: "elpais-inter", name: "El País", categoryKey: "geopolitica", categoryLabel: "Geopolítica Global", url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada", icon: "🌎", badgeColor: "#1d4ed8" },
    { id: "cnn-espanol", name: "CNN en Español", categoryKey: "geopolitica", categoryLabel: "Geopolítica Global", url: "https://cnnespanol.cnn.com/feed/", icon: "📺", badgeColor: "#cc0000" }
];

let allArticles = [];

// 2. FUNCIÓN PARA OBTENER NOTICIAS DE UN FEED RSS
async function fetchFeed(source) {
    // Proxy público para saltar las restricciones de CORS en el navegador
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(source.url)}`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("Error al conectar con la fuente");

        const xmlText = await response.text();
        const xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        let articles = [];
        items.forEach((item, index) => {
            if (index >= 5) return; // Limitamos a 5 noticias por medio para no saturar

            const title = item.querySelector("title")?.textContent || "Sin título";
            const link = item.querySelector("link")?.textContent || "#";
            const pubDate = item.querySelector("pubDate")?.textContent || "";

            articles.push({
                title,
                link,
                pubDate: pubDate ? new Date(pubDate).toLocaleDateString("es-AR") : "",
                sourceName: source.name,
                category: source.categoryKey,
                icon: source.icon
            });
        });

        return articles;
    } catch (error) {
        console.warn(`No se pudieron cargar las noticias de ${source.name}:`, error);
        return [];
    }
}

// 3. CARGAR Y COMBINAR TODAS LAS NOTICIAS
async function loadAllNews() {
    const container = document.getElementById("news-container");
    container.innerHTML = `<p class="loading">Cargando las últimas noticias de todos los medios...</p>`;

    const promises = RSS_SOURCES.map(source => fetchFeed(source));
    const results = await Promise.all(promises);

    // Aplanar la lista de arrays en un solo array de noticias
    allArticles = results.flat();

    if (allArticles.length === 0) {
        container.innerHTML = `<p class="loading">No se pudieron obtener noticias en este momento. Intenta recargar la página.</p>`;
        return;
    }

    renderNews(allArticles);
}

// 4. DIBUJAR LAS TARJETAS EN PANTALLA
function renderNews(articles) {
    const container = document.getElementById("news-container");
    container.innerHTML = "";

    if (articles.length === 0) {
        container.innerHTML = `<p class="loading">No hay noticias que coincidan con la búsqueda.</p>`;
        return;
    }

    articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "news-card";

        card.innerHTML = `
      <a href="${article.link}" target="_blank" rel="noopener noreferrer">
        <div class="news-image">${article.icon}</div>
        <div class="news-content">
          <span class="news-source">${article.sourceName}</span>
          <h3 class="news-title">${article.title}</h3>
          <span class="news-date">${article.pubDate}</span>
        </div>
      </a>
    `;

        container.appendChild(card);
    });
}

// 5. EVENTOS DE FILTRADO Y BÚSQUEDA
document.addEventListener("DOMContentLoaded", () => {
    loadAllNews();

    // Filtro por botones de categoría
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterBtns.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");

            const category = e.target.getAttribute("data-category");
            if (category === "all") {
                renderNews(allArticles);
            } else {
                const filtered = allArticles.filter(art => art.category === category);
                renderNews(filtered);
            }
        });
    });

    // Buscador por palabras clave
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allArticles.filter(art =>
            art.title.toLowerCase().includes(query) ||
            art.sourceName.toLowerCase().includes(query)
        );
        renderNews(filtered);
    });
});