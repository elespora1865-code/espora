/**
 * ==========================================================================
 * EL ESPORA - Periódico Histórico de la Patagonia Argentina
 * Módulo: Agregador de Noticias RSS en Tiempo Real & Sistema Editorial Vanilla
 * ==========================================================================
 */

// ==========================================================================
// 1. CONFIGURACIÓN DE FUENTES RSS REALES
// ==========================================================================
const RSS_SOURCES = [
  { id: "opinion-austral", name: "La Opinión Austral", categoryKey: "patagonia", categoryLabel: "Portada Principal", url: "https://laopinionaustral.com.ar/feed/", icon: "🔥", badgeColor: "#8b5cf6", fallbackImage: "assets/hero-patagonia.jpg" },
  { id: "rio-negro", name: "Diario Río Negro", categoryKey: "patagonia", categoryLabel: "Patagonia & Región", url: "https://www.rionegro.com.ar/feed/", icon: "🏔️", badgeColor: "#1e3a8a", fallbackImage: "assets/hero-patagonia.jpg" },
  { id: "adnsur", name: "ADNSUR", categoryKey: "patagonia", categoryLabel: "Patagonia & Región", url: "https://www.adnsur.com.ar/rss", icon: "⛽", badgeColor: "#0ea5e9", fallbackImage: "assets/hero-patagonia.jpg" },
  { id: "el-patagonico", name: "El Patagónico", categoryKey: "patagonia", categoryLabel: "Patagonia & Región", url: "https://www.elpatagonico.com/rss", icon: "📰", badgeColor: "#334155", fallbackImage: "assets/hero-patagonia.jpg" },
  { id: "bbc-mundo", name: "BBC Mundo", categoryKey: "geopolitica", categoryLabel: "Geopolítica Global", url: "https://feeds.bbci.co.uk/mundo/rss.xml", icon: "🌐", badgeColor: "#0f2c59", fallbackImage: "assets/mundo-geopolitica.jpg" },
  { id: "elpais", name: "El País", categoryKey: "geopolitica", categoryLabel: "Geopolítica Global", url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada", icon: "🌎", badgeColor: "#10b981", fallbackImage: "assets/mundo-geopolitica.jpg" },
  { id: "dw", name: "DW Español", categoryKey: "geopolitica", categoryLabel: "Geopolítica Global", url: "https://rss.dw.com/rdf/rss-sp-all", icon: "🌍", badgeColor: "#ea580c", fallbackImage: "assets/mundo-geopolitica.jpg" },
  { id: "infobae-nacional", name: "Infobae", categoryKey: "argentina", categoryLabel: "Política Nacional", url: "https://www.infobae.com/politica/rss/", icon: "🗞️", badgeColor: "#1e293b", fallbackImage: "assets/archivo-prensa.jpg" },
  { id: "tn", name: "TN", categoryKey: "argentina", categoryLabel: "Política Nacional", url: "https://tn.com.ar/politica/rss.xml", icon: "📺", badgeColor: "#dc2626", fallbackImage: "assets/archivo-prensa.jpg" },
  { id: "lanacion", name: "La Nación", categoryKey: "argentina", categoryLabel: "Política Nacional", url: "https://contenidos.lanacion.com.ar/herramientas/rss/categoria_id=30", icon: "🏛️", badgeColor: "#0284c7", fallbackImage: "assets/archivo-prensa.jpg" },
  { id: "clarin-ultimo", name: "Clarín", categoryKey: "cultura", categoryLabel: "Cultura & Crónicas", url: "https://www.clarin.com/rss/lo-ultimo/", icon: "📜", badgeColor: "#2563eb", fallbackImage: "assets/cronicas-viento.jpg" },
  { id: "perfil", name: "Perfil", categoryKey: "cultura", categoryLabel: "Cultura & Crónicas", url: "https://www.perfil.com/feed/", icon: "✒️", badgeColor: "#7c3aed", fallbackImage: "assets/cronicas-viento.jpg" },
  { id: "pagina12", name: "Página/12", categoryKey: "cultura", categoryLabel: "Cultura & Crónicas", url: "https://www.pagina12.com.ar/rss/portada", icon: "📝", badgeColor: "#000000", fallbackImage: "assets/cronicas-viento.jpg" }
];

// DATOS ESTÁTICOS DE RESPALDO
const FALLBACK_DISPATCHES = [
  { id: "local-glaciares", title: "La batalla por los glaciares australes y la soberanía del agua en el siglo XXI", link: "https://espora.app", sourceName: "Redacción El Espora", categoryKey: "patagonia", categoryLabel: "Patagonia & Soberanía", author: "Lautaro V. Méndez", pubDate: "2026-08-28 08:00:00", formattedDate: "28 de agosto, 2026", image: "assets/hero-patagonia.jpg", excerpt: "Desde los valles de Santa Cruz hasta los Campos de Hielo Sur, científicos y comunidades monitorean el agua dulce.", content: "Crónica de fondo sobre el monitoreo ambiental y la soberanía de los recursos hídricos en el cono sur." },
  { id: "local-magallanes", title: "Rutas antárticas y el Estrecho de Magallanes: La nueva geopolítica del comercio austral", link: "https://espora.app", sourceName: "El Espora Internacional", categoryKey: "geopolitica", categoryLabel: "Geopolítica Global", author: "Guillermo E. Albarracín", pubDate: "2026-08-28 07:30:00", formattedDate: "28 de agosto, 2026", image: "assets/mundo-geopolitica.jpg", excerpt: "Las tensiones globales revalorizan el histórico paso bioceánico y las proyecciones hacia la Antártida.", content: "Análisis estratégico sobre la logística portuaria y el tránsito marítimo en el Atlántico Sur." },
  { id: "local-cabo-blanco", title: "El guardián del Cabo Blanco: 40 años escuchando la memoria del Atlántico Sur", link: "https://espora.app", sourceName: "Crónicas del Viento", categoryKey: "cultura", categoryLabel: "Cultura & Paisaje", author: "Sofía Nahuelpán", pubDate: "2026-08-27 19:00:00", formattedDate: "27 de agosto, 2026", image: "assets/cronicas-viento.jpg", excerpt: "En un saliente de roca donde solo anidan los cormoranes vive uno de los últimos fareros tradicionales.", content: "Historia humana sobre la resistencia y la memoria viva en la costa patagónica." }
];

// ESTADO GLOBAL DE LA APLICACIÓN
let appState = {
  allArticles: [],
  activeCategory: "all",
  isLoading: false,
  lastUpdated: null,
  currentFontSize: 1.15,
  currentPage: 1,
  itemsPerPage: 9,
  searchQuery: "",
  mainLeadId: null,   // ID de la noticia principal
  sideLeadIds: []     // IDs de las noticias laterales para no duplicar
};

// ==========================================================================
// 2. INICIALIZACIÓN
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initDateDisplay();
  initWeather();
  initThemeToggle();
  initFontSizeControls();
  initReaderModal();
  initCategoryFilters();
  initRefreshButton();
  initSearchBar();

  const rutaActual = window.location.pathname;
  if (rutaActual.includes("patagonia.html")) {
    appState.activeCategory = "patagonia";
  } else if (rutaActual.includes("internacional.html")) {
    appState.activeCategory = "geopolitica";
  } else if (rutaActual.includes("argentina.html")) {
    appState.activeCategory = "argentina";
  } else {
    appState.activeCategory = "all";
  }

  loadAllFeeds();
});

