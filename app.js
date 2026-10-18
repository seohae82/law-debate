const stages = {
  start: { caption: '처음이라면 아래 예시 질문을 눌러 입장을 골라보세요.', welcome: '처음이라면 아래 예시 질문을 눌러 시작해보세요. 오늘의 사건은 “학교의 휴대전화 일괄 수거는 정당한가?”예요. 찬성·반대 중 마음이 가는 쪽과 이유를 적으면, 토론 코치가 헌법 조항과 공식 자료를 찾아 함께 다듬어드려요.', suggestions: ['찬성 입장을 정리하고 싶어요', '반대 입장을 정리하고 싶어요', '양쪽 주장을 비교해줘요'] },
  middle: { caption: '상대의 반론을 듣고 내 근거를 한 단계 더 다듬어요.', welcome: '토론이 한창이군요. 상대의 말에서 설득력 있었던 점 하나와 궁금한 점 하나를 찾아보세요. 질문을 적어주시면 공식 자료와 함께 살펴볼게요.', suggestions: ['상대 주장을 반박하고 싶어요', '내 주장을 헌법 조항과 연결해줘요', '새로운 해결책을 제안하고 싶어요'] },
  end: { caption: '가장 중요한 근거와 배운 점을 또렷하게 마무리해요.', welcome: '마무리 단계에서는 내 주장을 다시 한 문장으로 말하고, 상대 의견을 들으며 새롭게 생각한 점도 덧붙여 보세요.', suggestions: ['마무리 발언을 정리해줘요', '토론에서 배운 점을 정리하고 싶어요', '내 주장의 빈틈을 확인해줘요'] }
};
const defaultClassTopic = { title: '학교의 휴대전화 일괄 수거는 정당한가?', scenario: '학교의 수업 집중과 생활지도를 위한 휴대전화 보관이 학생의 사생활·표현의 자유와 어떻게 균형을 이루어야 하는지 토론합니다.' };
let classTopic = { ...defaultClassTopic };
let classTopicLoaded = false;
const createDefaultState = () => ({ presentations: [], participations: 0, creative: false, logical: false, stage: 'start', messages: [], thoughtHistory: [], note: '', persona: 'owl' });
let legacyState = {};
let profiles = {};
let activeStudent = localStorage.getItem('courtroom-active-student') || '학생';
try { legacyState = JSON.parse(localStorage.getItem('courtroom-state') || '{}'); } catch {}
try { profiles = JSON.parse(localStorage.getItem('courtroom-profiles') || '{}'); } catch {}
let state = { ...createDefaultState(), ...(profiles[activeStudent] || (activeStudent === '학생' ? legacyState : {})) };
state.persona ||= 'owl';
state.presentations = (state.presentations || []).map((item, index) => typeof item === 'number' ? { id: `legacy-${item}-${index}`, at: item, slot: index, text: '' } : item);
if (!state.thoughtHistory?.length && state.messages?.length) state.thoughtHistory = state.messages.map((message, index) => ({ id: `old-${index}`, type: message.who === 'user' ? 'question' : 'coach', text: message.text, at: Date.now(), stage: state.stage }));
let teacherMode = localStorage.getItem('courtroom-teacher-mode') === 'true';
const chatLog = document.querySelector('#chatLog');
const input = document.querySelector('#chatInput');
const stageCaption = document.querySelector('#stageCaption');
let idleTimer;
let roomPosts = [];
let classMembers = [];
let latestClassBoard = { members: [], totals: { students: 0, presentations: 0, participations: 0 } };
let replyTo = '';
let lastRoomPost = '';
let presentationSlot = null;

function persist() {
  localStorage.setItem('courtroom-state', JSON.stringify(state));
  profiles[activeStudent] = state;
  localStorage.setItem('courtroom-profiles', JSON.stringify(profiles));
  localStorage.setItem('courtroom-active-student', activeStudent);
}
function escapeText(value) { return String(value || ''); }

function renderMessage(message, save = true) {
  const article = document.createElement('div');
  article.className = `message ${message.who === 'user' ? 'user' : ''}`;
  if (message.who !== 'user') {
    const icon = document.createElement('span');
    icon.className = 'bot-icon';
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3v18M5 7h14M7 7l-4 7h8L7 7Zm10 0-4 7h8l-4-7ZM8 21h8"/></svg>';
    article.append(icon);
  }
  const wrap = document.createElement('div');
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = escapeText(message.text);
  wrap.append(bubble);
  if (message.sources?.length) {
    const sources = document.createElement('div');
    sources.className = 'sources';
    message.sources.forEach(source => {
      const link = document.createElement('a');
      link.className = 'source-link';
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const label = document.createElement('span');
      label.className = 'source-label';
      label.textContent = source.title.includes('생활법령') || source.url.includes('easylaw') ? '찾기쉬운 생활법령정보' : '국가법령정보센터';
      const title = document.createElement('span');
      title.textContent = source.title;
      link.append(label, title);
      if (source.excerpt) {
        const excerpt = document.createElement('span');
        excerpt.className = 'source-label';
        excerpt.textContent = source.excerpt.slice(0, 230);
        link.append(excerpt);
      }
      sources.append(link);
    });
    wrap.append(sources);
  }
  const time = document.createElement('div');
  time.className = 'timestamp';
  time.textContent = message.who === 'user' ? '내 발언' : message.aiConnected === false ? '법령 검색 · 생성형 AI 대기' : '공식 근거 확인';
  wrap.append(time);
  article.append(wrap);
  chatLog.append(article);
  if (save) {
    state.messages.push(message);
    state.messages = state.messages.slice(-36);
    state.thoughtHistory.push({
      id: `chat-${Date.now()}-${state.thoughtHistory.length}`,
      type: message.who === 'user' ? 'question' : message.sources?.length ? 'coach' : 'encouragement',
      text: message.text,
      sources: (message.sources || []).map(source => ({ title: source.title, url: source.url })),
      at: Date.now(),
      stage: state.stage
    });
    persist();
  }
  chatLog.scrollTop = chatLog.scrollHeight;
}

function renderChat() {
  chatLog.innerHTML = '';
  if (state.messages.length) {
    let previousWasNudge = false;
    state.messages.forEach(message => {
      const isNudge = message.text?.startsWith('잠시 생각이 멈췄나요?');
      if (!(isNudge && previousWasNudge)) renderMessage(message, false);
      previousWasNudge = isNudge;
    });
  }
  else renderMessage({ who: 'bot', text: stageWelcome() }, false);
}

function stageWelcome() {
  if (state.stage === 'start') return `오늘의 토론 주제는 “${classTopic.title}”예요. ${classTopic.scenario} 처음이라면 아래 예시 질문을 누르거나, 찬성·반대 중 마음이 가는 쪽을 한 문장으로 적어보세요.`;
  if (state.stage === 'middle') return `토론 주제 “${classTopic.title}”에 대해 상대의 말에서 설득력 있었던 점과 궁금한 점을 찾아보세요. 질문을 적으면 헌법 조항과 공식 자료를 함께 살펴볼게요.`;
  return `“${classTopic.title}”에 대한 내 주장을 한 문장으로 정리하고, 상대 의견을 들으며 새롭게 생각한 점도 덧붙여 보세요.`;
}

function renderStage() {
  document.querySelectorAll('.stage').forEach(button => button.classList.toggle('active', button.dataset.stage === state.stage));
  stageCaption.textContent = state.stage === 'start' ? `오늘의 주제: ${classTopic.title}` : stages[state.stage].caption;
  const suggestions = document.querySelector('#suggestions');
  suggestions.innerHTML = '';
  const options = state.stage === 'start'
    ? ['이 주제에 찬성하는 이유를 정리해줘요', '이 주제에 반대하는 이유를 정리해줘요', '관련 헌법 조항을 찾아줘요']
    : stages[state.stage].suggestions;
  options.forEach(text => {
    const button = document.createElement('button');
    button.className = 'chip';
    button.textContent = text;
    button.addEventListener('click', () => sendChat(text));
    suggestions.append(button);
  });
  persist();
}

