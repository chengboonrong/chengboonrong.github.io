// Everything the site says lives here. Every claim traces to the CV (28 Oct 2026, with the Nexstream end date from the owner) or a repo.
// House style: no em or en dashes in visible text.

export const site = {
  url: 'https://chengboonrong.github.io',
  name: 'Chris Cheng',
  legalName: 'Boon Rong Cheng',
  roles: ['Software Engineer', 'Creative Developer'],
  headline: 'Engineering the Unexpected.',
  intro:
    'I design and build intelligent software, scalable applications, and immersive digital experiences, transforming ambitious ideas into working products.',
  description:
    'Chris Cheng is a senior software engineer in Kuala Lumpur, building full-stack, mobile, AI and real-time 3D software. Open to remote and contract work.',
  email: 'chengchris8715@gmail.com',
  github: 'https://github.com/chengboonrong',
  linkedin: 'https://www.linkedin.com/in/toshio97/',
  resume: '/Chris-Cheng-Resume.pdf',
  location: 'Kuala Lumpur, Malaysia (UTC+8)',
}

export const about = {
  title: 'I like the hard part.',
  paragraphs: [
    'I build things that should not work in a browser, such as a whole city you can drive through. The habit is the same at work: measure the real problem, own the result, and keep the design simple.',
  ],
  facts: [
    { value: '6+', label: 'years shipping production software' },
  ],
}

export type Role = { company: string; title: string; period: string; place: string; points: string[] }

export const experience: Role[] = [
  {
    company: 'RJGF Global',
    title: 'Senior Software Engineer (Architecture Track)',
    period: 'Aug 2026 - Present',
    place: 'Greater Kuala Lumpur',
    points: [
      'Delivered plant performance and KPI features for a solar energy operations platform across backend services, web dashboards and mobile, with Playwright end-to-end coverage.',
      'Built tag-driven mobile release pipelines in GitHub Actions, including signed Android releases, iOS packaging and signing, and ARM64 Android emulator smoke tests.',
      'Designed change-aware CI gates with parallel E2E tests, type checking, linting, and production promotion guarded by automated tests and rollback.',
      'Documented architecture decisions and message-queue flows, and introduced a specification-driven AI-agent workflow for engineering delivery.',
    ],
  },
  {
    company: 'Nexstream Sdn Bhd',
    title: 'Team Lead, Technical',
    period: 'Apr 2026 - Jul 2026',
    place: 'Petaling Jaya',
    points: [
      'Led 8 developers across Flutter mobile and Java backend teams, coordinating multiple concurrent projects and technical delivery.',
      'Owned architectural decisions, code review practices, technical planning and stakeholder alignment for scalable client solutions.',
      'Led AI and LLM integration and automation initiatives using Gemini API, LangChain and LangGraph, and guided CI/CD, production reliability and mentoring.',
    ],
  },
  {
    company: 'Nexstream Sdn Bhd',
    title: 'Assistant Team Lead',
    period: 'Aug 2025 - Apr 2026',
    place: 'Petaling Jaya',
    points: [
      'Supported end-to-end delivery and technical direction for mobile, backend and AI-driven systems, translating business needs into production-ready designs.',
      'Contributed to architecture, coding standards, production deployments, team reviews and developer mentoring.',
    ],
  },
  {
    company: 'Nexstream Sdn Bhd',
    title: 'Senior Software Engineer',
    period: 'Aug 2024 - Aug 2025',
    place: 'Petaling Jaya',
    points: [
      'Built complex full-stack features and contributed to architecture refactoring for more maintainable applications.',
      'Optimized database queries and backend processing, reviewed code and resolved production performance issues.',
    ],
  },
  {
    company: 'Nexstream Sdn Bhd',
    title: 'Software Engineer',
    period: 'Nov 2020 - Aug 2024',
    place: 'Petaling Jaya',
    points: [
      'Developed and maintained production mobile applications, primarily with Flutter, for client-facing business systems.',
      'Integrated third-party APIs and payment systems, troubleshot production issues and improved existing codebases.',
    ],
  },
  {
    company: 'INVENTECH',
    title: 'AI Research Engineer',
    period: 'Feb 2020 - Aug 2020',
    place: 'Puchong',
    points: ['Worked on machine-learning models for weather forecasting, visual chip-defect recognition and video anomaly detection.'],
  },
  {
    company: 'BeacoHealth',
    title: 'Computer Science Intern, R&D',
    period: 'Sep 2018 - Jun 2019',
    place: 'Petaling Jaya',
    points: ['Developed an interactive web application connected to an AI assistant, and contributed to an open-source cloud operating system.'],
  },
]