// ==========================================================================
// 3. UTILIDADES Y EXTRACCIÓN DE MULTIMEDIA
// ==========================================================================
function escapeHtml(unsafe) {
  return (unsafe || "").toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function obtenerImagenReal(itemXml) {
  const enclosure = itemXml.querySelector("enclosure");
  if (enclosure && enclosure.getAttribute("url")) return enclosure.getAttribute("url");

  const mediaContent = itemXml.getElementsByTagNameNS("*", "content")[0] || itemXml.getElementsByTagName("media:content")[0];
  if (mediaContent && mediaContent.getAttribute("url")) return mediaContent.getAttribute("url");

  const mediaThumbnail = itemXml.getElementsByTagNameNS("*", "thumbnail")[0] || itemXml.getElementsByTagName("media:thumbnail")[0];
  if (mediaThumbnail && mediaThumbnail.getAttribute("url")) return mediaThumbnail.getAttribute("url");

  const contentEncoded = itemXml.getElementsByTagNameNS("*", "encoded")[0]?.textContent || "";
  const description = itemXml.querySelector("description")?.textContent || "";
  const textoCompleto = contentEncoded + " " + description;

  const coincidenciaImg = textoCompleto.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (coincidenciaImg && coincidenciaImg[1]) {
    const urlEncontrada = coincidenciaImg[1];
    if (!urlEncontrada.includes("1x1") && !urlEncontrada.includes("b.scorecardresearch")) {
      return urlEncontrada;
    }
  }

  return null;
}

// ==========================================================================
// 4. CONSUMO ROBUSTO DE FEEDS RSS (AllOrigins /raw)
// ==========================================================================
async function fetchFeed(source) {
  let textoXml = null;

  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(source.url)}`;

  try {
    const res = await fetch(proxyUrl);
    if (res.ok) {
      textoXml = await res.text();
    }
  } catch (e) {
    // El fetch falló (red, CORS residual, o el proxy caído)
  }

  if (!textoXml || !(textoXml.includes("<rss") || textoXml.includes("<feed") || textoXml.includes("<?xml"))) {
    throw new Error(`No fue posible conectar con el diario: ${source.name}`);
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(textoXml, "text/xml");
  const noticiasXml = Array.from(xmlDoc.querySelectorAll("item, entry"));

  const palabrasProhibidas = new RegExp(
    "\\b(fútbol|partido|goles|torneo|campeonato|liga profesional|messi|boca juniors|river plate|champions league|nba|tenis|motochorro|motochorros|entradera|asalto|ladrones|apuñalado|botín|persecución policial|sangriento|tiroteo en|farándula|gran hermano|receta|horóscopo|zodiaco|romance|look|viral|tiktok|celebridades|chimento|wanda nara|infidelidad|outfit|tendencia en redes)\\b",
    "i"
  );

  const noticiasFiltradas = [];

  noticiasXml.forEach((item, index) => {
    const tituloRaw = item.querySelector("title")?.textContent || "Sin título";
    const titulo = tituloRaw.replace("<![CDATA[", "").replace("]]>", "").trim();
    const descripcionBruta = item.querySelector("description, encoded, content")?.textContent || "";

    const divTemporal = document.createElement("div");
    divTemporal.innerHTML = descripcionBruta;
    const textoLimpio = divTemporal.textContent || divTemporal.innerText || titulo;

    const textoAAnalizar = (titulo + " " + textoLimpio).toLowerCase();

    if (!palabrasProhibidas.test(textoAAnalizar)) {
      const enlace = item.querySelector("link")?.textContent || item.querySelector("link")?.getAttribute("href") || "#";
      const fechaBruta = item.querySelector("pubDate, updated, date")?.textContent || "";
      const fotoReal = obtenerImagenReal(item);

      let imagenFinal = source.fallbackImage;
      if (fotoReal) {
        imagenFinal = `https://wsrv.nl/?url=${encodeURIComponent(fotoReal)}&output=webp`;
      }

      noticiasFiltradas.push({
        id: `${source.id}-${index}-${Date.now()}`,
        sourceId: source.id,
        sourceName: source.name,
        categoryKey: source.categoryKey,
        categoryLabel: source.categoryLabel,
        badgeColor: source.badgeColor,
        title: titulo,
        excerpt: textoLimpio.length > 150 ? textoLimpio.substring(0, 150) + "..." : textoLimpio,
        link: enlace,
        pubDate: fechaBruta ? new Date(fechaBruta).toISOString() : new Date().toISOString(),
        formattedDate: fechaBruta ? new Date(fechaBruta).toLocaleDateString("es-AR", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : "Reciente",
        author: item.querySelector("dc\\:creator, creator, author")?.textContent || source.name,
        image: imagenFinal,
        fallbackImage: source.fallbackImage
      });
    }
  });

  return noticiasFiltradas;
}