function renderProgress() {
  const member = classMembers.find(item => item.name === activeStudent);
  const count = Math.max(state.presentations.length, member?.presentations || 0);
  const milestoneCount = Math.min(count, 3);
  document.querySelector('#scoreBadge').textContent = `${milestoneCount} / 3 발표`;
  document.querySelector('#progressFill').style.width = `${milestoneCount / 3 * 100}%`;
  document.querySelector('#progressText').textContent = `${Math.round(milestoneCount / 3 * 100)}%`;
  const list = document.querySelector('#presentationList');
  list.innerHTML = '';
  ['첫 발표 · 입장과 주장', '두 번째 · 근거와 반론', '세 번째 · 최종 정리'].forEach((label, index) => {
    const row = document.createElement('div');
    const checked = state.presentations.some(item => item.slot === index) || (member?.presentationSlots || []).includes(index);
    row.className = `presentation-row ${checked ? 'done' : ''}`;
    const check = document.createElement('button');
    check.type = 'button';
    check.className = 'check';
    check.textContent = checked ? '✓' : '';
    check.setAttribute('aria-pressed', String(checked));
    check.setAttribute('aria-label', `${index + 1}번째 발표 ${checked ? '완료, 눌러 체크 해제' : '미완료, 눌러 발표 기록'}`);
    check.addEventListener('click', () => togglePresentation(index));
    const title = document.createElement('span');
    title.textContent = label;
    const meta = document.createElement('span');
    meta.className = 'row-meta';
    meta.textContent = checked ? '완료 · 다시 눌러 해제' : '기록 전';
    row.append(check, title, meta);
    list.append(row);
  });
  document.querySelector('#rubricPresent').classList.toggle('met', count >= 3);
  document.querySelector('#rubricCreative').classList.toggle('met', state.creative);
  document.querySelector('#rubricLogic').classList.toggle('met', state.logical);
  document.querySelector('#celebrate').classList.toggle('show', milestoneCount >= 3 && state.creative && state.logical);
  const recordButton = document.querySelector('#recordBtn');
  recordButton.textContent = count >= 3 ? '발표 3회를 모두 기록했어요' : '+ 발표 기록하기';
  recordButton.disabled = count >= 3;
  renderCharacter();
}

const avatarPalettes = {
  owl: ['#b5bea8', '#cfb66f', '#df935e', '#a94d42'],
  fox: ['#d4a18e', '#d9855e', '#c86648', '#91463c'],
  turtle: ['#b5c89c', '#8bad7e', '#5e987d', '#386b62'],
  whale: ['#b1cbd5', '#83aec0', '#5d92ae', '#456b93']
};
function avatarColor(persona, presentations) { return avatarPalettes[persona]?.[Math.min(presentations, 3)] || avatarPalettes.owl[0]; }

function characterSvg(persona, count, presentations = count) {
  const characters = {
    owl: { name: '부엉이', color: '#d6a655', shape: '<path d="M23 39 25 15 43 31 57 31 75 15 77 39Q83 60 70 77L61 86H39L30 77Q17 60 23 39Z"/><path fill="#fff7e8" d="M31 45a11 11 0 1 0 22 0 11 11 0 0 0-22 0Zm16 0a11 11 0 1 0 22 0 11 11 0 0 0-22 0Z"/><circle cx="42" cy="46" r="3.5" fill="#26384a"/><circle cx="58" cy="46" r="3.5" fill="#26384a"/><path fill="#a74937" d="m46 53 4 7 4-7Z"/><path d="M28 65q9 7 18 0m8 0q9 7 18 0" fill="none" stroke="#754b31" stroke-width="2"/>' },
    fox: { name: '여우', color: '#d8784e', shape: '<path d="M20 42 17 14 40 29Q50 25 60 29L83 14 80 43Q80 69 50 82 20 69 20 42Z"/><path fill="#fff0df" d="M26 53q12-10 24 0 12-10 24 0-3 17-24 25-21-8-24-25Z"/><path d="M32 46q6-5 12 0m12 0q6-5 12 0" fill="none" stroke="#3d3540" stroke-width="3" stroke-linecap="round"/><circle cx="38" cy="48" r="2" fill="#243343"/><circle cx="62" cy="48" r="2" fill="#243343"/><path fill="#573944" d="M46 57q4-4 8 0l-4 5Z"/><path d="M50 62q-5 6-10 1m10-1q5 6 10 1" fill="none" stroke="#75463d" stroke-width="2"/>' },
    turtle: { name: '거북이', color: '#64947a', shape: '<path fill="#86ad78" d="M24 48a26 26 0 0 1 52 0v13H24Z"/><path fill="#4f765d" d="M22 53q1-25 28-25t28 25q-4 19-28 22-24-3-28-22Z"/><path d="M50 29v43M27 49h46M34 35l32 31m0-31L34 66" fill="none" stroke="#a8c48b" stroke-width="2"/><path d="M38 43a2 2 0 1 0 0 4m24-4a2 2 0 1 0 0 4" stroke="#243b3a" stroke-width="4" stroke-linecap="round"/><path d="M44 53q6 5 12 0" fill="none" stroke="#284c42" stroke-width="2" stroke-linecap="round"/><path d="M31 73 26 82m43-9 5 9" stroke="#64947a" stroke-width="7" stroke-linecap="round"/>' },
    whale: { name: '고래', color: '#6798b7', shape: '<path fill="#6798b7" d="M18 53q4-25 34-27 25 0 32 21l8-11 2 24-11-5Q72 79 48 78 20 77 18 53Z"/><path fill="#d9edf0" d="M25 57q11 7 25 7 24 0 38-10-1 21-28 25-24 0-35-12Z"/><path d="M39 46a2.5 2.5 0 1 0 0 5m23-5a2.5 2.5 0 1 0 0 5" stroke="#20394a" stroke-width="4" stroke-linecap="round"/><path d="M45 57q7 5 14 0" fill="none" stroke="#31576c" stroke-width="2" stroke-linecap="round"/><path d="M49 25q-5-9 0-15m4 15q-1-7 5-11" fill="none" stroke="#6798b7" stroke-width="3" stroke-linecap="round"/>' }
  };
  const character = characters[persona] || characters.owl;
  const color = avatarColor(persona, presentations);
  const shape = character.shape.replaceAll(character.color, color).replaceAll('#86ad78', color).replaceAll('#4f765d', color);
  const sprout = count >= 1 ? `<path d="M50 23V${count >= 2 ? 9 : 16}" stroke="#56745c" stroke-width="3" stroke-linecap="round"/><path d="M50 16q-12-10-16 1 10 5 16-1Z" fill="#70966b"/>${count >= 2 ? '<path d="M50 11q10-11 17-3-4 11-17 9Z" fill="#91ad70"/>' : ''}` : '';
  const sparks = count >= 3 ? '<path d="m15 37 2 4 4 2-4 2-2 4-2-4-4-2 4-2Zm70 0 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" fill="#c5944a"/>' : '';
  const badge = count >= 5 ? '<path d="m50 74 3 5 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1Z" fill="#c5944a" stroke="#fff7df" stroke-width="1"/>' : '';
  return `<svg viewBox="0 0 100 100" role="img" aria-label="성장하는 ${character.name} 토론 아바타"><circle cx="50" cy="53" r="43" fill="#fff8e8"/><g fill="${color}" stroke="#28394a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${shape}</g>${sprout}${sparks}${badge}</svg>`;
}

