// Gestión de noticias y renderizado
let newsData = [];

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Configurar fecha
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('es-ES', dateOptions);
  document.getElementById("current-date").textContent = today.charAt(0).toUpperCase() + today.slice(1);
  document.getElementById("year").textContent = new Date().getFullYear();

  // Cargar noticias desde localStorage si existen, o desde defaultNews
  const savedNews = localStorage.getItem("infoboee_news");
  if (savedNews) {
    try {
      newsData = JSON.parse(savedNews);
    } catch (e) {
      newsData = [...defaultNews];
    }
  } else {
    newsData = [...defaultNews];
  }

  renderNews(newsData);
  setupEvents();
});

// Renderizar noticias (portada y grilla)
function renderNews(articles) {
  const heroContainer = document.getElementById("hero-article");
  const gridContainer = document.getElementById("news-grid");

  if (!articles || articles.length === 0) {
    heroContainer.innerHTML = "<p>No hay noticias para mostrar.</p>";
    gridContainer.innerHTML = "";
    return;
  }

  // Noticia principal (la primera)
  const hero = articles[0];
  heroContainer.innerHTML = `
    <article class="hero-card" onclick="openArticle(${hero.id})">
      <img src="${hero.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800'}" alt="${hero.title}">
      <div class="hero-content">
        <span class="badge">${hero.category}</span>
        <h1 class="hero-title">${hero.title}</h1>
        <p class="hero-summary">${hero.summary}</p>
        <span class="card-meta">${hero.date}</span>
      </div>
    </article>
  `;

  // Noticias secundarias
  const secondaries = articles.slice(1);
  gridContainer.innerHTML = secondaries.map(item => `
    <article class="news-card" onclick="openArticle(${item.id})">
      <img src="${item.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600'}" alt="${item.title}">
      <div class="news-card-content">
        <span class="badge">${item.category}</span>
        <h3 class="news-card-title">${item.title}</h3>
        <p class="news-card-summary">${item.summary}</p>
        <span class="card-meta">${item.date}</span>
      </div>
    </article>
  `).join("");
}

// Filtrar por categoría
function filterCategory(cat) {
  // Actualizar clase activa en enlaces
  const links = document.querySelectorAll(".nav-links a");
  links.forEach(l => l.classList.remove("active"));
  event.target.classList.add("active");

  if (cat === "todas") {
    renderNews(newsData);
  } else {
    const filtered = newsData.filter(item => item.category === cat);
    renderNews(filtered);
  }
}

// Abrir modal de lectura completa
function openArticle(id) {
  const article = newsData.find(n => n.id === id);
  if (!article) return;

  document.getElementById("read-category").textContent = article.category;
  document.getElementById("read-title").textContent = article.title;
  document.getElementById("read-summary").textContent = article.summary;
  document.getElementById("read-img").src = article.image || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800";
  document.getElementById("read-body").textContent = article.body;

  document.getElementById("read-modal").style.display = "flex";
}

// Configuración de eventos y modales
function setupEvents() {
  const modal = document.getElementById("news-modal");
  const readModal = document.getElementById("read-modal");
  const openBtn = document.getElementById("open-modal-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const closeReadBtn = document.getElementById("close-read-btn");
  const form = document.getElementById("news-form");

  openBtn.addEventListener("click", () => modal.style.display = "flex");
  closeBtn.addEventListener("click", () => modal.style.display = "none");
  closeReadBtn.addEventListener("click", () => readModal.style.display = "none");

  // Cerrar al hacer clic fuera del contenido
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
    if (e.target === readModal) readModal.style.display = "none";
  });

  // Guardar nueva noticia
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("news-title").value.trim();
    const category = document.getElementById("news-category").value;
    const image = document.getElementById("news-img").value.trim() || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600";
    const summary = document.getElementById("news-summary").value.trim();
    const body = document.getElementById("news-body").value.trim();

    const newArticle = {
      id: Date.now(),
      title,
      category,
      image,
      summary,
      body,
      date: "Recién publicado"
    };

    // Agregar al inicio
    newsData.unshift(newArticle);
    localStorage.setItem("infoboee_news", JSON.stringify(newsData));

    renderNews(newsData);
    form.reset();
    modal.style.display = "none";
  });
}
