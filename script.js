const squares = document.querySelectorAll('.square');
const home = document.querySelector('#home');
const content = document.querySelector('#content');

// Kaudzes konteiners
const stackContainer = document.createElement('div');
stackContainer.classList.add('stack');
document.body.appendChild(stackContainer);

let movers = [];

// Inicializācija: nejauša pozīcija un ātrums
squares.forEach(sq => {
  let x = Math.random() * (window.innerWidth - sq.offsetWidth);
  let y = Math.random() * (window.innerHeight - sq.offsetHeight);

  let dx = (Math.random() * 1 + 0.3) * (Math.random() < 0.5 ? -1 : 1);
  let dy = (Math.random() * 1 + 0.3) * (Math.random() < 0.5 ? -1 : 1);

  movers.push({el: sq, x, y, dx, dy});

  // Klikšķis uz kvadrāta (haotiskajā režīmā)
  sq.addEventListener('click', () => {
    home.classList.add('hidden');
    loadPage(sq.dataset.file); // ielādē lapas saturu
    toStack(sq.dataset.file);
  });
});

// Haotiskā kustība
function animate() {
  movers.forEach(m => {
    if (!m.el.classList.contains('stack-mode')) {
      m.x += m.dx;
      m.y += m.dy;

      if (m.x <= 0 || m.x >= window.innerWidth - m.el.offsetWidth) {
        m.dx *= -1;
        m.x = Math.max(0, Math.min(m.x, window.innerWidth - m.el.offsetWidth));
      }
      if (m.y <= 0 || m.y >= window.innerHeight - m.el.offsetHeight) {
        m.dy *= -1;
        m.y = Math.max(0, Math.min(m.y, window.innerHeight - m.el.offsetHeight));
      }

      m.el.style.left = m.x + 'px';
      m.el.style.top = m.y + 'px';
    }
  });
  requestAnimationFrame(animate);
}
animate();

// Ielādē lapas saturu ar fetch
function loadPage(file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
      content.classList.remove('hidden');

      // Atpakaļ poga lapas saturā
      const backBtn = content.querySelector('.back');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          content.classList.add('hidden');
          home.classList.remove('hidden');
          backToChaos();
        });
      }
    });
}

// Pārējie kvadrāti sabirst kaudzē apakšā
function toStack(exceptFile) {
  movers.forEach((m, i) => {
    if (m.el.dataset.file !== exceptFile) {
      m.el.classList.add('stack-mode');
      stackContainer.appendChild(m.el);

      const offsetX = (Math.random() * 400) - 200;
      const offsetY = Math.min(i * 20 + Math.random() * 40, window.innerHeight / 3);

      m.el.style.position = 'absolute';
      m.el.style.left = `calc(50% + ${offsetX}px)`;
      m.el.style.top = `calc(100% - 20px - ${offsetY}px)`;
      m.el.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;

      // Hover efekts: paceļ pilnu kvadrātu virs apakšējās malas
      m.el.onmouseenter = () => {
        m.el.style.top = `calc(100% - ${m.el.offsetHeight}px - 5px)`;
        m.el.style.transform = 'rotate(0deg)';
        m.el.style.zIndex = 50;
      };
      m.el.onmouseleave = () => {
        m.el.style.top = `calc(100% - 20px - ${offsetY}px)`;
        m.el.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
        m.el.style.zIndex = '';
      };

      // Klikšķis uz kvadrāta kaudzē → ielādē lapu
      m.el.onclick = () => {
        loadPage(m.el.dataset.file);
        m.el.remove();
      };
    }
  });
}

// Atgriežamies uz haotisko kustību
function backToChaos() {
  squares.forEach(sq => {
    if (!home.contains(sq)) home.appendChild(sq);
    sq.classList.remove('stack-mode');
    sq.style.transform = '';
    sq.onmouseenter = null;
    sq.onmouseleave = null;
    sq.onclick = null;
  });

  movers.forEach(m => {
    m.x = Math.random() * (window.innerWidth - m.el.offsetWidth);
    m.y = Math.random() * (window.innerHeight - m.el.offsetHeight);
    m.el.style.left = m.x + 'px';
    m.el.style.top = m.y + 'px';
  });
}