function renderCharacter(animate = false) {
  const member = classMembers.find(item => item.name === activeStudent);
  const presentations = Math.max(state.presentations.length, member?.presentations || 0);
  const participations = Math.max(state.participations || 0, member?.participations || 0);
  const growthPoints = presentations * 3 + participations;
  const count = Math.floor(growthPoints / 3);
  const persona = state.persona || 'owl';
  const growthStages = ['시작 단계', '첫 주장 새싹', '근거 탐험가', '반론을 듣는 토론가', '생각을 잇는 법정 안내자', '헌법 토론 마스터'];
  const title = '토론 아바타';
  const nextStep = 3 - growthPoints % 3;
  const copy = count === 0 && growthPoints === 0 ? '첫 발표를 기다리고 있어요.' : nextStep === 3 ? '새 레벨에 도달했어요. 다음 생각을 들려주세요.' : `발표 ${presentations}회 · 참여 ${participations}회 · 다음 성장까지 ${nextStep}점`;
  const shell = document.querySelector('#characterShell');
  shell.style.setProperty('--growth-scale', String(1 + Math.min(growthPoints, 24) * 0.01));
  shell.style.setProperty('--avatar-color', avatarColor(persona, presentations));
  document.querySelector('#characterArt').innerHTML = characterSvg(persona, count, presentations);
  document.querySelector('#characterLevel').textContent = `LV ${count}`;
  document.querySelector('#characterTitle').textContent = title;
  document.querySelector('#characterStage').textContent = growthStages[Math.min(count, 5)];
  document.querySelector('#characterCopy').textContent = copy;
  document.querySelector('#characterCount').textContent = `발표 ${presentations}회 · 참여 ${participations}회`;
  document.querySelector('#headerStudentName').textContent = activeStudent;
  document.querySelector('#headerCharacter').innerHTML = characterSvg(persona, count, presentations);
  if (document.activeElement !== document.querySelector('#profileName')) document.querySelector('#profileName').value = activeStudent;
  if (document.activeElement !== document.querySelector('#personaSelect')) document.querySelector('#personaSelect').value = persona;
  const roomName = document.querySelector('#roomName');
  if (!roomName.value || roomName.value === '학생') roomName.value = activeStudent;
  if (animate) {
    shell.classList.remove('grow');
    requestAnimationFrame(() => shell.classList.add('grow'));
    setTimeout(() => shell.classList.remove('grow'), 600);
  }
}

function switchStudent(name) {
  const next = String(name || '').trim().slice(0, 12) || '학생';
  persist();
  if (next === activeStudent) { document.querySelector('#profileName').value = next; return; }
  activeStudent = next;
  state = { ...createDefaultState(), ...(profiles[activeStudent] || {}) };
  state.presentations = (state.presentations || []).map((item, index) => typeof item === 'number' ? { id: `legacy-${item}-${index}`, at: item, slot: index, text: '' } : item);
  if (!state.thoughtHistory?.length && state.messages?.length) state.thoughtHistory = state.messages.map((message, index) => ({ id: `old-${index}`, type: message.who === 'user' ? 'question' : 'coach', text: message.text, at: Date.now(), stage: state.stage }));
  persist();
  document.querySelector('#roomName').value = activeStudent;
  renderProgress();
  renderStage();
  renderChat();
  refreshGameBadges();
  pollClassBoard();
}

function renderClassBoard(board) {
  const totals = board.totals || { students: 0, presentations: 0, participations: 0 };
  document.querySelector('#classStudentTotal').textContent = totals.students;
  document.querySelector('#classPresentationTotal').textContent = totals.presentations;
  document.querySelector('#classParticipationTotal').textContent = totals.participations;
  document.querySelector('#classStatus').textContent = '실시간 집계 중';
  const roster = document.querySelector('#classRoster');
  roster.innerHTML = '';
  if (!board.members?.length) {
    roster.innerHTML = '<div class="class-empty">첫 발표와 질문이 등록되면 친구들의 아바타가 레이스에 들어와요.</div>';
    return;
  }
  board.members.forEach((member, index) => {
    const level = Math.floor((member.growthPoints || 0) / 3);
    const progress = Math.min(100, Math.round(Math.min(member.presentations, 3) / 3 * 60 + Math.min(member.participations, 3) / 3 * 40));
    const finished = member.presentations >= 3 && member.participations >= 3;
    const card = document.createElement('article');
    card.className = `class-member ${member.name === activeStudent ? 'current' : ''}`;
    const art = document.createElement('div');
    art.className = 'class-member-art';
    art.style.background = `${avatarColor(member.persona, member.presentations)}22`;
    art.innerHTML = characterSvg(member.persona, level, member.presentations);
    const main = document.createElement('div');
    main.className = 'member-main';
    const top = document.createElement('div');
    top.className = 'member-top';
    const name = document.createElement('span');
    name.className = 'member-name';
    name.textContent = member.name;
    const rank = document.createElement('span');
    rank.className = 'member-rank';
    rank.textContent = `LV ${level} · #${index + 1}`;
    top.append(name, rank);
    const title = document.createElement('div');
    title.className = 'member-title';
    title.textContent = `토론 아바타 · ${['시작 단계', '첫 주장 새싹', '근거 탐험가', '반론을 듣는 토론가', '생각을 잇는 법정 안내자', '헌법 토론 마스터'][Math.min(level, 5)]}`;
    const counts = document.createElement('div');
    counts.className = 'member-counts';
    counts.textContent = `발표 ${member.presentations}회 · 참여 ${member.participations}회`;
    const track = document.createElement('div');
    track.className = 'race-lane';
    const fill = document.createElement('div');
    fill.className = 'race-progress';
    fill.style.width = `${progress}%`;
    const runner = document.createElement('div');
    runner.className = 'race-runner';
    runner.style.setProperty('--race-progress', `${progress}%`);
    runner.innerHTML = characterSvg(member.persona, level, member.presentations);
    const finish = document.createElement('span');
    finish.className = 'race-finish';
    finish.textContent = 'FINISH';
    track.append(fill, runner, finish);
    const status = document.createElement('div');
    status.className = `race-status ${finished ? 'done' : ''}`;
    status.textContent = finished ? '완주! 발표와 토론 참여 목표를 모두 채웠어요.' : member.presentations === 0 && member.participations === 0 ? '출발선을 기다리고 있어요. 첫 생각부터 시작해요.' : `레이스 ${progress}% · 발표 ${Math.min(member.presentations, 3)}/3 · 참여 ${Math.min(member.participations, 3)}/3`;
    if (member.helpRequested) {
      const chip = document.createElement('span');
      chip.className = 'support-chip';
      chip.textContent = '교사 도움 요청';
      status.append(chip);
    }
    const helpActions = document.createElement('div');
    helpActions.className = 'race-help-actions';
    if (teacherMode && (member.helpRequested || !finished)) {
      const button = document.createElement('button');
      button.className = 'teacher-support-button';
      button.textContent = member.helpRequested ? '교사 지원 완료로 표시' : '교사 지원 요청 등록';
      button.addEventListener('click', () => updateClassSupport(member.name, member.persona, member.helpRequested ? 'resolve' : 'request'));
      helpActions.append(button);
    } else if (member.name === activeStudent && !finished) {
      const coachButton = document.createElement('button');
      coachButton.className = 'race-coach-button';
      coachButton.textContent = 'AI 코치에게 다음 한 걸음 묻기';
      coachButton.addEventListener('click', () => requestCoachHelp(member));
      helpActions.append(coachButton);
      if (!member.helpRequested) {
        const teacherButton = document.createElement('button');
        teacherButton.className = 'race-teacher-button';
        teacherButton.textContent = '교사 도움 요청';
        teacherButton.addEventListener('click', () => updateClassSupport(member.name, member.persona, 'request'));
        helpActions.append(teacherButton);
      }
    }
    main.append(top, title, counts, track, status);
    if (helpActions.children.length) main.append(helpActions);
    card.append(art, main);
    roster.append(card);
  });
}

