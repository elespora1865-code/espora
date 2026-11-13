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

  // Cargar noticias propias destacadas (prioridad absoluta en portada)
  cargarNoticiasPropias();

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
// 4. CONSUMO ROBUSTO DE FEEDS RSS (Backend Propio en Vercel + Fallback AllOrigins)
// ==========================================================================
async function fetchFeed(source) {
  const MI_BACKEND = "https://espora-delta.vercel.app/api/apirss-proxy";
  let textoXml = null;

  // 1. Intentar primero con nuestro backend proxy en Vercel
  try {
    const backendUrl = `${MI_BACKEND}?url=${encodeURIComponent(source.url)}`;
    const res = await fetch(backendUrl);
    if (res.ok) {
      textoXml = await res.text();
    }
  } catch (e) {
    // Si falla Vercel, pasamos al fallback
  }

  // 2. Fallback público AllOrigins si el backend no respondió
  if (!textoXml || !(textoXml.includes("<rss") || textoXml.includes("<feed") || textoXml.includes("<?xml"))) {
    try {
      const fallbackUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(source.url)}`;
      const res = await fetch(fallbackUrl);
      if (res.ok) {
        textoXml = await res.text();
      }
    } catch (e) {
      // El fallback falló
    }
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
        // Refrescar las noticias del bot siempre (no se cachean en sessionStorage)
        const noticiasBot = await cargarNoticiasBot();
        const sinBot = parsed.filter(a => !a.isBot);
        appState.allArticles = noticiasBot.length > 0 ? [...noticiasBot, ...sinBot] : parsed;
        appState.isLoading = false;
        if (refreshBtn) refreshBtn.classList.remove("spinning");
        if (liveIndicator) liveIndicator.textContent = "Cables en Vivo (Satelital)";

        renderizarNoticiaPrincipal(appState.allArticles);
        renderArticles(appState.activeCategory);
        updateBreakingTicker(appState.allArticles);
        botHijackCardClicks();
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

    // Cargar y prepend noticias del bot (silencioso si el índice no existe aún)
    const noticiasBot = await cargarNoticiasBot();
    if (noticiasBot.length > 0) {
      // Las noticias del bot van al inicio para garantizar visibilidad
      collectedArticles = [...noticiasBot, ...collectedArticles];
      console.info(`El Espora Bot: ${noticiasBot.length} noticia(s) cargadas desde el índice.`);
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
    botHijackCardClicks();

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
    // ── Tarjetas del bot: render especializado con slug y click directo ──
    if (article.isBot && article.botSlug) {
      const botCard = botCrearTarjeta({
        slug:     article.botSlug,
        titulo:   article.title,
        fecha:    article.pubDate,
        categoria: article.botCategoria || "GENERAL",
        imagen:   article.image
      });
      gridEl.appendChild(botCard);
      return;
    }

    // ── Tarjetas RSS estándar ──
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

// ==========================================================================
// 11. NOTICIAS BOT — INTEGRACIÓN CON EL ESPORA BOT (index_noticias.json)
// ==========================================================================

/**
 * Mapa de categorías del bot a las claves y etiquetas del sistema editorial.
 * Permite que las tarjetas bot adopten el mismo estilo de badges que el RSS.
 */
const BOT_CATEGORIA_MAP = {
  "URGENTE":        { key: "argentina",   label: "⚡ Urgente",           color: "#dc2626" },
  "LOCAL":          { key: "patagonia",   label: "🏔️ Patagonia",         color: "#1e3a8a" },
  "SANTA CRUZ":     { key: "patagonia",   label: "🏔️ Santa Cruz",        color: "#1e3a8a" },
  "POLITICA":       { key: "argentina",   label: "🗞️ Política Nacional",  color: "#1e293b" },
  "ECONOMIA":       { key: "argentina",   label: "💰 Economía",          color: "#0284c7" },
  "INTERNACIONAL":  { key: "geopolitica", label: "🌐 Internacional",      color: "#0f2c59" },
  "DEFENSA":        { key: "geopolitica", label: "🛡️ Defensa",           color: "#334155" },
  "ENERGIA":        { key: "argentina",   label: "⚡ Energía",           color: "#ea580c" },
  "AGRO":           { key: "argentina",   label: "🌾 Agro",              color: "#16a34a" },
};

/**
 * Convierte el texto plano del `articulo_web` generado por el bot en HTML limpio.
 * Usa marked.js si está disponible (incluido vía CDN), con un fallback inline
 * muy ligero que cubre los casos más comunes (títulos, párrafos, negritas).
 */
function botMarkdownToHtml(texto) {
  if (!texto) return "";

  // Preferir marked.js si fue cargado desde CDN
  if (typeof marked !== "undefined") {
    return marked.parse(texto, { breaks: true, gfm: true });
  }

  // Fallback: conversor mínimo inline
  return texto
    // Encabezados (hasta ###)
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Negritas e itálicas
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,     "<em>$1</em>")
    // Separadores
    .replace(/^---+$/gm, "<hr>")
    // Párrafos: cada bloque separado por línea vacía
    .split(/\n{2,}/)
    .map(bloque => bloque.trim())
    .filter(bloque => bloque && !bloque.startsWith("<h") && !bloque.startsWith("<hr"))
    .reduce((acc, bloque, _, arr) => {
      // Si ya tiene etiqueta HTML propia, no envolver
      if (/^<(h[1-6]|hr|ul|ol|li|blockquote)/.test(bloque)) return acc + bloque;
      return acc + `<p>${bloque.replace(/\n/g, " ")}</p>`;
    }, texto.split(/\n{2,}/).map(b => {
      const t = b.trim();
      if (/^#{1,3} /.test(t)) return t.replace(/^### (.+)$/, "<h3>$1</h3>").replace(/^## (.+)$/, "<h2>$1</h2>").replace(/^# (.+)$/, "<h1>$1</h1>");
      if (/^---+$/.test(t)) return "<hr>";
      return `<p>${t.replace(/\n/g, " ").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>")}</p>`;
    }).join(""));
}

