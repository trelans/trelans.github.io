(() => {
  const projects = {
    "push-stacks": {
      title: "Push Stacks",
      category: "Mobile game",
      year: "2021",
      platform: "Unity 3D",
      lede: "A bright runner about choosing multipliers, building a stronger stack, and using that momentum at the finish.",
      cover: "img/projects/StackPush/1.jpg",
      overview: "Push Stacks turns simple arithmetic choices into a readable runner loop. Gates change the size of the player group, obstacles test positioning, and the accumulated stack becomes the payoff in a final push.",
      challenge: "Keep the level readable while changing group size, color, and skybox treatment at speed.",
      approach: "A custom transparent material, randomized sky palettes, and high-contrast gate values keep the action clear without slowing the run.",
      tags: ["Unity 3D", "C#", "Game design", "Shaders", "3D art"],
      gallery: ["img/projects/StackPush/1.jpg", "img/projects/StackPush/2.jpg", "img/projects/StackPush/3.jpg"],
      next: "diy-cocktail"
    },
    "diy-cocktail": {
      title: "DIY Cocktail",
      category: "Mobile game",
      year: "2021",
      platform: "Unity 3D",
      lede: "A tactile drink-making game that combines ingredient selection, liquid effects, decoration, and a playful reveal.",
      cover: "img/projects/Cocktail/d.png",
      overview: "DIY Cocktail is a compact creative toy built around mixing a one-of-a-kind drink. Players cut fruit, choose liquids and glitter, then finish the glass with a decorative garnish.",
      challenge: "Create convincing liquid and glitter effects while keeping the interaction lightweight enough for a casual mobile game.",
      approach: "The prototype used dedicated shader studies before the final mechanics were assembled around quick, satisfying steps and clear visual feedback.",
      tags: ["Unity 3D", "C#", "Shader development", "Interaction design", "3D art"],
      gallery: ["img/projects/Cocktail/1.jpg", "img/projects/Cocktail/2.jpg", "img/projects/Cocktail/4.jpg"],
      next: "shooting-balls"
    },
    "shooting-balls": {
      title: "Shooting Balls",
      category: "Mobile game",
      year: "2021",
      platform: "Unity 3D",
      lede: "A compact aim-and-multiply puzzle where every shot changes the number of balls available for the next target.",
      cover: "img/projects/ShootingBalls/icon.png",
      overview: "Shooting Balls combines an aiming gesture with arithmetic choices. The player lines up a basket, passes through multiplier gates, and builds enough volume to clear the level.",
      challenge: "Make the balls feel lively and responsive without sacrificing clarity when many objects appear at once.",
      approach: "Paint splashes, impact feedback, and deliberate color changes reinforce successful shots while the gate layout keeps the calculation legible.",
      tags: ["Unity 3D", "C#", "Puzzle design", "Particle effects", "Mobile UX"],
      gallery: ["img/projects/ShootingBalls/1.gif", "img/projects/ShootingBalls/2.gif", "img/projects/ShootingBalls/3.gif"],
      next: "type-it"
    },
    "type-it": {
      title: "Type It 3D",
      category: "Mobile game",
      year: "2021",
      platform: "Unity 3D",
      lede: "A typing runner that turns a mechanical keyboard into an obstacle course and rewards rhythm at the finish.",
      cover: "img/projects/TypeIt/finger.PNG",
      overview: "Type It 3D translates keyboard input into movement through a short arcade course. Each correct key advances the run, while missed timing limits the final score multiplier.",
      challenge: "Connect physical-feeling key feedback with readable on-screen prompts and continuous movement.",
      approach: "The prototype focuses on crisp sound, clear letter states, and a simple input loop that can be understood within seconds.",
      tags: ["Unity 3D", "C#", "Input systems", "Sound design", "Game feel"],
      gallery: ["img/projects/TypeIt/1.gif", "img/projects/TypeIt/finger.PNG"],
      next: "fill-in"
    },
    "fill-in": {
      title: "Fill In",
      category: "Mobile game",
      year: "2021",
      platform: "Unity 3D",
      lede: "A one-stroke spatial puzzle about covering every open tile without crossing an already completed path.",
      cover: "img/projects/FillIn/icon.png",
      overview: "Fill In presents a compact board and one rule: cover every available cell. The path cannot cross itself, turning a simple swipe into a planning problem.",
      challenge: "Communicate valid movement and completion clearly on a small screen with very little interface chrome.",
      approach: "Strong tile states, a restricted palette, and a celebratory particle finish keep the puzzle legible and rewarding.",
      tags: ["Unity 3D", "C#", "Puzzle systems", "Level design", "Particles"],
      gallery: ["img/projects/FillIn/icon.png", "img/projects/FillIn/gif.gif"],
      next: "popping-balloons"
    },
    "popping-balloons": {
      title: "Popping Balloons",
      category: "Mobile game",
      year: "2021",
      platform: "Unity 3D",
      lede: "A colorful obstacle runner built around the simple satisfaction of guiding a needle through rows of balloons.",
      cover: "img/projects/PoppingBalloons/2.PNG",
      overview: "Popping Balloons uses a single drag gesture to steer through hazards and line up satisfying chains of balloon pops. The course gradually adds tighter gaps and timing challenges.",
      challenge: "Build a first 3D mobile prototype while keeping the collision feedback immediate and visually generous.",
      approach: "Focused controls, layered particles, and distinct obstacle silhouettes make the interaction easy to read at runner speed.",
      tags: ["Unity 3D", "C#", "Mobile controls", "3D art", "Particle effects"],
      gallery: ["img/projects/PoppingBalloons/1.PNG", "img/projects/PoppingBalloons/2.PNG", "img/projects/PoppingBalloons/3.PNG"],
      next: "reach-to-space"
    },
    "reach-to-space": {
      title: "Reach to Space",
      category: "Educational game",
      year: "2021",
      platform: "Unity 2D",
      lede: "A space journey that folds quick arithmetic questions into fuel management and arcade movement.",
      cover: "img/projects/ReachToSpace/icon.jpg",
      overview: "Reach to Space was created for an education-focused startup. Players guide a rocket, collect fuel, avoid hazards, and answer short math questions to continue the trip.",
      challenge: "Balance learning prompts with movement so neither interrupts the pace of the other.",
      approach: "Short question breaks, a persistent fuel goal, and a clear space-themed interface connect the educational layer to the core journey.",
      tags: ["Unity 2D", "C#", "Educational design", "UI design", "Arcade systems"],
      gallery: ["img/projects/ReachToSpace/2.gif", "img/projects/ReachToSpace/3.gif", "img/projects/ReachToSpace/4.gif"],
      next: "union-app"
    },
    "union-app": {
      title: "Union App",
      category: "Mobile application",
      year: "2021",
      platform: "Android",
      lede: "A collaborative social application concept for bringing campus discussions, activities, and direct messages into one place.",
      cover: "img/projects/Union/icon.png",
      overview: "Union App explored a structured social network with accounts, posts, tags, messaging, notifications, activity discovery, and profile tools. It was developed as a team-based Android project.",
      challenge: "Coordinate a broad feature set while keeping Firebase data flows, search, filtering, and interface states consistent.",
      approach: "The experience was divided into focused flows, supported by reusable interface patterns and database queries tailored to each content type.",
      tags: ["Android Studio", "Java", "Firebase", "Product design", "Teamwork"],
      gallery: [],
      next: "emoji-puzzle"
    },
    "emoji-puzzle": {
      title: "Emoji Puzzle",
      category: "Mobile game",
      year: "2020",
      platform: "Android",
      lede: "A word puzzle that asks players to decode familiar expressions from compact emoji clues.",
      cover: "img/projects/EmojiBil/icon.png",
      overview: "Emoji Puzzle pairs visual clues with a letter-bank interface. The project evolved through multiple interface revisions and added a purchase flow for optional content.",
      challenge: "Keep the clue, available letters, and answer state clear across many small Android screen sizes.",
      approach: "A simple visual hierarchy and immediate correct-answer feedback let the emoji clue remain the center of each round.",
      tags: ["Android Studio", "Java", "XML", "Puzzle design", "Mobile UI"],
      gallery: [],
      next: "confess-it"
    },
    "confess-it": {
      title: "Confess It",
      category: "Web application",
      year: "2019",
      platform: "Web",
      lede: "A full-stack social-network prototype with anonymous posting, profiles, messaging, notifications, and account recovery.",
      cover: "img/projects/ConfessIt/5.PNG",
      overview: "Confess It explored the architecture behind a focused social platform. The prototype includes authentication, verified accounts, posts, profile search, private messages, notifications, settings, and password recovery.",
      challenge: "Design and connect a large set of account and content features while learning a full-stack web workflow.",
      approach: "The system was built feature by feature around a relational data model, then joined through a consistent navigation and account layer.",
      tags: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      gallery: [],
      next: "mr-robot"
    },
    "mr-robot": {
      title: "Mr. Robot Chat Game",
      category: "Mobile game",
      year: "2015",
      platform: "Android",
      lede: "An early conversational game prototype built around branching replies and a stylized robot character.",
      cover: "img/projects/MrRobot/icon.PNG",
      overview: "Mr. Robot Chat Game is an early Android experiment in conversational interaction. It uses scripted responses and a compact chat interface to turn a simple conversation into a character-driven experience.",
      challenge: "Translate a branching dialogue idea into a complete mobile application with clear states and packaged assets.",
      approach: "A deliberately limited conversation model kept the first version manageable and created room to focus on interface flow and character tone.",
      tags: ["Android Studio", "Java", "Dialogue systems", "2D art", "Mobile UI"],
      gallery: [],
      next: "laser-defender"
    },
    "laser-defender": {
      title: "Laser Defender",
      category: "Learning project",
      year: "2021",
      platform: "Unity 2D",
      lede: "A classic arcade shooter study focused on enemy waves, projectiles, scoring, and moment-to-moment feedback.",
      cover: "img/projects/LazerDefenser/icon.PNG",
      overview: "Laser Defender was built as a structured Unity learning project. The familiar shooter format provided a clear foundation for practicing scenes, spawning, collisions, audio, and score systems.",
      challenge: "Coordinate multiple real-time systems while keeping enemy movement and projectile behavior predictable.",
      approach: "Small reusable components separate player input, enemy paths, damage, scoring, and scene flow.",
      tags: ["Unity 2D", "C#", "Arcade systems", "Scene flow"],
      gallery: [],
      next: "block-breaker"
    },
    "block-breaker": {
      title: "Block Breaker",
      category: "Learning project",
      year: "2021",
      platform: "Unity 2D",
      lede: "A compact brick-breaker study covering physics, level progression, audio cues, and reusable game-state logic.",
      cover: "img/projects/BlockBreaker/icon.PNG",
      overview: "Block Breaker uses a familiar arcade rule set to explore core Unity workflows. Paddle control, ball physics, block states, scoring, and scene transitions are kept deliberately focused.",
      challenge: "Tune a physics-driven loop so the ball feels lively without becoming unpredictable or getting trapped.",
      approach: "Controlled velocity adjustments and clear block feedback create a dependable foundation for level progression.",
      tags: ["Unity 2D", "C#", "Physics", "Level systems"],
      gallery: [],
      next: "push-stacks"
    }
  };

  const page = document.querySelector("[data-project]");
  if (!page) return;

  const project = projects[page.dataset.project];
  if (!project) {
    page.innerHTML = '<section class="archive-page shell"><div class="archive-card"><p class="eyebrow">Project archive</p><h1>Case study unavailable.</h1><p>This project record could not be loaded.</p><a class="button button-arrow" href="works.html">Browse projects</a></div></section>';
    return;
  }

  const next = projects[project.next];
  const fileByKey = {
    "push-stacks": "StackPush.html",
    "diy-cocktail": "Cocktail.html",
    "shooting-balls": "ShootingBalls.html",
    "type-it": "TypeIt.html",
    "fill-in": "FillIn.html",
    "popping-balloons": "PoppingBalloons.html",
    "reach-to-space": "ReachToSpace.html",
    "union-app": "Union.html",
    "emoji-puzzle": "EmojiBil.html",
    "confess-it": "ConfessIt.html",
    "mr-robot": "MrRobot.html",
    "laser-defender": "LazerDefenser.html",
    "block-breaker": "BlockBreaker.html"
  };

  const accents = {
    "push-stacks": "#c8ff5c",
    "diy-cocktail": "#ff7e75",
    "shooting-balls": "#64d4ff",
    "type-it": "#a58dff",
    "fill-in": "#c8ff5c",
    "popping-balloons": "#ff7e75",
    "reach-to-space": "#64d4ff",
    "union-app": "#a58dff",
    "emoji-puzzle": "#ffcc5c",
    "confess-it": "#64d4ff",
    "mr-robot": "#a58dff",
    "laser-defender": "#ff7e75",
    "block-breaker": "#c8ff5c"
  };

  document.title = `${project.title} — Trelans`;
  page.style.setProperty("--project-accent", accents[page.dataset.project] || "#c8ff5c");
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = project.lede;

  const tags = project.tags.map((tag) => `<li>${tag}</li>`).join("");
  const gallery = project.gallery.length
    ? `<section class="gallery-section shell" aria-labelledby="gallery-title">
        <div class="gallery-heading">
          <div><p class="eyebrow">Inside the build</p><h2 id="gallery-title">Gameplay and interface.</h2></div>
          <p>Selected frames show the interaction, visual language, and moment-to-moment feedback in context.</p>
        </div>
        <div class="project-gallery">
          ${project.gallery.map((image, index) => `<figure class="gallery-item"><img src="${image}" alt="Gameplay and interface view ${index + 1} from ${project.title}" loading="lazy"></figure>`).join("")}
        </div>
      </section>`
    : "";

  page.innerHTML = `
    <section class="project-head shell">
      <a class="project-back" href="works.html">Projects / ${project.title}</a>
      <div class="project-head-grid">
        <div class="project-title-block">
        <p class="project-kicker">${project.category}</p>
        <h1>${project.title}</h1>
        <p>${project.lede}</p>
          <ul class="tag-list" aria-label="Tools and disciplines">${tags}</ul>
        </div>
        <dl class="project-facts">
          <div><dt>Built</dt><dd>${project.year}</dd></div>
          <div><dt>Platform</dt><dd>${project.platform}</dd></div>
          <div><dt>Format</dt><dd>Case study</dd></div>
        </dl>
      </div>
    </section>
    <figure class="project-cover shell">
      <div class="project-cover-media"><img src="${project.cover}" alt="Featured visual from ${project.title}"></div>
      <figcaption><span>Featured build</span><span>${project.category} / ${project.platform}</span></figcaption>
    </figure>
    <section class="project-overview shell" aria-labelledby="overview-title">
      <div class="overview-index">
        <span>01</span>
        <p class="eyebrow">Case study</p>
        <h2 id="overview-title">Core loop and build choices.</h2>
      </div>
      <div class="project-story">
        <p>${project.overview}</p>
        <div class="story-grid">
          <article class="story-card"><span>Constraint</span><h3>The challenge</h3><p>${project.challenge}</p></article>
          <article class="story-card"><span>Build decision</span><h3>The approach</h3><p>${project.approach}</p></article>
        </div>
      </div>
    </section>
    ${gallery}
    <section class="next-project shell">
      <a class="next-project-card" href="${fileByKey[project.next]}">
        <img src="${next.cover}" alt="" loading="lazy">
        <span class="next-project-card-content"><span><p>Next project</p><h2>${next.title}</h2></span><span class="round-link" aria-hidden="true">↗</span></span>
      </a>
    </section>`;
})();