function renderOverview(board) {
  const members = board.members || [];
  const current = members.find(member => member.name === activeStudent);
  const presentations = Math.max(state.presentations.length, current?.presentations || 0);
  const participations = Math.max(state.participations || 0, current?.participations || 0);
  const progress = Math.min(100, Math.round(Math.min(presentations, 3) / 3 * 60 + Math.min(participations, 3) / 3 * 40));
  const level = Math.floor((presentations * 3 + participations) / 3);
  document.querySelector('#overviewAvatar').innerHTML = characterSvg(state.persona, level, presentations);
  document.querySelector('#overviewAvatar').style.background = `${avatarColor(state.persona, presentations)}25`;
  document.querySelector('#overviewName').textContent = `${activeStudent} · 토론 아바타`;
  document.querySelector('#overviewStatus').textContent = progress >= 100 ? '완주했어요! 다른 친구도 응원해볼까요?' : `발표 ${presentations}/3 · 참여 ${participations}/3 · 레이스 ${progress}%`;
  document.querySelector('#overviewProgress').style.width = `${progress}%`;
  document.querySelector('#overviewStudents').textContent = board.totals?.students || 0;
  document.querySelector('#overviewPresentations').textContent = board.totals?.presentations || 0;
  document.querySelector('#overviewParticipations').textContent = board.totals?.participations || 0;
  document.querySelector('#overviewSupport').textContent = members.filter(member => member.helpRequested).length;
}

function renderSideRoster(board) {
  const members = board.members || [];
  const active = members.filter(member => member.presentations || member.participations).length;
  const help = members.filter(member => member.helpRequested).length;
  document.querySelector('#sideRosterSummary').textContent = `${members.length}명 중 ${active}명 시작 · 교사 도움 요청 ${help}명`;
  const roster = document.querySelector('#classSideRoster');
  roster.innerHTML = '';
  if (!members.length) {
    const empty = document.createElement('div');
    empty.className = 'side-empty';
    empty.textContent = '학급 구성원의 참여가 여기에 모여요.';
    roster.append(empty);
    return;
  }
  members.forEach(member => {
    const row = document.createElement('article');
    row.className = 'side-student';
    const art = document.createElement('div');
    art.className = 'side-student-avatar';
    art.style.background = `${avatarColor(member.persona, member.presentations)}35`;
    art.innerHTML = characterSvg(member.persona, member.level, member.presentations);
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'side-student-name';
    name.textContent = member.name;
    const counts = document.createElement('div');
    counts.className = 'side-student-count';
    counts.textContent = `발표 ${member.presentations}/3 · 참여 ${member.participations}/3`;
    const events = document.createElement('div');
    events.className = 'side-events';
    if (member.helpRequested) {
      const chip = document.createElement('span');
      chip.className = 'side-event support';
      chip.textContent = '교사 도움 요청';
      events.append(chip);
    }
    (member.activityTrail || []).slice(-3).reverse().forEach(activity => {
      const chip = document.createElement('span');
      chip.className = `side-event ${activity.type === 'presentation' ? 'presentation' : ''}`;
      chip.textContent = activity.label;
      events.append(chip);
    });
    if (!events.children.length) {
      const chip = document.createElement('span');
      chip.className = 'side-event';
      chip.textContent = '출발을 기다리는 중';
      events.append(chip);
    }
    body.append(name, counts, events);
    row.append(art, body);
    roster.append(row);
  });
}

function requestCoachHelp(member) {
  const prompt = member.presentations === 0
    ? `아직 “${classTopic.title}”에 대해 발표를 시작하기가 망설여져요. 찬성과 반대의 이유를 짧게 비교해주고, 제가 채울 수 있는 첫 문장을 제안해주세요.`
    : member.presentations < 3
      ? `발표 ${member.presentations}회, 토론 참여 ${member.participations}회까지 왔어요. 다음 발표에서 말할 주장과 근거를 한 단계씩 정리하도록 질문해주세요.`
      : `발표는 ${member.presentations}회 했지만 토론 참여가 ${member.participations}회예요. 공개 토론에서 부담 없이 보탤 수 있는 질문이나 짧은 반론 문장을 도와주세요.`;
  sendChat(prompt);
}

async function updateClassSupport(name, persona, action) {
  try {
    const response = await fetch('/api/class/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, persona, action })
    });
    if (!response.ok) throw new Error('support_unavailable');
    await pollClassBoard();
    toast(action === 'request' ? '교사 도움 요청을 학급 레이스에 표시했어요.' : '교사 지원 완료로 표시했어요.');
  } catch {
    toast('도움 요청을 등록하지 못했어요. 잠시 뒤 다시 시도해 주세요.');
  }
}