/**
 * Formatea una fecha ISO a texto en español tipo "6 de noviembre, 2026".
 */
function botFormatearFecha(isoString) {
  if (!isoString) return "Fecha desconocida";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return isoString;
  }
}

/**
 * Genera el HTML de una tarjeta article-card para una noticia del bot.
 * Respeta exactamente las mismas clases CSS que usan las tarjetas RSS:
 * .article-card > .article-img-wrap + .article-content
 */
function botCrearTarjeta(item) {
  const meta = BOT_CATEGORIA_MAP[item.categoria] || { key: "argentina", label: item.categoria || "Redacción", color: "#1e293b" };
  const fechaFormateada = botFormatearFecha(item.fecha);
  const imgSrc = item.imagen || "assets/hero-patagonia.jpg";
  const fallback = "assets/hero-patagonia.jpg";

  const card = document.createElement("article");
  card.className = "article-card bot-noticia-card";
  card.setAttribute("data-bot-slug", item.slug);
  card.setAttribute("data-category-key", meta.key);

  card.innerHTML = `
    <div class="article-img-wrap">
      <img
        src="${escapeHtml(imgSrc)}"
        alt="${escapeHtml(item.titulo)}"
        class="article-img"
        loading="lazy"
        onerror="this.onerror=null; this.src='${fallback}';"
      >
      <span class="article-tag-badge" style="background: ${meta.color};">${meta.label}</span>
      <span class="article-source-tag">🤖 El Espora Bot</span>
    </div>
    <div class="article-content">
      <h3 class="article-card-title">${escapeHtml(item.titulo)}</h3>
      <p class="article-card-excerpt" style="font-style: italic; font-size: 0.85rem; color: var(--text-muted);">
        Análisis editorial exclusivo de redacción automatizada.
      </p>
      <div class="article-card-footer">
        <span>📅 ${fechaFormateada}</span>
        <span style="color: var(--gold-accent); font-weight: 700; font-size: 0.72rem;">✍️ Redacción Bot</span>
      </div>
    </div>
  `;

  card.addEventListener("click", () => botAbrirArticulo(item.slug));
  return card;
}

/**
 * Hace fetch del JSON detallado de una noticia y abre el modal de lectura
 * con el contenido completo del `articulo_web` renderizado como HTML.
 */
