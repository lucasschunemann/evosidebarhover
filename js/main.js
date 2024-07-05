document.addEventListener("DOMContentLoaded", function () {
  fetch("data/menus.json")
    .then((response) => response.json())
    .then((data) => {
      const menuContainer = document.getElementById("menu-container");
      menuContainer.innerHTML += generateMenu(data.Nos);
      initializeCustomScroll();
      initializeHover();
    })
    .catch((error) => console.error("Erro ao carregar o menu:", error));
});

function generateMenu(nodes) {
  let html = "";
  nodes.forEach((node) => {
    html += `<li class="dynamic-menu-item">
                  <div class="iocn-link">
                    <a href="${node.href || "#"}" onclick="loadContent('${
      node.data?.TEC_ProgramaCodigo || ""
    }.html')">
                      <span class="link_name">${node.text.trim()}</span>
                    </a>
                    ${
                      node.children && node.children.length > 0
                        ? '<i class="bx bxs-chevron-right arrow"></i>'
                        : '<button class="favorite-button" onclick="toggleFavorite(event, this)"><i class="bx bxs-star"></i></button>'
                    }
                  </div>
                  ${
                    node.children && node.children.length > 0
                      ? generateSubMenu(node.children)
                      : ""
                  }
                </li>`;
  });
  return html;
}

function generateSubMenu(children) {
  let html = '<ul class="sub-menu">';
  children.forEach((child) => {
    html += `<li>
                  <a href="${child.href || "#"}" onclick="loadContent('${
      child.data?.TEC_ProgramaCodigo || ""
    }.html')">
                    <span class="link_name">${child.text.trim()}</span>
                    ${
                      child.children && child.children.length > 0
                        ? '<i class="bx bxs-chevron-right arrow"></i>'
                        : '<button class="favorite-button" onclick="toggleFavorite(event, this)"><i class="bx bxs-star"></i></button>'
                    }
                  </a>
                  ${
                    child.children && child.children.length > 0
                      ? generateSubMenu(child.children)
                      : ""
                  }
                </li>`;
  });
  html += "</ul>";
  return html;
}

function initializeCustomScroll() {
  const sidebarContent = document.getElementById("sidebar-content");
  const menuContainer = document.querySelector(".nav-links");
  let isDown = false;
  let startY;
  let scrollTop;

  sidebarContent.addEventListener("mousedown", (e) => {
    isDown = true;
    startY = e.pageY - sidebarContent.offsetTop;
    scrollTop = menuContainer.offsetTop;
  });

  sidebarContent.addEventListener("mouseleave", () => {
    isDown = false;
  });

  sidebarContent.addEventListener("mouseup", () => {
    isDown = false;
  });

  sidebarContent.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const y = e.pageY - sidebarContent.offsetTop;
    const walk = (y - startY) * 3;
    menuContainer.style.top = `${scrollTop + walk}px`;
    constrainScroll();
  });

  sidebarContent.addEventListener("wheel", (event) => {
    event.preventDefault();
    menuContainer.style.top = `${menuContainer.offsetTop - event.deltaY}px`;
    constrainScroll();
  });

  function constrainScroll() {
    const maxScroll = sidebarContent.clientHeight - menuContainer.scrollHeight;
    if (parseInt(menuContainer.style.top) > 0) {
      menuContainer.style.top = "0px";
    } else if (parseInt(menuContainer.style.top) < maxScroll) {
      menuContainer.style.top = `${maxScroll}px`;
    }
  }
}

function initializeHover() {
  const menuItems = document.querySelectorAll(".sidebar .nav-links li");

  menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const subMenu = item.querySelector(".sub-menu");
      if (subMenu) {
        subMenu.style.display = "block";
      }
    });

    item.addEventListener("mouseleave", () => {
      const subMenu = item.querySelector(".sub-menu");
      if (subMenu) {
        subMenu.style.display = "none";
      }
    });
  });
}

function loadContent(url) {
  if (!url) return;
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;
    })
    .catch((error) => console.error("Erro ao carregar o conteúdo:", error));
}

function toggleFavorite(event, button) {
  event.stopPropagation();
  button.classList.toggle("favorited");
  console.log(
    "Favorito toggled para:",
    button.previousElementSibling.innerText
  );
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme");
  const logoName = document.querySelector(".logo-details .logo_name");
  if (document.body.classList.contains("light-theme")) {
    logoName.style.color = "#333";
  } else {
    logoName.style.color = "#ecf0f1";
  }
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const homeSection = document.querySelector(".home-section");
  sidebar.classList.toggle("hide");
  homeSection.classList.toggle("expand");
}