async function pollClassBoard() {
  try {
    const query = new URLSearchParams({ name: activeStudent, persona: state.persona || 'owl' });
    const response = await fetch(`/api/class/board?${query}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('board_unavailable');
    const board = await response.json();
    const previous = classMembers.find(member => member.name === activeStudent);
    const next = (board.members || []).find(member => member.name === activeStudent);
    const changed = (previous?.presentations || 0) !== (next?.presentations || 0) || (previous?.participations || 0) !== (next?.participations || 0);
    classMembers = board.members || [];
    latestClassBoard = board;
    renderClassBoard(board);
    renderOverview(board);
    renderSideRoster(board);
    if (changed) renderProgress();
    document.querySelector('#teacherToggle').classList.toggle('active', teacherMode);
    document.querySelector('#teacherToggle').textContent = teacherMode ? '교사 지원 보기 · 켜짐' : '교사 지원 보기';
  } catch {
    document.querySelector('#classStatus').textContent = '연결 재시도 중';
  }
}

function setAiStatus(status) {
  const element = document.querySelector('#aiStatus');
  element.classList.toggle('pending', !status.upstage);
  const label = status.upstage ? 'Upstage Solar 실시간 연결' : status.lawApi === 'ok' ? '공식 자료 연결 · Upstage 키 대기' : status.lawApi === 'service_approval_needed' ? '법령 API 이용 승인 확인 필요' : status.lawApi === 'credential_rejected' ? '법령 API 인증 확인 필요' : status.lawApi === 'not_checked' && status.law ? '법령 검색 준비 · Upstage 키 대기' : status.law ? '공식 링크 제공 · API 확인 필요' : '공식 자료 연결 확인 필요';
  element.innerHTML = `<i></i>${label}`;
}

function applyClassTopic(topic) {
  const firstLoad = !classTopicLoaded;
  const changed = topic.title !== classTopic.title || topic.scenario !== classTopic.scenario;
  classTopic = { title: topic.title || defaultClassTopic.title, scenario: topic.scenario || '' };
  const titleInput = document.querySelector('#topicTitle');
  const scenarioInput = document.querySelector('#topicScenario');
  if (document.activeElement !== titleInput) titleInput.value = classTopic.title;
  if (document.activeElement !== scenarioInput) scenarioInput.value = classTopic.scenario;
  document.querySelector('#heroTopic').textContent = `오늘의 주제 · ${classTopic.title}`;
  document.querySelector('#sideCaseTitle').textContent = classTopic.title;
  document.querySelector('#sideCaseContext').textContent = classTopic.scenario;
  if (changed) {
    state.stage = 'start';
    state.messages = [];
    persist();
    renderStage();
    renderChat();
    document.querySelector('#topicStatus').classList.remove('error');
    document.querySelector('#topicStatus').textContent = '새 주제가 수업 전체와 토론 코치에 적용됐어요.';
  } else if (firstLoad) {
    document.querySelector('#topicStatus').textContent = `현재 주제: ${classTopic.title}`;
  }
  classTopicLoaded = true;
}

async function pollClassTopic() {
  try {
    const response = await fetch('/api/class/topic', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    applyClassTopic(data.topic);
  } catch {}
}

async function saveClassTopic() {
  const title = document.querySelector('#topicTitle').value.trim();
  const scenario = document.querySelector('#topicScenario').value.trim();
  const status = document.querySelector('#topicStatus');
  const constitutionTerms = /헌법|권리|기본권|평등|표현|사생활|개인정보|교육|학교|학생|휴대|자유|존엄|차별|제한|인권|공익|노동|종교|언론|집회|양심|참정|재산|주거|신체|보건|환경/i;
  if (/정치|선거|정당(?:\s|간|별|정치|의)|대통령|국회|탄핵|독도|영토|동해|정권|정치인/i.test(`${title} ${scenario}`)) {
    status.classList.add('error');
    status.textContent = '정치·영토 쟁점 대신 생활 속 기본권과 연결된 주제를 입력해 주세요.';
    return;
  }
  if (title.length < 6 || !constitutionTerms.test(`${title} ${scenario}`)) {
    status.classList.add('error');
    status.textContent = '헌법의 권리나 기본권 쟁점과 연결된 주제를 입력해 주세요.';
    return;
  }
  const button = document.querySelector('#saveTopicButton');
  button.disabled = true;
  status.classList.remove('error');
  status.textContent = '주제를 수업 공간에 공유하고 있어요...';
  try {
    const response = await fetch('/api/class/topic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, scenario })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '주제를 저장하지 못했어요.');
    applyClassTopic(result.topic);
    status.classList.remove('error');
    status.textContent = '새 주제가 학급 전체와 토론 코치에 적용됐어요.';
    toast('오늘의 토론 주제를 학급에 적용했어요.');
  } catch (error) {
    status.classList.add('error');
    status.textContent = error.message;
  } finally {
    button.disabled = false;
  }
}

async function checkStatus() {
  try {
    const response = await fetch('/api/status');
    setAiStatus(await response.json());
  } catch {
    setAiStatus({ upstage: false, law: false });
  }
}

async function sendChat(value) {
  const text = String(value || input.value).trim();
  if (!text) return;
  if (isLowEffortInput(text)) {
    renderMessage({ who: 'bot', text: '잠깐, 너무 짧거나 반복된 글이라 토론 생각으로 기록하지 않았어요. “저는 ___라고 생각해요. 왜냐하면 ___ 때문이에요.”처럼 오늘의 헌법 쟁점에 연결해 한 문장으로 다시 말해볼까요?' });
    input.value = '';
    return;
  }
  clearTimeout(idleTimer);
  renderMessage({ who: 'user', text });
  input.value = '';
  const form = document.querySelector('#chatForm');
  form.classList.add('busy');
  try {
    const history = state.messages.filter(message => message.who !== 'system').slice(0, -1).slice(-12).map(message => ({ role: message.who === 'user' ? 'user' : 'model', text: message.text }));
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history, stage: state.stage, position: document.querySelector('#roomSide').value, name: activeStudent, persona: state.persona, topic: classTopic })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '자료 검색에 실패했습니다. 잠시 뒤 다시 시도해 주세요.');
    if (result.onTopic) state.participations = (state.participations || 0) + 1;
    state.creative ||= Boolean(result.creative);
    state.logical ||= Boolean(result.logical);
    persist();
    renderProgress();
    renderCharacter(true);
    renderMessage({ who: 'bot', text: result.feedback, sources: result.sources || [], aiConnected: result.aiConnected });
  } catch (error) {
    renderMessage({ who: 'bot', text: error.message || '연결이 원활하지 않아요. 잠시 뒤 다시 시도해 주세요.' });
  } finally {
    form.classList.remove('busy');
    checkStatus();
    pollClassBoard();
    scheduleNudge();
  }
}

function isLowEffortInput(text) {
  const compact = text.replace(/\s/g, '');
  return !/[가-힣A-Za-z]/.test(compact)
    || /^(?:ㅋ|ㅎ|ㅇ|ㄴ|ㄱ){2,}$/u.test(compact)
    || /(.)\1{5,}/u.test(compact)
    || /^(?:asdf|qwer|zxcv|test|spam)+$/i.test(compact);
}

function scheduleNudge() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (!input.value.trim()) renderMessage({ who: 'bot', text: '잠시 생각이 멈췄나요? 한 문장이 어렵다면 “저는 ___ 쪽에 조금 더 가까워요. 왜냐하면 ___ 때문이에요”처럼 빈칸부터 채워보세요.' });
  }, 50000);
}

function toast(text) {
  const element = document.querySelector('#toast');
  element.textContent = text;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2500);
}

function nextPresentationSlot() {
  const member = classMembers.find(item => item.name === activeStudent);
  const complete = new Set([
    ...state.presentations.map(item => item.slot),
    ...(member?.presentationSlots || [])
  ]);
  return [0, 1, 2].find(slot => !complete.has(slot));
}

function openPresentationModal(slot = nextPresentationSlot()) {
  if (slot === undefined) { toast('발표 3회를 모두 기록했어요. 체크를 다시 눌러 수정할 수 있습니다.'); return; }
  presentationSlot = slot;
  document.querySelector('#presentationTitle').textContent = `${slot + 1}번째 발표 기록`;
  document.querySelector('#presentationText').value = '';
  document.querySelector('#presentationModal').classList.add('open');
  document.querySelector('#presentationText').focus();
}

async function togglePresentation(slot) {
  const member = classMembers.find(item => item.name === activeStudent);
  const localRecord = state.presentations.find(item => item.slot === slot);
  const checked = Boolean(localRecord) || Boolean(member?.presentationSlots?.includes(slot));
  if (!checked) { openPresentationModal(slot); return; }
  state.presentations = state.presentations.filter(item => item.slot !== slot);
  if (localRecord) state.thoughtHistory = state.thoughtHistory.filter(event => event.presentationId !== localRecord.id);
  persist();
  renderProgress();
  renderCharacter(true);
  try {
    const response = await fetch('/api/class/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'presentation', action: 'uncheck', slot, name: activeStudent, persona: state.persona })
    });
    if (!response.ok) throw new Error('class_board_unavailable');
    await pollClassBoard();
    renderProgress();
    renderCharacter(true);
    toast(`${slot + 1}번째 발표 체크를 해제했어요. 다시 눌러 기록할 수 있습니다.`);
  } catch {
    toast('내 체크는 해제했지만 학급 집계와 연결하지 못했어요. 다시 확인해 주세요.');
  }
}

async function savePresentation() {
  const text = document.querySelector('#presentationText').value.trim();
  if (!text || presentationSlot === null) { toast('발표에서 말한 핵심 생각을 한 문장으로 적어주세요.'); return; }
  const slot = presentationSlot;
  const at = Date.now();
  const id = `p-${at}-${slot}`;
  state.presentations = state.presentations.filter(item => item.slot !== slot);
  state.presentations.push({ id, slot, at, text });
  state.thoughtHistory.push({ id: `presentation-${id}`, presentationId: id, type: 'presentation', text, at, stage: state.stage });
  persist();
  renderProgress();
  renderCharacter(true);
  document.querySelector('#presentationModal').classList.remove('open');
  try {
    const response = await fetch('/api/class/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'presentation', action: 'check', slot, name: activeStudent, persona: state.persona })
    });
    if (!response.ok) throw new Error('class_board_unavailable');
    await pollClassBoard();
    renderProgress();
    renderCharacter(true);
    toast(`${slot + 1}번째 발표가 노트에 쌓였어요. 아바타 색과 크기가 성장했습니다.`);
  } catch {
    toast('발표 내용과 아바타는 저장했어요. 학급 레이스 연결을 다시 확인해 주세요.');
  }
  presentationSlot = null;
}

function thoughtTypeLabel(event) {
  if (event.type === 'presentation') return '발표 내용';
  if (event.type === 'question') return '내 생각 · 코치 질문';
  if (event.type === 'coach') return '코치 피드백';
  if (event.type === 'encouragement') return '참여 응원';
  if (event.type === 'game-answer') return '헌법 조항 게임';
  if (event.type === 'game-complete') return '조항 탐험 기록';
  if (event.type === 'public-debate') return `학급 토론 · ${event.side || '발언'}`;
  return '생각 기록';
}

function renderThoughtNote() {
  const events = [...(state.thoughtHistory || [])];
  const ids = new Set(events.map(event => event.id));
  roomPosts.filter(post => post.name === activeStudent).forEach(post => {
    const id = `room-${post.id}`;
    if (!ids.has(id)) events.push({ id, type: 'public-debate', text: post.body, side: post.side, at: post.at, stage: 'middle' });
  });
  events.sort((a, b) => (a.at || 0) - (b.at || 0));
  const contributions = events.filter(event => ['presentation', 'question', 'public-debate', 'game-answer'].includes(event.type));
  const counts = [
    ['발표', events.filter(event => event.type === 'presentation').length],
    ['내 발언·질문', events.filter(event => ['question', 'public-debate', 'game-answer'].includes(event.type)).length],
    ['코치·게임 피드백', events.filter(event => ['coach', 'encouragement', 'game-complete'].includes(event.type)).length]
  ];
  const overview = document.querySelector('#thoughtOverview');
  overview.innerHTML = '';
  counts.forEach(([label, count]) => {
    const card = document.createElement('div');
    card.className = 'thought-stat';
    const value = document.createElement('strong');
    value.textContent = count;
    const name = document.createElement('span');
    name.textContent = label;
    card.append(value, name);
    overview.append(card);
  });
  const first = contributions[0];
  const reasoning = contributions.find(event => /왜냐|때문|근거|헌법|제\s*\d+조|예를 들어|따라서/.test(event.text));
  const latest = contributions.at(-1);
  const arc = document.querySelector('#thoughtArc');
  arc.innerHTML = '';
  [['처음 꺼낸 생각', first], ['근거가 더해진 생각', reasoning], ['최근 생각', latest]].forEach(([label, event]) => {
    const step = document.createElement('div');
    step.className = 'thought-step';
    const heading = document.createElement('b');
    heading.textContent = label;
    const text = document.createElement('span');
    text.textContent = event?.text ? `${event.text.slice(0, 115)}${event.text.length > 115 ? '…' : ''}` : '이런 생각이 쌓이면 변화가 보여요.';
    step.append(heading, text);
    arc.append(step);
  });
  const stream = document.querySelector('#thoughtTimeline');
  stream.innerHTML = '';
  if (!events.length) {
    const empty = document.createElement('div');
    empty.className = 'class-empty';
    empty.textContent = '아직 기록이 없어요. 코치에게 질문하거나 발표·토론 발언을 남겨보세요.';
    stream.append(empty);
    return;
  }
  events.forEach(event => {
    const item = document.createElement('article');
    item.className = 'thought-event';
    const head = document.createElement('div');
    head.className = 'thought-event-head';
    const type = document.createElement('span');
    type.className = 'thought-event-type';
    type.textContent = thoughtTypeLabel(event);
    const time = document.createElement('time');
    time.dateTime = new Date(event.at || Date.now()).toISOString();
    const stageName = { start: '토론 시작', middle: '토론 진행', end: '토론 마무리' }[event.stage] || '기록';
    time.textContent = `${stageName} · ${new Date(event.at || Date.now()).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    head.append(type, time);
    const body = document.createElement('div');
    body.className = 'thought-event-body';
    body.textContent = event.text;
    item.append(head, body);
    (event.sources || []).forEach(source => {
      const link = document.createElement('a');
      link.className = 'thought-source';
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = `근거 자료 · ${source.title}`;
      item.append(link);
    });
    stream.append(item);
  });
}

async function openThoughtNote() {
  document.querySelector('#noteText').value = state.note || '';
  document.querySelector('#noteModal').classList.add('open');
  renderThoughtNote();
  await pollRoom();
  renderThoughtNote();
}

function renderRoom() {
  const feed = document.querySelector('#roomFeed');
  feed.innerHTML = '';
  if (!roomPosts.length) {
    feed.innerHTML = '<div class="room-empty">아직 발언이 없어요. 찬성·반대·배심원으로 첫 의견을 남겨보세요.</div>';
    return;
  }
  const byId = new Map(roomPosts.map(post => [post.id, post]));
  roomPosts.forEach(post => {
    const card = document.createElement('article');
    card.className = `room-post ${post.replyTo ? 'reply' : ''}`;
    const meta = document.createElement('div');
    meta.className = 'post-meta';
    const side = document.createElement('span');
    side.className = `post-side ${post.side === '반대팀' ? 'against' : ''}`;
    side.textContent = post.side;
    const name = document.createElement('span');
    name.textContent = post.name;
    const time = document.createElement('span');
    time.textContent = new Date(post.at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    meta.append(side, name, time);
    card.append(meta);
    const parent = byId.get(post.replyTo);
    if (parent) {
      const context = document.createElement('div');
      context.className = 'reply-context';
      context.textContent = `${parent.name}의 발언: ${parent.body.slice(0, 110)}`;
      card.append(context);
    }
    const body = document.createElement('div');
    body.className = 'post-body';
    body.textContent = post.body;
    const reply = document.createElement('button');
    reply.type = 'button';
    reply.className = 'reply-btn';
    reply.textContent = '이 발언에 답글';
    reply.addEventListener('click', () => {
      replyTo = post.id;
      const notice = document.querySelector('#replying');
      notice.textContent = `${post.name}님의 발언에 답글을 씁니다. 취소하려면 다시 누르세요.`;
      notice.classList.add('show');
      notice.onclick = () => { replyTo = ''; notice.classList.remove('show'); };
      document.querySelector('#roomInput').focus();
    });
    card.append(body, reply);
    feed.append(card);
  });
  if (lastRoomPost) feed.scrollTop = feed.scrollHeight;
}

async function pollRoom() {
  try {
    const response = await fetch('/api/room', { cache: 'no-store' });
    const data = await response.json();
    const previousLast = roomPosts.at(-1)?.id || '';
    roomPosts = data.posts || [];
    const currentLast = roomPosts.at(-1)?.id || '';
    if (currentLast !== previousLast) lastRoomPost = currentLast;
    renderRoom();
  } catch {
    document.querySelector('#roomStatus').innerHTML = '<i></i>연결 재시도 중';
  }
}

document.querySelector('#chatForm').addEventListener('submit', event => { event.preventDefault(); sendChat(); });
input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendChat(); } });
document.querySelectorAll('.stage').forEach(button => button.addEventListener('click', () => {
  state.stage = button.dataset.stage;
  state.messages = [];
  renderStage();
  renderChat();
  scheduleNudge();
}));
document.querySelector('#recordBtn').addEventListener('click', () => openPresentationModal());
function closePresentation() {
  presentationSlot = null;
  document.querySelector('#presentationModal').classList.remove('open');
}
document.querySelector('#closePresentation').addEventListener('click', closePresentation);
document.querySelector('#cancelPresentation').addEventListener('click', closePresentation);
document.querySelector('#presentationModal').addEventListener('click', event => { if (event.target.id === 'presentationModal') closePresentation(); });
document.querySelector('#savePresentation').addEventListener('click', savePresentation);
document.querySelector('#profileName').addEventListener('change', event => switchStudent(event.target.value));
document.querySelector('#saveTopicButton').addEventListener('click', saveClassTopic);
document.querySelector('#personaSelect').addEventListener('change', event => {
  state.persona = event.target.value;
  persist();
  renderCharacter(true);
});
document.querySelector('#teacherToggle').addEventListener('click', () => {
  teacherMode = !teacherMode;
  localStorage.setItem('courtroom-teacher-mode', String(teacherMode));
  renderClassBoard({ ...latestClassBoard, members: classMembers });
  document.querySelector('#teacherToggle').classList.toggle('active', teacherMode);
  document.querySelector('#teacherToggle').textContent = teacherMode ? '교사 지원 보기 · 켜짐' : '교사 지원 보기';
});
document.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => {
  const prompts = { starter: '첫 문장을 어떻게 시작하면 좋을까요?', organize: '내 생각을 주장, 이유, 예시로 정리하는 걸 도와주세요.', quiet: '반대쪽에서 제게 할 법한 질문을 던져주세요.' };
  sendChat(prompts[button.dataset.tool]);
}));
document.querySelectorAll('[data-nav]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-nav]').forEach(nav => nav.classList.toggle('active', nav === button));
  if (button.dataset.nav === 'notes') {
    openThoughtNote();
  }
  if (button.dataset.nav === 'rights') {
    renderMessage({ who: 'bot', text: '헌법 원문은 국가법령정보센터에서 확인하세요. 생활 속 쟁점의 쉬운 설명은 찾기쉬운 생활법령정보에서 찾아볼 수 있어요.', sources: [
      { title: '대한민국헌법 · 국가법령정보센터', url: 'https://www.law.go.kr/법령/대한민국헌법' },
      { title: '아동·청소년/교육 분야 생활법령', url: 'https://www.easylaw.go.kr/CSP/CsmSortRetrieveLst.laf?sortType=cate&csmAstSeq=2' }
    ] });
  }
  if (button.dataset.nav === 'debate') {
    state.messages = [];
    renderStage();
    renderChat();
  }
}));
function closeNote() { document.querySelector('#noteModal').classList.remove('open'); }
document.querySelector('#closeModal').addEventListener('click', closeNote);
document.querySelector('#cancelNote').addEventListener('click', closeNote);
document.querySelector('#saveNote').addEventListener('click', () => {
  state.note = document.querySelector('#noteText').value;
  persist();
  closeNote();
  toast('생각 노트를 저장했어요.');
});
document.querySelector('#noteModal').addEventListener('click', event => { if (event.target.id === 'noteModal') closeNote(); });
document.querySelector('#roomForm').addEventListener('submit', async event => {
  event.preventDefault();
  const field = document.querySelector('#roomInput');
  const text = field.value.trim();
  if (!text) return;
  const button = document.querySelector('.room-send');
  button.disabled = true;
  try {
    const response = await fetch('/api/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ side: document.querySelector('#roomSide').value, name: document.querySelector('#roomName').value, persona: state.persona, body: text, replyTo })
    });
    if (!response.ok) throw new Error('발언을 등록하지 못했어요. 다시 시도해 주세요.');
    const result = await response.json();
    if (document.querySelector('#roomName').value.trim() === activeStudent) {
      state.participations = (state.participations || 0) + 1;
      state.thoughtHistory.push({ id: `room-${result.post.id}`, type: 'public-debate', text, side: result.post.side, at: result.post.at, stage: state.stage });
      persist();
      renderProgress();
      renderCharacter(true);
    }
    field.value = '';
    replyTo = '';
    document.querySelector('#replying').classList.remove('show');
    await pollRoom();
    await pollClassBoard();
  } catch (error) { toast(error.message); }
  finally { button.disabled = false; }
});