// ==========================================================================
// 5. GESTIÓN DE CARGA PRINCIPAL
// ==========================================================================
async function loadAllFeeds(forceRefresh = false) {
  const gridEl = document.getElementById("articles-grid");
  const refreshBtn = document.getElementById("refresh-cables-btn");
  const liveIndicator = document.getElementById("feed-status-text");

  if (!gridEl) return;

  appState.isLoading = true;
  if (refreshBtn) refreshBtn.classList.add("spinning");
  if (liveIndicator) liveIndicator.textContent = "Sincronizando cables...";
  renderSkeletonLoaders(gridEl, 9);

  const cachedData = sessionStorage.getItem("el_espora_rss_cache");
  const cachedTime = sessionStorage.getItem("el_espora_rss_time");
  const isCacheValid = cachedTime && (Date.now() - parseInt(cachedTime, 10) < 1000 * 60 * 8);

  if (!forceRefresh && isCacheValid && cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        appState.allArticles = parsed;
        appState.isLoading = false;
        if (refreshBtn) refreshBtn.classList.remove("spinning");
        if (liveIndicator) liveIndicator.textContent = "Cables en Vivo (Satelital)";

        renderizarNoticiaPrincipal(parsed);
        renderArticles(appState.activeCategory);
        updateBreakingTicker(appState.allArticles);
        return;
      }
    } catch (e) { }
  }

  try {
    const promises = RSS_SOURCES.map(source => fetchFeed(source));
    const results = await Promise.allSettled(promises);

    let feedsData = [];
    let successCount = 0;

    results.forEach((result, idx) => {
      if (result.status === "fulfilled" && Array.isArray(result.value)) {
        const sortedFeed = result.value.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
        feedsData.push(sortedFeed);
        successCount++;
      } else {
        console.warn(`Feed ${RSS_SOURCES[idx].name} falló:`, result.reason);
      }
    });

    let collectedArticles = [];

    if (feedsData.length === 0) {
      console.warn("Usando despachos de respaldo locales.");
      collectedArticles = FALLBACK_DISPATCHES;
      if (liveIndicator) liveIndicator.textContent = "Cables de Archivo (Local)";
    } else {
      if (liveIndicator) liveIndicator.textContent = `Enlace Activo (${successCount}/${RSS_SOURCES.length} Medios)`;
      const maxArticlesInAFeed = Math.max(...feedsData.map(feed => feed.length));
      for (let i = 0; i < maxArticlesInAFeed; i++) {
        for (let j = 0; j < feedsData.length; j++) {
          if (feedsData[j][i]) {
            collectedArticles.push(feedsData[j][i]);
          }
        }
      }
    }

    appState.allArticles = collectedArticles;
    appState.lastUpdated = new Date();
    appState.currentPage = 1;

    try {
      sessionStorage.setItem("el_espora_rss_cache", JSON.stringify(collectedArticles));
      sessionStorage.setItem("el_espora_rss_time", Date.now().toString());
    } catch (e) { }

    renderizarNoticiaPrincipal(collectedArticles);
    renderArticles(appState.activeCategory);
    updateBreakingTicker(collectedArticles);

  } catch (globalErr) {
    console.error("Error global en recepción de feeds:", globalErr);
    renderErrorState(gridEl, "No se pudo establecer contacto con las agencias telegráficas.");
  } finally {
    appState.isLoading = false;
    if (refreshBtn) refreshBtn.classList.remove("spinning");
  }
}