async function botAbrirArticulo(slug) {
  const modal = document.getElementById("reader-modal");
  const bodyContainer = document.getElementById("reader-modal-body");
  if (!modal || !bodyContainer) return;

  // Mostrar estado de carga dentro del modal
  bodyContainer.innerHTML = `
    <div style="text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
      <div style="font-size: 2rem; margin-bottom: 1rem;">📡</div>
      <p style="font-family: var(--font-sans); font-size: 0.9rem;">Recibiendo despacho del bot...</p>
    </div>
  `;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  const scrollEl = modal.querySelector(".reader-content-scroll");
  if (scrollEl) scrollEl.scrollTop = 0;

  try {
    let res = await fetch(`noticias_propias/${slug}.json`, { cache: "no-cache" });
    if (!res.ok) {
      res = await fetch(`noticias_bot/${slug}.json`, { cache: "no-cache" });
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const meta = BOT_CATEGORIA_MAP[data.categoria] || { label: data.categoria || "Redacción", color: "#1e293b" };
    const fechaFormateada = botFormatearFecha(data.fecha);
    const imgSrc = data.imagen || "assets/hero-patagonia.jpg";
    const cuerpoHtml = botMarkdownToHtml(data.articulo_web || data.texto_completo || "");
    const fuenteLink = data.link_original
      ? `<a href="${escapeHtml(data.link_original)}" target="_blank" rel="noopener noreferrer"
           style="color: var(--gold-accent);">
           Leer fuente original ↗
         </a>`
      : "";

    bodyContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
        <span class="reader-category" style="background: ${meta.color}; color: #fff; padding: 0.3rem 0.85rem; border-radius: 50px; font-family: var(--font-sans); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
          ${meta.label}
        </span>
        <span class="edition-badge">🤖 El Espora Bot</span>
      </div>

      <h1 class="reader-headline">${escapeHtml(data.titulo)}</h1>

      <div class="lead-meta" style="margin-bottom: 1.5rem;">
        <div class="author-info">
          <span>Fuente: <strong>${escapeHtml(data.fuente || "El Espora Bot")}</strong></span>
        </div>
        <span>📅 ${fechaFormateada}</span>
        <span style="color: var(--gold-accent);">✍️ Redacción Automatizada</span>
      </div>

      <div class="reader-img-wrap" style="margin-bottom: 1.75rem;">
        <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(data.titulo)}"
             style="width: 100%; border-radius: var(--radius-md); object-fit: cover; max-height: 400px;"
             onerror="this.src='assets/hero-patagonia.jpg'">
        <div class="image-caption">
          <span>Imagen asociada al despacho. Fuente: ${escapeHtml(data.fuente || "El Espora Bot")}.</span>
          <span>Redacción El Espora</span>
        </div>
      </div>

      <div class="reader-body-text" id="reader-dynamic-body"
           style="font-size: ${appState.currentFontSize}rem; line-height: 1.8;">
        ${cuerpoHtml}
      </div>

      ${fuenteLink ? `
      <div style="margin-top: 2.5rem; padding: 1.25rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-sm); border: var(--border-fine); text-align: center;">
        <p style="font-family: var(--font-sans); font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          Este artículo fue elaborado por el sistema editorial automatizado de <strong>El Espora</strong> a partir de la nota original.
        </p>
        ${fuenteLink}
      </div>` : ""}
    `;

    if (scrollEl) scrollEl.scrollTop = 0;

  } catch (err) {
    console.error("Error al cargar artículo bot:", err);
    bodyContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-family: var(--font-headline); font-size: 1.2rem; color: var(--gold-accent); margin-bottom: 0.5rem;">
          Despacho no disponible
        </p>
        <p style="font-size: 0.88rem;">No se pudo recuperar el artículo del bot. Intente más tarde.</p>
      </div>
    `;
  }
}

/**
 * Carga el índice maestro del bot y prepara las tarjetas para inyectarlas
 * en el grid principal. Se llama desde loadAllFeeds() antes de renderArticles().
 * Las noticias bot se normalizan al mismo formato de objeto que los artículos RSS
 * y se insertan al principio de appState.allArticles.
 */
async function cargarNoticiasBot() {
  try {
    let res = await fetch("noticias_propias/index_noticias.json", { cache: "no-cache" });
    if (!res.ok) {
      res = await fetch("noticias_bot/index_noticias.json", { cache: "no-cache" });
    }
    if (!res.ok) {
      console.info("El Espora Bot: índice no disponible aún (HTTP", res.status, "). Se omite sin error.");
      return [];
    }
    const lista = await res.json();
    if (!Array.isArray(lista) || lista.length === 0) return [];

    // Normalizar cada entrada del índice al formato de artículo del estado global
    return lista.map(item => {
      const meta = BOT_CATEGORIA_MAP[item.categoria] || { key: "argentina", label: item.categoria || "Redacción", color: "#1e293b" };
      return {
        // Identificador único para evitar colisiones con artículos RSS
        id: `bot-${item.slug}`,
        title: item.titulo,
        link: `#bot-${item.slug}`,
        sourceName: "El Espora Bot",
        sourceIcon: "🤖",
        categoryKey: meta.key,
        categoryLabel: meta.label,
        author: "Redacción Automatizada",
        pubDate: item.fecha,
        formattedDate: botFormatearFecha(item.fecha),
        image: item.imagen || "assets/hero-patagonia.jpg",
        fallbackImage: "assets/hero-patagonia.jpg",
        excerpt: `Análisis editorial de El Espora Bot · ${meta.label}`,
        content: "",
        botSlug: item.slug,
        botCategoria: item.categoria,   // ← categoría original para botCrearTarjeta
        isBot: true
      };
    });

  } catch (err) {
    console.warn("El Espora Bot: no se pudo cargar el índice.", err);
    return [];
  }
}