export const education = {
  school: 'University of Malaya',
  degree: 'Bachelor of Computer Science, academic background in Artificial Intelligence',
  period: '2016 - 2020',
}

export const expertise = [
  {
    title: 'Mobile',
    body: 'Production Flutter apps, Android and iOS releases, signing and CI pipelines.',
    tools: ['Flutter', 'Dart', 'Firebase Cloud Messaging', 'GitHub Actions'],
  },
  {
    title: 'Backend and APIs',
    body: 'Java and Python services, REST APIs, payment and third-party integrations, query tuning.',
    tools: ['Java', 'Spring Boot', 'Python', 'REST', 'Firestore'],
  },
  {
    title: 'Frontend',
    body: 'Web dashboards and product interfaces, with end-to-end coverage.',
    tools: ['TypeScript', 'JavaScript', 'Vue 3', 'Playwright'],
  },
  {
    title: 'AI and automation',
    body: 'LLM features in real systems, agent workflows and automation pipelines.',
    tools: ['LangChain', 'LangGraph', 'Gemini API', 'n8n'],
  },
  {
    title: 'Real-time 3D',
    body: 'Open-world rendering in the browser, profiled on real phones and held to download budgets.',
    tools: ['Three.js', 'WebGPU', 'WebGL2', 'WebAssembly'],
  },
  {
    title: 'Architecture and delivery',
    body: 'System design, code review standards, CI gates, production reliability and mentoring.',
    tools: ['System design', 'CI/CD', 'Code review', 'Mentoring'],
  },
]

export type Link = { label: string; href: string }
export type Shot = { src: string; alt: string; w: number; h: number }
export type Challenge = { title: string; problem: string; solution: string; result?: string }

export type Project = {
  slug: string
  index: string
  name: string
  kind: string
  year: string
  summary: string
  /** Lid Awake has no imagery: its card shows its real source instead. */
  cover?: Shot
  video?: { src: string; poster: string; label: string }
  live?: Link
  repo: Link
  /** A live page that may be framed on the case study, behind a click. */
  embed?: { src: string; title: string; note: string }
  overview: string
  approach: string[]
  flow: { title: string; steps: string[] }
  stack: string[]
  challenges: Challenge[]
  outcome: string
  limits?: string[]
  gallery: (Shot & { caption: string })[]
}

const m = (name: string) => `/media/${name}`