// ==========================================================================
// 6. RENDERIZADO DEL DOM Y PAGINACIÓN
// ==========================================================================
function renderizarNoticiaPrincipal(articulos) {
  if (!articulos || articulos.length === 0) return;

  // 1. EXTRAER LA NOTICIA PRINCIPAL (PRIORIDAD PATAGONIA)
  let noticia = articulos.find(a => a.categoryKey === "patagonia");
  if (!noticia) noticia = articulos[0];

  appState.mainLeadId = noticia.id;
  appState.sideLeadIds = []; // Limpiamos registros de laterales anteriores

  // Actualizar el DOM de la noticia principal
  const titleEl = document.getElementById('main-lead-title');
  const excerptEl = document.getElementById('main-lead-excerpt');
  const authorEl = document.getElementById('main-lead-author');
  const dateEl = document.getElementById('main-lead-date');
  const imgEl = document.getElementById('main-lead-img');
  const linkEl = document.getElementById('main-lead-link');

  if (titleEl) titleEl.textContent = noticia.title;
  if (excerptEl) excerptEl.textContent = noticia.excerpt;
  if (dateEl) dateEl.textContent = noticia.formattedDate;
  if (authorEl) authorEl.innerHTML = `Por <strong>${noticia.author}</strong> - <span>Fuente: <strong>${noticia.sourceName}</strong></span>`;

  if (imgEl) {
    imgEl.src = noticia.image;
    imgEl.onerror = () => { imgEl.src = noticia.fallbackImage; };
  }

  if (linkEl) {
    linkEl.href = noticia.link;
    linkEl.onclick = (e) => {
      e.preventDefault();
      openReaderModalWithArticle(noticia);
    };
  }

  // 2. RENDERIZAR NOTICIAS LATERALES (SIN IMAGEN)
  const sideContainer = document.getElementById('side-news-list') || document.querySelector('.side-news-container');

  if (sideContainer) {
    sideContainer.innerHTML = ''; // Limpiamos el contenedor

    // Obtenemos las siguientes 3 noticias que no sean la principal
    const noticiasLaterales = articulos.filter(a => a.id !== appState.mainLeadId).slice(0, 3);

    noticiasLaterales.forEach(article => {
      appState.sideLeadIds.push(article.id);

      const div = document.createElement('article');
      div.className = 'side-article-item';
      div.style.cssText = 'margin-top: 1.5rem; margin-bottom: 1.5rem; cursor: pointer; border-bottom: 1px solid var(--border-fine); padding-bottom: 1rem;';

      div.innerHTML = `
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--gold-accent); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.5px;">
                ${article.categoryLabel}
            </div>
            <h4 style="font-size: 1.1rem; font-family: var(--font-headline); margin: 0 0 0.6rem 0; line-height: 1.35; color: var(--text-main);">
                ${article.title}
            </h4>
            <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center;">
                <span>${article.sourceIcon || '📰'} ${article.sourceName}</span>
                <span>${article.formattedDate.split(',')[0]}</span>
            </div>
        `;

      div.addEventListener('click', () => openReaderModalWithArticle(article));
      sideContainer.appendChild(div);
    });
  }
}