/**
 * ==========================================================================
 * CARGA DE NOTICIAS PROPIAS (EDITORIAL ESPORA - MÁXIMA PRIORIDAD)
 * Consulta 'noticias_propias/index_noticias.json' y renderiza de 3 a 5 tarjetas
 * destacadas directamente en #seccion-noticias-propias al cargar la página.
 * ==========================================================================
 */
async function cargarNoticiasPropias() {
  const seccion = document.getElementById("seccion-noticias-propias");
  if (!seccion) return;

  try {
    let res = await fetch("noticias_propias/index_noticias.json", { cache: "no-cache" });
    if (!res.ok) {
      // Fallback a noticias_bot por compatibilidad
      res = await fetch("noticias_bot/index_noticias.json", { cache: "no-cache" });
    }

    if (!res.ok) {
      console.info("Editorial Espora: índice de noticias propias aún no disponible (HTTP", res.status, ").");
      return;
    }

    const lista = await res.json();
    if (!Array.isArray(lista) || lista.length === 0) return;

    // Seleccionar entre 3 y 5 más recientes para no saturar
    const noticiasDestacadas = lista.slice(0, 4);

    const tarjetasHtml = noticiasDestacadas.map(item => {
      const meta = BOT_CATEGORIA_MAP[item.categoria] || { key: "argentina", label: item.categoria || "Editorial", color: "#1e293b" };
      const fecha = botFormatearFecha(item.fecha);
      const imgSrc = item.imagen || "assets/hero-patagonia.jpg";
      const fallback = "assets/hero-patagonia.jpg";

      return `
        <article class="article-card bot-noticia-card tarjeta-propia-destacada" data-bot-slug="${escapeHtml(item.slug)}" style="cursor: pointer;">
          <div class="article-img-wrap tarjeta-propia-img-wrap">
            <img
              src="${escapeHtml(imgSrc)}"
              alt="${escapeHtml(item.titulo)}"
              class="article-img"
              loading="lazy"
              onerror="this.onerror=null; this.src='${fallback}';"
            >
            <span class="article-tag-badge" style="background: ${meta.color};">${meta.label}</span>
            <span class="article-source-tag" style="background: var(--gold-accent); color: #fff; font-weight: 700;">★ Editorial Espora</span>
          </div>
          <div class="article-content tarjeta-propia-content">
            <h3 class="article-card-title tarjeta-propia-title">${escapeHtml(item.titulo)}</h3>
            <p class="article-card-excerpt" style="font-style: italic; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin: 0.6rem 0 1rem;">
              Crónica y cobertura exclusiva desarrollada por la redacción central de El Espora.
            </p>
            <div class="article-card-footer" style="margin-top: auto;">
              <span>📅 ${fecha}</span>
              <span style="color: var(--gold-accent); font-weight: 700; font-size: 0.78rem;">✍️ Redacción Espora</span>
            </div>
          </div>
        </article>
      `;
    }).join("");

    const grillaInterna = document.getElementById("grilla-noticias-propias");
    if (grillaInterna) {
      grillaInterna.innerHTML = tarjetasHtml;
    } else {
      seccion.innerHTML = `
        <div class="seccion-destacadas-header">
          <h2 class="seccion-destacadas-titulo">⭐ Editorial Espora — Lo Último</h2>
          <span class="seccion-destacadas-sub">Investigaciones y despachos prioritarios de nuestra redacción</span>
        </div>
        <div class="articles-grid news-grid destacadas-grid" id="grilla-noticias-propias">
          ${tarjetasHtml}
        </div>
      `;
    }

    // Vincular evento de clic a las tarjetas para abrir el lector modal completo
    seccion.querySelectorAll("[data-bot-slug]").forEach(card => {
      card.addEventListener("click", () => {
        const slug = card.getAttribute("data-bot-slug");
        if (slug) botAbrirArticulo(slug);
      });
    });

  } catch (err) {
    console.warn("Editorial Espora: no se pudieron cargar las noticias propias:", err);
  }
}

/**
 * Intercepta los clics en tarjetas bot dentro del grid para abrir
 * el modal de lectura correcto (fetch del JSON detallado), en vez del
 * openReaderModalWithArticle genérico que mostraría contenido vacío.
 * Se llama una sola vez después de cada render del grid.
 */
function botHijackCardClicks() {
  const grid = document.getElementById("articles-grid");
  if (!grid) return;

  // Usamos delegación de eventos en el grid para no tener que re-enlazar
  // en cada render (el listener sobrevive aunque el innerHTML cambie)
  if (grid._botListenerAttached) return;
  grid._botListenerAttached = true;

  grid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-bot-slug]");
    if (!card) return;
    e.stopPropagation();
    botAbrirArticulo(card.getAttribute("data-bot-slug"));
  });
}