export const projects: Project[] = [
  {
    slug: 'kl-rush',
    index: '01',
    name: 'KL Rush',
    kind: 'Open-world browser game',
    year: '2026',
    summary: 'An open-world Kuala Lumpur you can drive, ride and walk through, in a browser tab or on a phone.',
    cover: { src: m('kl-towers-dusk-1600.webp'), alt: 'KL Rush: KL Tower and the Petronas Twin Towers lit at dusk above the city, with mountains behind', w: 1600, h: 900 },
    video: { src: m('kl-drive-loop.mp4'), poster: m('kl-drive-poster.webp'), label: 'Six seconds of KL Rush gameplay: driving up the mountain road through the forest' },
    live: { label: 'Play KL Rush', href: 'https://kl-rush.vercel.app' },
    repo: { label: 'Public preview repo', href: 'https://github.com/chengboonrong/kl-rush-preview' },
    overview:
      'KL Rush is a free open-world game of Kuala Lumpur that runs in a browser, with 22 story missions, traffic, police chases, trains, side jobs, day and night, and tropical rain. It also ships as a desktop app for Windows, macOS and Linux. The game source is private; the preview repo holds the release notes and feedback.',
    approach: [
      'Rules and state machines live in pure modules with no DOM and no Three.js, so plain Node tests can run them.',
      'Optional features load through dynamic imports behind flags, and each import has a reviewed size cap in CI.',
      'Performance work starts with frame-by-frame traces in WebKit at iPhone size, because that is the engine players on iPhone run.',
    ],
    flow: {
      title: 'How a change reaches players',
      steps: ['Specification', 'Pure logic and tests', 'Size budgets', 'Smoke test in a real browser', 'Automatic deploy', 'Error reports'],
    },
    stack: ['Three.js', 'WebGPU with WebGL2 fallback', 'JavaScript modules, checked by TypeScript', 'Jolt physics in WebAssembly', 'Vite', 'Electron', 'Vercel', 'Sentry', 'Blender'],
    challenges: [
      {
        title: 'Stutter that averages could not see',
        problem: 'Play felt rough on iPhone, but load times and average frame rate showed nothing.',
        solution: 'Per-frame tracing in WebKit tied each slow frame to its cause: every car was building its own shader graph. Vehicles now share one graph, and compiled programs are kept alive between uses.',
      },
      {
        title: 'Keeping iPhones on the fast renderer',
        problem: 'iPhones run far better on WebGPU than on WebGL2, and one lost GPU device used to move a phone to WebGL2 for good.',
        solution: 'Safari can drop the GPU device under memory pressure, and one such loss should not cost a player that speed. Now only a repeated visible loss switches renderer.',
      },
      {
        title: 'A whole city in a small download',
        problem: 'A browser game loses players while it loads, and every new feature adds code.',
        solution: 'CI fails the build when a chunk passes its gzip cap, so a feature has to earn its size. Content lives in a cache that survives deploys, with retries for bad connections.',
      },
      {
        title: 'Deciding what not to build',
        problem: 'World streaming and occlusion culling are the textbook answers for an open world.',
        solution: 'Profiling rejected both: geometry was a small part of peak load memory, and city areas are too large to hide. Instead the whole city stays loaded and each area is culled by distance. GPS uses a small custom A* on a road graph, with no routing library.',
      },
    ],
    outcome: 'Public and playable, with regular releases. It runs on desktop browsers, phones and tablets, and as a desktop app.',
    limits: ['The Windows and Linux desktop apps have not yet been tried on real machines.', 'The apps are not signed by Apple or Microsoft.'],
    gallery: [
      { src: m('kl-street-chase-1280.webp'), alt: 'Two police cars chasing a red car through a KL junction under a passing monorail', w: 1280, h: 720, caption: 'A police chase under the monorail.' },
      { src: m('kl-alor-dusk-1600.webp'), alt: 'Jalan Alor at dusk under rows of red lanterns, with hawker stalls and folding tables along the street', w: 1600, h: 900, caption: 'Jalan Alor at dusk.' },
      { src: m('kl-klia-departure-hall-1600.webp'), alt: 'KLIA Terminal 1 departure hall with white tree columns under a wooden shell roof', w: 1600, h: 900, caption: 'The KLIA departure hall.' },
      { src: m('kl-smart-tunnel-flood-gates-1600.webp'), alt: 'The SMART Tunnel closed for flooding, with its gates shut and lane signals red', w: 1600, h: 900, caption: 'The SMART Tunnel closes in heavy rain.' },
      { src: m('kl-merdeka118-dusk-1600.webp'), alt: 'Merdeka 118 at dusk, its faceted tower and spire outlined in white light above the lit city', w: 1600, h: 900, caption: 'Merdeka 118 at dusk, rebuilt from photos.' },
    ],
  },
  {
    slug: 'bike-taxi',
    index: '02',
    name: 'Bike Taxi',
    kind: 'Ride-hailing application',
    year: '2026',
    summary: 'Rider and driver Android apps plus a web admin panel, from one Flutter codebase on Firebase with real road routing.',
    cover: { src: m('bike-rider-720.webp'), alt: 'Bike Taxi rider app: a road route from pickup to drop, a $4.30 fare and a Book Bike button', w: 720, h: 1616 },
    repo: { label: 'GitHub repository', href: 'https://github.com/chengboonrong/bike-taxi' },
    overview:
      'A bike-only taxi MVP. Riders set pickup and drop on a map, see the fare and book. Drivers register, wait for approval, go online, accept and run the trip. An admin approves drivers and oversees rides from the web. It is a portfolio demo: no real riders, drivers or trips are behind it, and the screenshots show sample data.',
    approach: [
      'One Dart codebase builds three apps: Android flavors for rider and driver, and a web build for admin.',
      'Security lives in Firestore rules, not in the clients, and the rules have their own test suite against the emulator.',
      'A single decision to book: one vehicle type, so no tiers and no picker.',
    ],
    flow: {
      title: 'The life of a ride',
      steps: ['Requested', 'Accepted', 'Started', 'Completed'],
    },
    stack: ['Flutter', 'Dart', 'Firebase Auth (phone OTP)', 'Cloud Firestore', 'Security rules tests', 'flutter_map', 'OpenStreetMap', 'Valhalla routing'],
    challenges: [
      {
        title: 'A fare the client cannot fake',
        problem: 'The rider app routes and prices the trip, and anything a client sends can be forged.',
        solution: 'Firestore rules reject a ride unless the road distance is plausible for the pins (no shorter than the straight line less 300 m, no more than four times it plus 2 km) and the fare matches the published formula.',
        result: 'The rules check plausibility, not the exact route. A production launch should route and price in a Cloud Function.',
      },
      {
        title: 'Only one driver gets the ride',
        problem: 'Several approved drivers can see an open request at once.',
        solution: 'The rules allow one transition, requested to accepted, and require the driver to take it as themselves, with name, plate and phone matching their record.',
      },
      {
        title: 'Keeping three roles apart',
        problem: 'Riders, drivers and admins share one database.',
        solution: 'Read and write access is scoped per role and per ride state. Drivers cannot approve themselves, and strangers cannot read a ride. Nine rules tests cover these cases.',
      },
      {
        title: 'Routing failures a rider can act on',
        problem: 'A routing service fails in ways that mean nothing to a rider.',
        solution: 'Valhalla error codes become plain instructions such as "Move the pin closer to a street", and a timeout gives a clear message instead of a stuck screen.',
      },
    ],
    outcome: 'A complete demo that runs against the Firebase emulators, with an MIT licence and a documented path to going live.',
    limits: [
      'No address search, online payment, push notifications or ratings.',
      'Driver location is shared only while the app is in the foreground.',
      'Routing uses a public demo server by default. A real launch needs its own Valhalla.',
    ],
    gallery: [
      { src: m('bike-driver-720.webp'), alt: 'Driver app: a trip in progress with its steps and an End Trip button', w: 720, h: 1616, caption: 'Driver app, trip in progress.' },
      { src: m('bike-admin-mobile-720.webp'), alt: 'Admin panel on a phone: network status and the latest rides', w: 720, h: 1559, caption: 'Admin panel on a phone.' },
      { src: m('bike-admin-1600.webp'), alt: 'Admin panel on desktop: network status and a table of the latest rides', w: 1600, h: 1000, caption: 'Admin panel on desktop.' },
    ],
  },
  {
    slug: 'starlake',
    index: '03',
    name: 'Starlake',
    kind: 'Generative pixel art',
    year: '2026',
    summary: 'A living pixel-art lake under the stars, in one HTML file with no libraries and no image files.',
    cover: { src: m('starlake-night-1600.webp'), alt: 'Starlake at night: snowy peaks, an aurora and a moon mirrored in a pixel-art lake', w: 1600, h: 900 },
    live: { label: 'Open Starlake', href: 'https://chengboonrong.github.io/starlake/' },
    repo: { label: 'GitHub repository', href: 'https://github.com/chengboonrong/starlake' },
    embed: { src: 'https://chengboonrong.github.io/starlake/#seed=597222855&t=21', title: 'Starlake, running live', note: 'Click the sky for a shooting star, the lake for a ripple. Drag to scrub through the day.' },
    overview:
      'Starlake paints a mountain lake as pixel art and keeps it moving. Each visit builds a new landscape from a seed, and the scene runs through a full day: aurora and fireflies at night, sun glare and birds by day, mist at sunrise. The moon shows the real phase for today.',
    approach: [
      'Setup builds everything that never moves, then each frame repaints the scene into one pixel buffer.',
      'The scene is drawn small and scaled up, which makes per-pixel work affordable.',
      'The layer map stores what each pixel is, not its colour, because colour depends on the hour.',
    ],
    flow: {
      title: 'One frame, back to front',
      steps: ['Sky', 'Stars and moon', 'Terrain', 'Life', 'Lake reflects it all', 'Boat and reeds'],
    },
    stack: ['HTML canvas', 'Plain JavaScript', 'Seeded value noise', 'Ordered dithering', 'Swift (wallpaper build)'],
    challenges: [
      {
        title: 'Smooth colour in a pixel-art palette',
        problem: 'Pixel art cannot blend colours smoothly.',
        solution: 'A 4 by 4 Bayer matrix gives every pixel a threshold, and one rule then draws the banded sky, the soft edges of glows and clouds, and the shading on rock.',
      },
      {
        title: 'A reflection with no extra code',
        problem: 'Everything above the horizon has to appear in the water.',
        solution: 'The lake is drawn late and reads the rows already painted above it, mirrored and shifted by waves that grow with depth. The moon, meteors and chimney smoke all reflect for free.',
      },
      {
        title: 'Per-pixel work at 60 fps',
        problem: 'On a 1080p screen the lake alone touches 23,040 pixels every frame.',
        solution: 'A 320 by 180 scene scaled up with pixelated rendering keeps the work small.',
        result: 'The repo records 60 fps in Chromium on an M1 MacBook Pro.',
      },
    ],
    outcome: 'Live on GitHub Pages, about 1,000 lines of JavaScript. A macOS dynamic wallpaper built from the same scene is available as a release.',
    gallery: [
      { src: m('starlake-sunrise-1600.webp'), alt: 'Starlake at sunrise with warm light over the peaks', w: 1600, h: 900, caption: 'Sunrise.' },
      { src: m('starlake-noon-1600.webp'), alt: 'Starlake at noon with white clouds and sun glare on the lake', w: 1600, h: 900, caption: 'Noon.' },
      { src: m('starlake-sunset-1600.webp'), alt: 'Starlake at sunset with a red sky mirrored in the water', w: 1600, h: 900, caption: 'Sunset.' },
    ],
  },
  {
    slug: 'kiosk-anatomy',
    index: '04',
    name: 'Kiosk Anatomy',
    kind: 'Interactive technical figure',
    year: '2026',
    summary: 'An isometric, working cutaway of a self-service ordering kiosk, from the first touch to the kitchen and the pickup board.',
    cover: { src: m('kiosk-dark-652.webp'), alt: 'Isometric drawing of an ordering kiosk with its side panel off, showing the screen, card reader, printer and pickup board', w: 652, h: 870 },
    live: { label: 'Open the figure', href: 'https://chengboonrong.github.io/kiosk-anatomy/dark.html' },
    repo: { label: 'GitHub repository', href: 'https://github.com/chengboonrong/kiosk-anatomy' },
    embed: { src: 'https://chengboonrong.github.io/kiosk-anatomy/dark.html', title: 'Kiosk Anatomy, running live', note: 'Tap the screen to order, tap the card to pay, then break it with the buttons.' },
    overview:
      'A figure that explains a real system by letting you operate it. Tap the screen to order and the card to pay, and watch pulses travel the cables to the printer, the bank and the kitchen. Then break it: run the paper low, unplug the network, decline a card, or place an order big enough to need a PIN.',
    approach: [
      'A single model file holds every number the figure shows: prices, timings, printer speed and paper roll size.',
      'A build script writes the drawing, and an audit mode checks clearances, depth order and cable ends.',
      'Failure modes get the same care as the normal path, because that is where a system explains itself.',
    ],
    flow: {
      title: 'The order path',
      steps: ['Touch glass', 'Kiosk PC', 'Card terminal', 'Bank', 'Receipt printer', 'Kitchen', 'Pickup board'],
    },
    stack: ['Plain Node ES modules', 'Generated SVG', 'Vanilla JavaScript', 'MIT isometric drawing kit'],
    challenges: [
      {
        title: 'Numbers that stay true',
        problem: 'An explainer loses trust when its figures disagree with each other.',
        solution: 'Every value on the page comes from one model file, so the readout, the screen and the receipt length cannot drift apart.',
      },
      {
        title: 'Depth order in an isometric drawing',
        problem: 'Many small parts have to overlap correctly, and a wrong order is hard to spot by eye.',
        solution: 'The build has an audit flag that checks geometry directly: clearances, depth order and where each cable ends.',
      },
      {
        title: 'Open to every input',
        problem: 'A figure built on tapping shuts out keyboard and screen-reader users.',
        solution: 'Every action has a key, status changes are announced through a live region, and the animation respects reduced-motion settings.',
      },
    ],
    outcome: 'Live on GitHub Pages in light and dark versions, with no runtime dependencies.',
    limits: ['The kiosk is a model of a typical unit, not a specific product.'],
    gallery: [{ src: m('kiosk-light-652.webp'), alt: 'The light version of the isometric kiosk figure', w: 652, h: 870, caption: 'The light version.' }],
  },
  {
    slug: 'lid-awake',
    index: '05',
    name: 'Lid Awake',
    kind: 'macOS system utility',
    year: '2026',
    summary: 'Keeps a MacBook awake with the lid closed, but only while it is plugged in.',
    live: { label: 'Download the installer', href: 'https://github.com/chengboonrong/lid-awake/releases/latest' },
    repo: { label: 'GitHub repository', href: 'https://github.com/chengboonrong/lid-awake' },
    overview:
      'A small macOS utility with no app and no menu bar icon. On AC power, sleep is disabled, so closing the lid does not sleep the Mac. On battery, normal sleep comes back. If you unplug while the lid is already closed, the Mac sleeps right away instead of staying awake in your bag.',
    approach: [
      'A root LaunchDaemon runs one short shell script every 10 seconds.',
      'The script changes nothing unless the wanted state differs from the current one.',
      'Both installer routes end at the same script, and a single command removes it all and restores normal sleep.',
    ],
    flow: {
      title: 'Every 10 seconds',
      steps: ['Read power source', 'Compare with SleepDisabled', 'Set disablesleep if different', 'Unplugged and lid closed? Sleep now'],
    },
    stack: ['POSIX shell', 'launchd', 'pmset', 'ioreg', 'pkgbuild'],
    challenges: [
      {
        title: 'Unplugging into a bag',
        problem: 'Sleep stays disabled until something turns it back on, even with the lid shut on battery.',
        solution: 'When power drops, the script reads the clamshell state from ioreg and calls pmset sleepnow if the lid is closed.',
      },
      {
        title: 'A root script must not be replaceable',
        problem: 'launchd runs the script as root, so any user who can edit it gains root.',
        solution: 'It installs into a root-only folder, /Library/PrivilegedHelperTools, not /usr/local/sbin, which is user-owned on Intel Homebrew Macs.',
      },
      {
        title: 'Installing without an app',
        problem: 'People expect a double-click, but there is nothing to put in Applications.',
        solution: 'A payload-free package whose postinstall step is the same install script used from source.',
      },
    ],
    outcome: 'Version 1.0.1 is released on GitHub as a package of about 2 KB.',
    limits: [
      'The repo does not state a supported macOS range.',
      'The package is not signed by Apple, so macOS asks you to approve it in Privacy & Security.',
      'While plugged in, the Mac does not idle-sleep either.',
      'It does not watch temperature, and it conflicts with other tools that change disablesleep.',
    ],
    gallery: [],
  },
]

/** The real script from lid-awake, shown verbatim on its case study and its card. Do not edit. */
export const lidAwakeSource = `current=$(pmset -g | awk '/SleepDisabled/ {print $2}')
current=\${current:-0}

if pmset -g ps | head -1 | grep -q "AC Power"; then
  want=1
else
  want=0
fi

[ "$current" = "$want" ] && exit 0

pmset -a disablesleep "$want"
logger -t lid-awake-on-ac "disablesleep -> $want"

# Unplugged while the lid is already closed: sleep now rather than stay awake in a bag.
if [ "$want" = 0 ] && ioreg -r -k AppleClamshellState -d 4 | grep -q '"AppleClamshellState" = Yes'; then
  pmset sleepnow
fi`