function renderSkeletonLoaders(container, count = 6) {
  let skeletonHtml = "";
  for (let i = 0; i < count; i++) {
    skeletonHtml += `
            <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line title-line"></div>
                    <div class="skeleton-line title-line-2"></div>
                    <div class="skeleton-line" style="width: 90%;"></div>
                    <div class="skeleton-line" style="width: 75%;"></div>
                    <div class="skeleton-line short" style="margin-top: auto;"></div>
                </div>
            </div>
        `;
  }
  container.innerHTML = skeletonHtml;
}

function renderArticles(filterCategory = "all") {
  const gridEl = document.getElementById("articles-grid");
  if (!gridEl) return;

  const filtered = appState.allArticles.filter(a => {
    // Filtrar la noticia principal y las laterales para no duplicarlas
    if (a.id === appState.mainLeadId || appState.sideLeadIds.includes(a.id)) return false;

    const matchesCategory = filterCategory === "all" || a.categoryKey === filterCategory;
    const query = (appState.searchQuery || "").toLowerCase().trim();
    const matchesSearch = query === "" ||
      a.title.toLowerCase().includes(query) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(query)) ||
      a.sourceName.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  gridEl.innerHTML = "";

  if (filtered.length === 0) {
    gridEl.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                <p style="font-family: var(--font-headline); font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--gold-accent);">
                    Sin despachos encontrados
                </p>
                <p style="font-size: 0.9rem;">No hay cables que coincidan con esta búsqueda o categoría.</p>
            </div>
        `;
    removePaginationControls();
    return;
  }

  const totalPages = Math.ceil(filtered.length / appState.itemsPerPage);
  const startIndex = (appState.currentPage - 1) * appState.itemsPerPage;
  const endIndex = startIndex + appState.itemsPerPage;
  const paginatedArticles = filtered.slice(startIndex, endIndex);

  paginatedArticles.forEach(article => {
    const card = document.createElement("article");
    card.className = "article-card";
    card.setAttribute("data-id", article.id);

    card.innerHTML = `
            <div class="article-img-wrap">
                <img 
                    src="${article.image}" 
                    alt="${escapeHtml(article.title)}" 
                    class="article-img" 
                    loading="lazy"
                    onerror="this.onerror=null; this.src='${article.fallbackImage}';"
                >
                <span class="article-tag-badge">${article.categoryLabel || 'Noticia'}</span>
                <span class="article-source-tag">${article.sourceIcon || '📰'} ${article.sourceName}</span>
            </div>
            
            <div class="article-content">
                <h3 class="article-card-title">${article.title}</h3>
                <p class="article-card-excerpt">${article.excerpt}</p>
                
                <div class="article-card-footer">
                    <span>📅 ${article.formattedDate}</span>
                    <a 
                        href="${article.link}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="btn-source-link" 
                        title="Leer artículo completo en ${article.sourceName}"
                        onclick="event.stopPropagation();"
                    >
                        Leer en ${article.sourceName} ↗
                    </a>
                </div>
            </div>
        `;

    card.addEventListener("click", () => {
      openReaderModalWithArticle(article);
    });

    gridEl.appendChild(card);
  });

  renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
  let paginationWrapper = document.getElementById("pagination-controls");

  if (!paginationWrapper) {
    paginationWrapper = document.createElement("div");
    paginationWrapper.id = "pagination-controls";
    paginationWrapper.style.cssText = "display: flex; justify-content: center; flex-wrap: wrap; gap: 0.5rem; margin: 3rem 0; width: 100%; grid-column: 1 / -1;";
    const gridEl = document.getElementById("articles-grid");
    gridEl.parentNode.insertBefore(paginationWrapper, gridEl.nextSibling);
  }

  paginationWrapper.innerHTML = "";
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.style.cssText = `
            padding: 0.5rem 1rem;
            border: 1px solid var(--border-fine);
            background: ${i === appState.currentPage ? 'var(--gold-accent)' : 'var(--bg-card)'};
            color: ${i === appState.currentPage ? 'var(--navy-deep)' : 'var(--text-main)'};
            font-weight: 700;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-family: var(--font-sans);
            transition: all 0.2s;
        `;

    btn.addEventListener("click", () => {
      appState.currentPage = i;
      renderArticles(appState.activeCategory);
      document.getElementById("articles-grid").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    paginationWrapper.appendChild(btn);
  }
}

function removePaginationControls() {
  const wrapper = document.getElementById("pagination-controls");
  if (wrapper) wrapper.remove();
}

function renderErrorState(container, message) {
  container.innerHTML = `
        <div class="feed-error-box">
            <h4>⚡ Interrupción en la Línea Telegráfica</h4>
            <p style="margin-bottom: 1.25rem; font-size: 0.95rem;">${message}</p>
            <button onclick="loadAllFeeds(true)" class="control-btn" style="margin: 0 auto; background: var(--gold-accent); color: var(--navy-deep); font-weight: 700; padding: 0.6rem 1.2rem;">
                🔄 Reintentar Sintonización
            </button>
        </div>
    `;
}

// ==========================================================================
// 7. ACTUALIZACIÓN DINÁMICA DEL TELEGRAMA DE NOTICIAS (TICKER)
// ==========================================================================
function updateBreakingTicker(articles) {
  const track = document.getElementById("ticker-track");
  if (!track || !articles || articles.length === 0) return;

  const topItems = articles.slice(0, 10);
  let tickerHtml = "";

  const loopList = [...topItems, ...topItems];
  loopList.forEach(item => {
    tickerHtml += `
            <span class="ticker-item" style="cursor: pointer;" onclick="window.open('${item.link}', '_blank')">
                <strong>[${item.sourceName.toUpperCase()}]</strong> ${item.title}
            </span>
        `;
  });

  track.innerHTML = tickerHtml;
}

// ==========================================================================
// 8. FILTROS, BUSCADOR Y BOTONES
// ==========================================================================
function initCategoryFilters() {
  const pills = document.querySelectorAll(".filter-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      appState.activeCategory = pill.getAttribute("data-category");
      appState.currentPage = 1;

      const searchInput = document.getElementById("article-search");
      if (searchInput) {
        searchInput.value = "";
        appState.searchQuery = "";
      }

      renderArticles(appState.activeCategory);
    });
  });
}

function initSearchBar() {
  const searchInput = document.getElementById("article-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      appState.searchQuery = e.target.value;
      appState.currentPage = 1;
      renderArticles(appState.activeCategory);
    });
  }
}

function initRefreshButton() {
  const refreshBtn = document.getElementById("refresh-cables-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      loadAllFeeds(true);
    });
  }
}

// ==========================================================================
// 9. MODAL DE LECTURA INMERSIVA (ARTICLE READER)
// ==========================================================================
function initReaderModal() {
  const modal = document.getElementById("reader-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const bookmarkBtn = document.getElementById("modal-bookmark-btn");

  if (!modal) return;
  if (closeBtn) closeBtn.addEventListener("click", closeReaderModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeReaderModal();
  });

  if (bookmarkBtn) {
    bookmarkBtn.addEventListener("click", () => {
      const isSaved = bookmarkBtn.getAttribute("data-saved") === "true";
      if (isSaved) {
        bookmarkBtn.setAttribute("data-saved", "false");
        bookmarkBtn.innerHTML = `🔖 Guardar`;
      } else {
        bookmarkBtn.setAttribute("data-saved", "true");
        bookmarkBtn.innerHTML = `⭐ Guardado`;
        bookmarkBtn.style.color = "var(--gold-accent)";
      }
    });
  }
}

function openReaderModalWithArticle(article) {
  const modal = document.getElementById("reader-modal");
  const bodyContainer = document.getElementById("reader-modal-body");
  if (!modal || !bodyContainer) return;

  bodyContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span class="reader-category">${article.categoryLabel}</span>
            <span class="edition-badge">${article.sourceIcon || '🗞️'} ${article.sourceName}</span>
        </div>
        
        <h1 class="reader-headline">${article.title}</h1>
        
        <div class="lead-meta" style="margin-bottom: 1.5rem;">
            <div class="author-info">
                <span>Fuente original: <strong>${article.sourceName}</strong></span>
            </div>
            <span>📅 ${article.formattedDate}</span>
            <span>⚡ Despacho en Tiempo Real</span>
        </div>
        
        <p class="reader-lead">${article.excerpt}</p>
        
        <div class="reader-img-wrap">
            <img src="${article.image}" alt="${escapeHtml(article.title)}" onerror="this.src='${article.fallbackImage}'">
            <div class="image-caption">
                <span>Cobertura periodística suministrada por ${article.sourceName}.</span>
                <span>Redacción El Espora</span>
            </div>
        </div>
        
        <div class="reader-body-text" id="reader-dynamic-body">
            <p class="drop-cap">${article.excerpt}</p>
            <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-sm); border: var(--border-fine); margin: 2rem 0; text-align: center;">
                <h4 style="font-size: 1.15rem; color: var(--gold-accent); margin-bottom: 0.5rem;">Continuar leyendo la nota completa</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
                    Este despacho fue emitido en directo desde la plataforma de <strong>${article.sourceName}</strong>. Accede al contenido íntegro original:
                </p>
                <a 
                    href="${article.link}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="btn-subscribe" 
                    style="display: inline-block; text-decoration: none; padding: 0.75rem 1.75rem;"
                >
                    Abrir en ${article.sourceName} ↗
                </a>
            </div>
        </div>
    `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  const scrollEl = modal.querySelector(".reader-content-scroll");
  if (scrollEl) scrollEl.scrollTop = 0;
}

function closeReaderModal() {
  const modal = document.getElementById("reader-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// ==========================================================================
// 10. CONTROL TIPOGRÁFICO Y WIDGETS DE ENTORNO
// ==========================================================================
function initFontSizeControls() {
  const btnDecrease = document.getElementById("btn-font-decrease");
  const btnIncrease = document.getElementById("btn-font-increase");

  if (btnDecrease) {
    btnDecrease.addEventListener("click", () => {
      if (appState.currentFontSize > 0.9) {
        appState.currentFontSize -= 0.1;
        applyFontSize();
      }
    });
  }

  if (btnIncrease) {
    btnIncrease.addEventListener("click", () => {
      if (appState.currentFontSize < 1.6) {
        appState.currentFontSize += 0.1;
        applyFontSize();
      }
    });
  }
}

function applyFontSize() {
  const modalText = document.getElementById("reader-dynamic-body");
  if (modalText) {
    modalText.style.fontSize = `${appState.currentFontSize}rem`;
  }
}

function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem("el-espora-theme");
  if (savedTheme === "parchment") {
    document.body.classList.add("theme-parchment");
    toggleBtn.innerHTML = `🌙 Modo Tinta Oscura`;
  }

  toggleBtn.addEventListener("click", () => {
    const isParchment = document.body.classList.toggle("theme-parchment");
    localStorage.setItem("el-espora-theme", isParchment ? "parchment" : "dark");
    toggleBtn.innerHTML = isParchment ? `🌙 Modo Tinta Oscura` : `📜 Modo Papel Prensa`;
  });
}

function initDateDisplay() {
  const dateEl = document.getElementById("live-date");
  if (!dateEl) return;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date();
  const dateString = today.toLocaleDateString('es-AR', options);
  const formatted = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  dateEl.textContent = `${formatted} • RÍO GALLEGOS: CALCULANDO...`;

  fetch("https://api.open-meteo.com/v1/forecast?latitude=-51.6226&longitude=-69.2181&current_weather=true")
    .then(res => res.json())
    .then(data => {
      const temp = Math.round(data.current_weather.temperature);
      dateEl.textContent = `${formatted} • RÍO GALLEGOS: ${temp}°C`;
    })
    .catch(() => {
      dateEl.textContent = `${formatted} • RÍO GALLEGOS: S/D`;
    });
}

function initWeather() { }