const articleChoices = {
  10: { title: '제10조 · 인간의 존엄과 가치', short: '인간의 존엄과 행복 추구' },
  11: { title: '제11조 · 평등권', short: '법 앞의 평등과 차별 금지' },
  17: { title: '제17조 · 사생활의 비밀과 자유', short: '개인 생활과 사적인 정보 보호' },
  21: { title: '제21조 · 표현의 자유', short: '의견을 말하고 나눌 자유' },
  31: { title: '제31조 제1항 · 교육을 받을 권리', short: '능력에 따라 균등하게 교육받을 권리' },
  37: { title: '제37조 제2항 · 기본권 제한의 한계', short: '권리 제한은 필요한 범위와 법률에 따라야 함' }
};
const gameQuestionBank = [
  { prompt: '친구가 허락 없이 내 휴대전화 사진첩을 열어봤어요. 가장 직접 연결되는 권리는 무엇일까요?', hint: '개인의 사적인 생활과 정보를 지키는 권리예요.', answer: 17, options: [10, 17, 21, 31], explanation: '헌법 제17조는 모든 국민이 사생활의 비밀과 자유를 침해받지 않는다고 정합니다.' },
  { prompt: '학생이 학교 규칙에 대한 자기 의견을 발표하고 친구들과 토론합니다. 어떤 권리와 가장 가까울까요?', hint: '생각과 의견을 표현하고 다른 사람과 나누는 권리예요.', answer: 21, options: [10, 11, 21, 37], explanation: '헌법 제21조 제1항은 언론·출판과 집회·결사의 자유를 보장합니다. 구체적인 학교 상황도 함께 살펴봐야 해요.' },
  { prompt: '모든 학생이 능력에 따라 차별 없이 교육받을 기회를 가져야 합니다. 어떤 조항을 찾아볼까요?', hint: '조항 제목에 ‘교육’이 직접 들어 있어요.', answer: 31, options: [11, 17, 31, 37], explanation: '헌법 제31조 제1항은 모든 국민이 능력에 따라 균등하게 교육을 받을 권리를 가진다고 정합니다.' },
  { prompt: '학교가 기본권을 제한하는 규칙을 만들 때, 꼭 필요한 범위인지 따져보려 합니다. 어떤 조항이 기준이 될까요?', hint: '기본권을 제한할 때 지켜야 할 조건을 담은 조항이에요.', answer: 37, options: [10, 17, 21, 37], explanation: '헌법 제37조 제2항은 자유와 권리를 필요한 경우에 한해 법률로 제한할 수 있고, 본질적인 내용을 침해할 수 없다고 정합니다.' },
  { prompt: '학생의 배경이 다르다는 이유로 학교 활동 기회를 다르게 주면 안 된다는 생각과 가장 가까운 권리는?', hint: '모두를 같은 기준으로 대해야 한다는 권리예요.', answer: 11, options: [10, 11, 17, 31], explanation: '헌법 제11조는 모든 국민이 법 앞에 평등하고 차별받지 않는다는 원칙을 둡니다.' },
  { prompt: '학생을 단지 규칙을 따라야 하는 대상으로만 보지 않고, 존엄과 행복을 지닌 사람으로 존중해야 합니다. 어떤 조항일까요?', hint: '헌법의 기본권 장을 여는 인간의 존엄에 관한 조항이에요.', answer: 10, options: [10, 17, 21, 31], explanation: '헌법 제10조는 모든 국민의 인간으로서의 존엄과 가치, 행복추구권을 선언합니다.' }
];
let gameQuestion = null;
let gameDeck = [];
let gameScore = 0;
let gameStreak = 0;
let gameTimeLeft = 45;
let gameQuestionNumber = 0;
let gameAttempts = 0;
let gameSelectedIndex = 0;
let gameStarted = false;
let gameTimerId;
let gameTransitionId;
const gameGoal = 10;
function gameBestKey() { return `courtroom-law-game-best:${activeStudent}`; }
function gameBestScoreKey() { return `courtroom-law-game-best-score:${activeStudent}`; }
function refreshGameBadges() {
  document.querySelector('#gameScore').textContent = `점수 ${gameScore} · 최고 ${Number(localStorage.getItem(gameBestScoreKey()) || 0)}`;
  document.querySelector('#gameStreak').textContent = `연속 ${gameStreak}`;
  document.querySelector('#gameTimer').textContent = `${gameTimeLeft}초`;
  document.querySelector('#gameTimer').classList.toggle('low', gameTimeLeft <= 10);
}
function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}
function updateFlightProgress() {
  const progress = Math.min(gameScore / gameGoal * 100, 100);
  document.querySelector('#flightFill').style.width = `${progress}%`;
  document.querySelector('#gamePlane').style.setProperty('--flight-progress', `${progress}%`);
  document.querySelector('#gamePlane').style.setProperty('--flight-altitude', `${34 + (gameScore % 4) * 10}%`);
}
function startConstitutionGame() {
  clearInterval(gameTimerId);
  clearTimeout(gameTransitionId);
  gameDeck = shuffled(gameQuestionBank);
  gameScore = 0;
  gameStreak = 0;
  gameTimeLeft = 45;
  gameQuestionNumber = 0;
  gameStarted = true;
  document.querySelector('#gameIntro').hidden = true;
  document.querySelector('#gameSession').hidden = false;
  document.querySelector('#gameResult').hidden = true;
  document.querySelector('#gamePlay').hidden = false;
  refreshGameBadges();
  updateFlightProgress();
  renderGameQuestion();
  gameTimerId = setInterval(() => {
    gameTimeLeft -= 1;
    refreshGameBadges();
    if (gameTimeLeft <= 0) finishConstitutionGame(false);
  }, 1000);
}
function renderGameQuestion() {
  if (!gameDeck.length) gameDeck = shuffled(gameQuestionBank);
  gameQuestion = gameDeck.pop();
  gameAttempts = 0;
  gameSelectedIndex = 0;
  document.querySelector('#gameRound').textContent = `점수 ${gameScore} · ${Math.max(0, gameGoal - gameScore)}점 더 모으면 도착`;
  document.querySelector('#gameRoundScore').textContent = `상황 ${gameQuestionNumber + 1}`;
  document.querySelector('#gamePrompt').textContent = gameQuestion.prompt;
  document.querySelector('#gameFeedback').textContent = '';
  document.querySelector('#gameFeedback').className = 'game-feedback';
  const choices = document.querySelector('#gameChoices');
  choices.innerHTML = '';
  shuffled(gameQuestion.options).forEach((article, index) => {
    const option = articleChoices[article];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `game-choice ${index === 0 ? 'selected' : ''}`;
    button.dataset.article = String(article);
    const title = document.createElement('strong');
    title.textContent = `${index + 1}. ${option.title}`;
    const description = document.createElement('span');
    description.textContent = option.short;
    button.append(title, description);
    button.addEventListener('mouseenter', () => selectFlightChoice(index));
    button.addEventListener('focus', () => selectFlightChoice(index));
    button.addEventListener('click', () => answerGameQuestion(article, button));
    choices.append(button);
  });
  choices.focus({ preventScroll: true });
  gameQuestionNumber += 1;
}
function selectFlightChoice(index) {
  const buttons = [...document.querySelectorAll('.game-choice')];
  gameSelectedIndex = (index + buttons.length) % buttons.length;
  buttons.forEach((button, buttonIndex) => button.classList.toggle('selected', buttonIndex === gameSelectedIndex));
  document.querySelector('#gamePlane').style.setProperty('--flight-altitude', `${24 + Math.floor(gameSelectedIndex / 2) * 28}%`);
}
function saveGameThought(question, article, correct) {
  const at = Date.now();
  const chosen = articleChoices[article];
  state.thoughtHistory.push({
    id: `game-answer-${at}`,
    type: 'game-answer',
    text: `상황: ${question.prompt} 내가 고른 조항: ${chosen.title}. ${correct ? '정답을 찾았어요.' : '힌트를 보고 다시 살펴봤어요.'}`,
    at,
    stage: state.stage,
    sources: [{ title: '대한민국헌법 · 국가법령정보센터', url: 'https://www.law.go.kr/법령/대한민국헌법' }]
  });
  persist();
}
function showGameExplanation(question, success) {
  const feedback = document.querySelector('#gameFeedback');
  feedback.className = `game-feedback ${success ? 'good' : 'try'}`;
  feedback.textContent = `${success ? '정답! +1점. ' : `정답은 ${articleChoices[question.answer].title}예요. `}${question.explanation}`;
  const link = document.createElement('a');
  link.className = 'game-source';
  link.href = 'https://www.law.go.kr/법령/대한민국헌법';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = ' 헌법 원문';
  feedback.append(link);
}
function queueNextFlightQuestion(delay = 700) {
  gameTransitionId = setTimeout(() => {
    if (gameStarted) renderGameQuestion();
  }, delay);
}
function answerGameQuestion(article, button) {
  if (!gameStarted || button.disabled) return;
  const correct = article === gameQuestion.answer;
  saveGameThought(gameQuestion, article, correct);
  if (correct) {
    gameScore += 1;
    gameStreak += 1;
    gameAttempts = 0;
    button.classList.add('correct');
    document.querySelectorAll('.game-choice').forEach(choice => { choice.disabled = true; });
    const bestStreak = Math.max(gameStreak, Number(localStorage.getItem(gameBestKey()) || 0));
    localStorage.setItem(gameBestKey(), String(bestStreak));
    refreshGameBadges();
    updateFlightProgress();
    showGameExplanation(gameQuestion, true);
    if (gameScore >= gameGoal) {
      clearInterval(gameTimerId);
      gameTransitionId = setTimeout(() => finishConstitutionGame(true), 750);
    }
    else queueNextFlightQuestion();
    return;
  }

  gameAttempts += 1;
  gameStreak = 0;
  gameTimeLeft = Math.max(0, gameTimeLeft - 2);
  button.disabled = true;
  button.classList.add('incorrect');
  refreshGameBadges();
  const feedback = document.querySelector('#gameFeedback');
  feedback.className = 'game-feedback try';
  if (gameAttempts < 2) {
    feedback.textContent = `살짝 빗나갔어요. 시간 -2초. 힌트: ${gameQuestion.hint} 다시 조종해보세요.`;
  } else {
    document.querySelectorAll('.game-choice').forEach(choice => {
      choice.disabled = true;
      if (Number(choice.dataset.article) === gameQuestion.answer) choice.classList.add('correct');
    });
    showGameExplanation(gameQuestion, false);
    queueNextFlightQuestion(1250);
  }
  if (gameTimeLeft <= 0) finishConstitutionGame(false);
}
async function finishConstitutionGame(reachedDestination) {
  if (!gameStarted) return;
  gameStarted = false;
  clearInterval(gameTimerId);
  clearTimeout(gameTransitionId);
  document.querySelector('#gamePlay').hidden = true;
  document.querySelector('#gameResult').hidden = false;
  document.querySelector('#gameResultTitle').textContent = reachedDestination ? '목적지 도착! 멋진 비행이었어요.' : '시간 종료! 착륙 완료';
  const bestScore = Math.max(gameScore, Number(localStorage.getItem(gameBestScoreKey()) || 0));
  localStorage.setItem(gameBestScoreKey(), String(bestScore));
  const resultText = document.querySelector('#gameResultText');
  resultText.textContent = reachedDestination
    ? `${gameTimeLeft}초를 남기고 ${gameScore}점을 모아 목적지에 도착했어요. 내 최고 점수는 ${bestScore}점입니다.`
    : `제한 시간이 끝났어요. ${gameScore}점을 모았고, 내 최고 점수는 ${bestScore}점입니다.`;
  const at = Date.now();
  state.thoughtHistory.push({ id: `game-complete-${at}`, type: 'game-complete', text: `헌법 조항 비행 완료: ${gameScore}점${reachedDestination ? ', 목적지 도착' : ', 시간 종료'}.`, at, stage: state.stage });
  persist();
  try {
    const response = await fetch('/api/class/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'participation', source: 'constitutional-game', name: activeStudent, persona: state.persona })
    });
    if (response.ok) {
      await pollClassBoard();
      resultText.textContent += ' 학급 레이스 참여에도 반영했어요.';
    }
  } catch {}
}
function handleFlightKeys(event) {
  if (!gameStarted || event.altKey || event.ctrlKey || event.metaKey) return;
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', '1', '2', '3', '4'].includes(event.key)) return;
  if (event.target.matches('input, textarea, select')) return;
  const buttons = [...document.querySelectorAll('.game-choice')];
  if (!buttons.length) return;
  if (/^[1-4]$/.test(event.key)) {
    event.preventDefault();
    buttons[Number(event.key) - 1]?.click();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (gameSelectedIndex >= 2) selectFlightChoice(gameSelectedIndex - 2);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (gameSelectedIndex < 2) selectFlightChoice(gameSelectedIndex + 2);
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    selectFlightChoice(gameSelectedIndex % 2 === 0 ? gameSelectedIndex + 1 : gameSelectedIndex - 1);
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    buttons[gameSelectedIndex]?.click();
  }
}
document.addEventListener('keydown', handleFlightKeys);
document.querySelector('#gameStart').addEventListener('click', startConstitutionGame);
document.querySelector('#gameAgain').addEventListener('click', startConstitutionGame);

renderStage();
renderProgress();
renderChat();
checkStatus();
pollRoom();
pollClassBoard();
pollClassTopic();
refreshGameBadges();
setInterval(pollRoom, 2500);
setInterval(pollClassBoard, 2500);
setInterval(pollClassTopic, 6000);
scheduleNudge();
