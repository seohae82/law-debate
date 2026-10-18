import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const roomPosts = [];
const classMembers = new Map();
const defaultTopic = { title: '학교의 휴대전화 일괄 수거는 정당한가?', scenario: '학교의 수업 집중과 생활지도를 위한 휴대전화 보관이 학생의 사생활·표현의 자유와 어떻게 균형을 이루어야 하는지 토론합니다.' };
let classTopic = { ...defaultTopic, updatedAt: Date.now() };
let constitutionCache;
let lawApiState = 'not_checked';
let cachedLawKey = '';

async function loadSecrets() {
  try {
    const contents = await readFile(resolve(root, '.env'), 'utf8');
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!match) continue;
      let value = match[2];
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
      process.env[match[1]] = value;
    }
  } catch {}
  const lawKey = process.env.MOLEG_API_KEY || '';
  if (lawKey !== cachedLawKey) {
    cachedLawKey = lawKey;
    constitutionCache = undefined;
    lawApiState = 'not_checked';
  }
}

function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(body));
}

async function readBody(request, maxBytes = 12000) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > maxBytes) throw new Error('too_large');
  }
  return JSON.parse(body || '{}');
}

async function fetchJson(url, timeout = 9000) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeout), headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`upstream_${response.status}`);
  const data = await response.json();
  if (data?.resultCode && data.resultCode !== '00') throw new Error(`moleg_${data.resultCode}`);
  return data;
}

async function getConstitution() {
  if (!constitutionCache) constitutionCache = (async () => {
    const key = process.env.MOLEG_API_KEY;
    if (!key) return [];
    const url = new URL('https://www.law.go.kr/DRF/lawService.do');
    url.search = new URLSearchParams({ OC: key, target: 'law', MST: '61603', type: 'JSON' });
    const data = await fetchJson(url);
    const articles = data?.법령?.조문?.조문단위;
    if (!Array.isArray(articles)) {
      const message = String(data?.resultMsg || '');
      lawApiState = /승인|신청|등록|권한|서비스/i.test(message) ? 'service_approval_needed' : /인증|키|key|oc/i.test(message) ? 'credential_rejected' : 'api_response_message';
      return [];
    }
    lawApiState = 'ok';
    const wanted = new Set(['10', '11', '17', '18', '21', '31', '37']);
    const excerpts = articles.filter(article => wanted.has(article.조문번호)).map(article => {
      const paragraphs = Array.isArray(article.항) ? article.항.map(item => item.항내용).join(' ') : '';
      return { number: article.조문번호, text: [article.조문내용, paragraphs].filter(Boolean).join(' ').trim() };
    }).filter(article => article.text);
    return [{ id: 'constitution', title: '대한민국헌법 · 국가법령정보센터', url: 'https://www.law.go.kr/법령/대한민국헌법', excerpt: excerpts.map(item => item.text).join('\n') }];
  })().catch(error => { lawApiState = error.message.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'request_failed'; return []; });
  return constitutionCache;
}

function relevantStatutes(query) {
  const titles = [];
  if (/학교|교육|학생|교실|수업|휴대전화|스마트폰/.test(query)) titles.push('초·중등교육법', '교육기본법');
  if (/개인정보|사생활|휴대전화|스마트폰|촬영|검색/.test(query)) titles.push('개인정보 보호법');
  if (/표현|게시|언론|인터넷|온라인/.test(query)) titles.push('정보통신망 이용촉진 및 정보보호 등에 관한 법률');
  if (/선거|투표|정당|선거운동/.test(query)) titles.push('공직선거법', '정당법');
  if (/대통령|국회|탄핵|권력분립|국무총리/.test(query)) titles.push('국회법', '헌법재판소법', '정부조직법');
  if (/노동|근로|임금|노동조합/.test(query)) titles.push('근로기준법', '노동조합 및 노동관계조정법');
  if (/차별|평등|장애|인권/.test(query)) titles.push('국가인권위원회법', '장애인차별금지 및 권리구제 등에 관한 법률');
  if (/환경|기후|오염|환경권/.test(query)) titles.push('환경정책기본법', '환경보건법');
  if (/집회|시위/.test(query)) titles.push('집회 및 시위에 관한 법률');
  return [...new Set(titles)].slice(0, 3);
}

async function searchStatute(title) {
  const key = process.env.MOLEG_API_KEY;
  if (!key) return [];
  const url = new URL('https://www.law.go.kr/DRF/lawSearch.do');
  url.search = new URLSearchParams({ OC: key, target: 'law', type: 'JSON', query: title, display: '3' });
  const data = await fetchJson(url);
  const laws = data?.LawSearch?.law;
  return (Array.isArray(laws) ? laws : laws ? [laws] : []).map(law => ({
    title: law.법령명한글,
    url: `https://www.law.go.kr/법령/${encodeURIComponent(law.법령명한글 || title)}`,
    excerpt: `${law.법령구분명 || '법령'} · 시행일 ${law.시행일자 || '정보 확인 필요'}`,
    id: `statute-${law.법령ID || title}`
  }));
}

function plainText(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replace(/\s+/g, ' ').trim();
}

async function searchEasyLaw(query) {
  const url = new URL('https://www.easylaw.go.kr/CSP/UnScRlt.laf');
  url.searchParams.set('search_put', query.slice(0, 100));
  const response = await fetch(url, { signal: AbortSignal.timeout(9000), headers: { 'User-Agent': 'ClassroomDebate/1.0', Accept: 'text/html' } });
  if (!response.ok) throw new Error(`upstream_${response.status}`);
  const html = await response.text();
  const results = [];
  const pattern = /<a\b[^>]*href=["']([^"']*CnpClsMain\.laf[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(pattern)) {
    const href = match[1].replace(/&amp;/g, '&');
    const title = plainText(match[2]);
    if (!title || /javascript:/i.test(href)) continue;
    const tailHtml = html.slice(match.index + match[0].length, match.index + match[0].length + 1500);
    const nextLink = tailHtml.search(/<a\b/i);
    const tail = nextLink < 0 ? tailHtml : tailHtml.slice(0, nextLink);
    const excerpt = plainText(tail).slice(0, 360);
    let articleUrl;
    try { articleUrl = new URL(href, 'https://www.easylaw.go.kr/CSP/').href; } catch { continue; }
    if (!articleUrl.startsWith('https://www.easylaw.go.kr/')) continue;
    results.push({ id: `easylaw-${results.length + 1}`, title, url: articleUrl, excerpt });
    if (results.length === 25) break;
  }
  const terms = [...new Set((query.match(/[가-힣]{2,}/g) || []).filter(term => !/^(학교에서|학생들의|학생은|학생이|수업에서|수업시간|어떻게|해야할까요|정당한가요)$/.test(term)))];
  return results.map(item => ({ ...item, relevance: terms.reduce((score, term) => score + Number(`${item.title} ${item.excerpt}`.includes(term)), 0) }))
    .sort((a, b) => b.relevance - a.relevance).slice(0, 4).map(({ relevance, ...item }) => item);
}

async function retrieveSources(query) {
  const easyQuery = /학교|학생|교실|수업/.test(query) && /휴대|폰|스마트|전화/.test(query) ? '교육분야 개인정보보호 휴대전화' : query;
  const [constitution, easyResults, statutes] = await Promise.all([
    getConstitution(),
    searchEasyLaw(easyQuery).catch(() => []),
    Promise.all(relevantStatutes(query).map(title => searchStatute(title).catch(() => [])))
  ]);
  const easylaw = easyResults.length || easyQuery === query ? easyResults : await searchEasyLaw(query).catch(() => []);
  const easySearch = new URL('https://www.easylaw.go.kr/CSP/UnScRlt.laf');
  easySearch.searchParams.set('search_put', query.slice(0, 100));
  const results = [
    ...constitution,
    ...statutes.flat(),
    ...easylaw,
    ...(!constitution.length ? [{ id: 'constitution-reference', title: '대한민국헌법 원문 · 국가법령정보센터', url: 'https://www.law.go.kr/법령/대한민국헌법', excerpt: '제10조: 모든 국민은 인간으로서의 존엄과 가치를 가지며, 행복을 추구할 권리를 가진다. 제17조: 모든 국민은 사생활의 비밀과 자유를 침해받지 아니한다. 제21조 제1항: 모든 국민은 언론·출판의 자유와 집회·결사의 자유를 가진다. 제31조 제1항: 모든 국민은 능력에 따라 균등하게 교육을 받을 권리를 가진다. 제37조 제2항: 국가안전보장·질서유지 또는 공공복리를 위해 필요한 경우에 한하여 법률로써 자유와 권리를 제한할 수 있고, 본질적인 내용은 침해할 수 없다.' }] : []),
    ...(!easylaw.length ? [{ id: 'easylaw-search', title: '생활법령정보 검색 결과', url: easySearch.href, excerpt: '질문과 관련된 쉬운 법령 설명을 공식 사이트에서 찾아보세요.' }] : [])
  ];
  const seen = new Set();
  return results.filter(item => {
    if (!item.title || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  }).slice(0, 9);
}

function isDebateTopicRelated(message, topic) {
  const anchors = `${topic.title} ${topic.scenario}`.match(/[가-힣]{2,}/g) || [];
  const stopWords = new Set(['하는', '어떤', '그리고', '위한', '관련', '대해', '학생의', '학교의', '수업의', '토론합니다']);
  const topicMatch = anchors.some(word => word.length >= 2 && !stopWords.has(word) && message.includes(word));
  return topicMatch || /헌법|제\s*\d+조|권리|기본권|찬성|반대|평등|차별|존엄|공익|발언|토론|발표|근거|상대|반론|제한|막막|모르겠|어떻게|도와|궁금|첫 문장/.test(message);
}

function getOrCreateClassMember(name, persona) {
  const student = String(name || '학생').trim().slice(0, 12) || '학생';
  const legacyPersonas = { owl: 'rooster', fox: 'tiger', turtle: 'ox', whale: 'dragon' };
  const zodiacPersonas = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
  const character = legacyPersonas[persona] || (zodiacPersonas.includes(persona) ? persona : 'rat');
  const member = classMembers.get(student) || { name: student, persona: character, presentations: 0, presentationSlots: [], participations: 0, helpRequested: false, activityTrail: [] };
  member.persona = character;
  if (!Array.isArray(member.presentationSlots)) member.presentationSlots = [];
  if (!Array.isArray(member.activityTrail)) member.activityTrail = [];
  member.growthPoints = member.presentations * 3 + member.participations;
  member.level = Math.floor(member.growthPoints / 3);
  classMembers.set(member.name, member);
  return member;
}

function recordClassActivity(name, persona, type, details = {}) {
  const member = getOrCreateClassMember(name, persona);
  if (type === 'presentation') {
    const slot = Number(details.slot);
    const slots = new Set(member.presentationSlots);
    if (details.action === 'check' && !slots.has(slot)) {
      slots.add(slot);
      member.activityTrail.push({ type: 'presentation', label: `발표 ${slot + 1} 기록`, at: Date.now() });
    } else if (details.action === 'uncheck' && slots.has(slot)) {
      slots.delete(slot);
      member.activityTrail.push({ type: 'edit', label: `발표 ${slot + 1} 체크 수정`, at: Date.now() });
    }
    member.presentationSlots = [...slots].sort((a, b) => a - b);
    member.presentations = member.presentationSlots.length;
  } else {
    member.participations += 1;
    const labels = { coach: '코치에게 질문', 'public-debate': '공개 토론 발언', 'constitutional-game': '조항 비행 게임', 'constitutional-tetris': '조항 테트리스' };
    member.activityTrail.push({ type: 'participation', label: labels[details.source] || '토론 참여', at: Date.now() });
  }
  member.activityTrail = member.activityTrail.slice(-12);
  member.growthPoints = member.presentations * 3 + member.participations;
  member.level = Math.floor(member.growthPoints / 3);
  member.updatedAt = Date.now();
  classMembers.set(member.name, member);
  return { ...member };
}

function getClassBoard() {
  const members = [...classMembers.values()].sort((a, b) => b.growthPoints - a.growthPoints || a.name.localeCompare(b.name, 'ko'));
  return {
    members,
    totals: {
      students: members.length,
      presentations: members.reduce((total, member) => total + member.presentations, 0),
      participations: members.reduce((total, member) => total + member.participations, 0)
    }
  };
}

async function generateFeedback({ message, history, stage, position, topic, articleCard }) {
  const sources = await retrieveSources(`${topic.title} ${topic.scenario} ${message}`.slice(0, 360));
  const key = process.env.UPSTAGE_API_KEY;
  if (!key) {
    const onTopic = isDebateTopicRelated(message, topic);
    const creative = onTopic && /대안|제안|새로운|다르게|방법/.test(message);
    const logical = onTopic && /왜냐|때문|근거|따라서|그러므로|예를 들어|첫째|둘째/.test(message);
    const praise = [creative ? '현실적인 대안을 떠올린 점이 창의적이에요.' : '', logical ? '주장과 이유를 연결한 점이 논리적이에요.' : ''].filter(Boolean).join(' ');
    return {
      aiConnected: false,
      onTopic,
      feedback: onTopic
        ? `${praise ? `${praise} ` : ''}공식 자료를 찾아봤어요. 아래 근거를 살펴보고, 어떤 권리와 공익이 부딪히는지 비교해 보세요.`
        : `잠깐, 이곳은 헌법 토론 생각을 나누는 공간이에요. “${topic.title}”와 연결되는 권리나 근거를 골라 다시 적어볼까요?`,
      creative,
      logical,
      sources: onTopic ? sources : []
    };
  }

  const context = {
    issue: topic.title,
    caseContext: topic.scenario,
    stage,
    position,
    latestStudentStatement: message,
    selectedConstitutionCard: articleCard,
    recentPeerDebate: roomPosts.filter(post => post.topicUpdatedAt === topic.updatedAt).slice(-8).map(post => ({ side: post.side, body: post.body })),
    conversation: history.slice(-12),
    officialSources: sources.map(({ title, url, excerpt }) => ({ title, url, excerpt: excerpt.slice(0, 1200) }))
  };
  const response = await fetch('https://api.upstage.ai/v1/chat/completions', {
    method: 'POST',
    signal: AbortSignal.timeout(20000),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'solar-mini4',
      messages: [
        { role: 'system', content: `당신은 대한민국 헌법 모의법정 수업의 토론 코치입니다. 이번 수업의 유일한 토론 주제는 “${topic.title}”입니다. 상황 설명: ${topic.scenario} 최신 학생 발언만 보고 주제와 관련 있는지 판단하세요. 이전 대화가 주제와 관련 있어도 최신 발언이 전혀 다른 잡담·낙서·반복이면 onTopic=false로 하고, 혼내지 말고 현재 주제로 돌아오는 문장 틀과 질문을 제안하세요. 정치·사회적으로 민감한 쟁점이라는 이유만으로 onTopic=false 처리하거나 답변을 피하지 마세요. 그런 주제는 특정 정당·후보를 지지하지 않는 중립적 학습 설명으로 다루고, 충돌하는 기본권과 공익, 찬반의 법적 근거를 균형 있게 비교하세요. 선거운동·정파적 설득이나 영토 쟁점의 선동적 주장을 작성하지 말고, 그런 요청은 중립적 헌법·법령 설명으로 돌려주세요. 관련 발언이면 onTopic=true로 표시하세요. selectedConstitutionCard는 조항을 찾도록 돕는 짧은 학습용 요약이지 정확한 원문 인용이 아닙니다. officialSources에 원문 근거가 없으면 요약을 법 조문처럼 인용하지 말고 국가법령정보센터 원문에서 확인하도록 안내하세요. 학생의 입장을 대신 정하지 말고 구체적인 칭찬과 보완점, 다음 질문을 한국어 존댓말로 답하세요. 창의성과 논리성은 실제 발언에 근거해 평가하고 빈 칭찬은 하지 마세요. 제공된 officialSources만 근거로 인용하며 조항·사실·판례를 만들지 마세요. 헌법 원문과 쉬운 생활법령 설명을 구별하고 법적 결론을 단정하지 마세요. 학생들이 서로 반론과 질문을 주고받도록 도와주세요. 개인정보나 실명 공개를 부추기지 마세요.` },
        ...history.map(item => ({ role: item.role === 'model' ? 'assistant' : 'user', content: item.text })),
        { role: 'user', content: JSON.stringify(context) }
      ],
      temperature: 0.35,
      max_tokens: 700,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'constitution_debate_feedback',
          strict: true,
          schema: {
            type: 'object',
            properties: {
            feedback: { type: 'string' },
            onTopic: { type: 'boolean' },
            creative: { type: 'boolean' },
              logical: { type: 'boolean' },
              sourceIds: { type: 'array', items: { type: 'string' } }
            },
            required: ['feedback', 'onTopic', 'creative', 'logical', 'sourceIds'],
            additionalProperties: false
          }
        }
      }
    })
  });
  if (!response.ok) throw new Error(`upstage_${response.status}`);
  const data = await response.json();
  const output = data?.choices?.[0]?.message?.content;
  if (!output) throw new Error('empty_ai_response');
  const parsed = JSON.parse(output);
  const onTopic = Boolean(parsed.onTopic);
  const citedSources = sources.filter(source => parsed.sourceIds?.includes(source.id));
  return {
    aiConnected: true,
      feedback: onTopic
      ? String(parsed.feedback || '근거를 바탕으로 생각을 한 번 더 다듬어 볼까요?')
      : `잠깐, 이 글은 오늘 주제와 조금 거리가 있어요. 이번 토론은 “${topic.title}”입니다. “이 상황에서 어떤 권리가 관련될까요?” 또는 “서로 다른 권리를 함께 지킬 방법은 무엇일까요?”로 다시 생각해볼까요?`,
    onTopic,
    creative: onTopic && Boolean(parsed.creative),
    logical: onTopic && Boolean(parsed.logical),
    sources: onTopic ? citedSources.length ? citedSources : sources.slice(0, 5) : []
  };
}

async function handleApi(request, response, url) {
  await loadSecrets();
  if (request.method === 'GET' && url.pathname === '/api/status') {
    return json(response, 200, { upstage: Boolean(process.env.UPSTAGE_API_KEY), law: Boolean(process.env.MOLEG_API_KEY), lawApi: lawApiState, room: true });
  }
  if (request.method === 'GET' && url.pathname === '/api/class/topic') return json(response, 200, { topic: classTopic });
  if (request.method === 'POST' && url.pathname === '/api/class/topic') {
    try {
      const body = await readBody(request, 3000);
      const title = String(body.title || '').trim().slice(0, 160);
      const scenario = String(body.scenario || '').trim().slice(0, 700);
      if (title.length < 6 || !/헌법|권리|기본권|평등|표현|사생활|개인정보|교육|학교|학생|휴대|자유|존엄|차별|제한|인권|공익|노동|종교|언론|집회|양심|참정|재산|주거|신체|보건|환경/i.test(`${title} ${scenario}`)) {
        return json(response, 400, { error: '헌법의 권리나 기본권 쟁점과 연결되는 주제를 입력해 주세요.' });
      }
      const changed = title !== classTopic.title || scenario !== classTopic.scenario;
      if (changed) roomPosts.length = 0;
      classTopic = { title, scenario, updatedAt: Date.now() };
      return json(response, 200, { topic: classTopic });
    } catch {
      return json(response, 400, { error: '주제 저장에 실패했습니다.' });
    }
  }
  if (request.method === 'GET' && url.pathname === '/api/room') return json(response, 200, { posts: roomPosts.slice(-80) });
  if (request.method === 'GET' && url.pathname === '/api/class/board') {
    const name = url.searchParams.get('name');
    if (name) getOrCreateClassMember(name, url.searchParams.get('persona'));
    return json(response, 200, getClassBoard());
  }
  if (request.method === 'POST' && url.pathname === '/api/class/support') {
    try {
      const body = await readBody(request, 1500);
      if (!['request', 'resolve'].includes(body.action)) return json(response, 400, { error: 'unsupported_action' });
      const member = getOrCreateClassMember(body.name, body.persona);
      member.helpRequested = body.action === 'request';
      member.supportUpdatedAt = Date.now();
      return json(response, 200, { member, ...getClassBoard() });
    } catch {
      return json(response, 400, { error: 'invalid_support_request' });
    }
  }
  if (request.method === 'POST' && url.pathname === '/api/class/activity') {
    try {
      const body = await readBody(request, 2000);
      if (body.type === 'participation' && ['constitutional-game', 'constitutional-tetris'].includes(body.source)) {
        const member = recordClassActivity(body.name, body.persona, 'participation', { source: body.source });
        return json(response, 201, { member, ...getClassBoard() });
      }
      const slot = Number(body.slot);
      if (body.type !== 'presentation' || !['check', 'uncheck'].includes(body.action) || !Number.isInteger(slot) || slot < 0 || slot > 2) return json(response, 400, { error: 'unsupported_activity' });
      const member = recordClassActivity(body.name, body.persona, 'presentation', { slot, action: body.action });
      return json(response, 201, { member, ...getClassBoard() });
    } catch {
      return json(response, 400, { error: 'invalid_activity' });
    }
  }
  if (request.method === 'POST' && url.pathname === '/api/room') {
    try {
      const body = await readBody(request, 3000);
      const side = ['찬성팀', '반대팀', '배심원'].includes(body.side) ? body.side : '배심원';
      const post = {
        id: crypto.randomUUID(),
        side,
        name: String(body.name || '학생').trim().slice(0, 12) || '학생',
        body: String(body.body || '').trim().slice(0, 700),
        replyTo: String(body.replyTo || '').slice(0, 80),
        topicTitle: classTopic.title,
        topicUpdatedAt: classTopic.updatedAt,
        at: Date.now()
      };
      if (!post.body) return json(response, 400, { error: 'empty_message' });
      const member = recordClassActivity(post.name, body.persona, 'participation', { source: 'public-debate' });
      roomPosts.push(post);
      if (roomPosts.length > 200) roomPosts.splice(0, roomPosts.length - 200);
      return json(response, 201, { post, member });
    } catch {
      return json(response, 400, { error: 'invalid_message' });
    }
  }
  if (request.method === 'POST' && url.pathname === '/api/chat') {
    try {
      const body = await readBody(request);
      const message = String(body.message || '').trim().slice(0, 3000);
      if (!message) return json(response, 400, { error: 'empty_message' });
      const history = Array.isArray(body.history) ? body.history.filter(item => ['user', 'model'].includes(item.role)).slice(-12).map(item => ({ role: item.role, text: String(item.text || '').slice(0, 2000) })) : [];
      const card = body.articleCard && Number.isInteger(Number(body.articleCard.number)) && Number(body.articleCard.number) >= 1 && Number(body.articleCard.number) <= 130
        ? { number: Number(body.articleCard.number), title: String(body.articleCard.title || '').slice(0, 100), summary: String(body.articleCard.summary || '').slice(0, 300) }
        : null;
      const result = await generateFeedback({ message, history, stage: String(body.stage || 'start').slice(0, 12), position: String(body.position || '').slice(0, 24), topic: classTopic, articleCard: card });
      if (result.onTopic) recordClassActivity(body.name, body.persona, 'participation', { source: 'coach' });
      return json(response, 200, result);
    } catch (error) {
      const status = String(error.message).startsWith('upstage_') ? 502 : error.message === 'too_large' ? 413 : 502;
      return json(response, status, { error: status === 502 ? '자료 조회 또는 Upstage 연결에 실패했습니다. 잠시 뒤 다시 시도해 주세요.' : '요청 내용이 너무 깁니다.' });
    }
  }
  return json(response, 404, { error: 'not_found' });
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/')) return handleApi(request, response, url);
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { response.writeHead(400).end(); return; }
  if (pathname.includes('\0') || pathname.split('/').some(part => part.startsWith('.'))) { response.writeHead(404).end(); return; }
  const requested = pathname === '/' ? '/index.html' : pathname;
  const file = resolve(root, `.${requested}`);
  if (!file.startsWith(`${root}/`)) { response.writeHead(404).end(); return; }
  try {
    const content = await readFile(file);
    const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(content);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

server.listen(port, '0.0.0.0');
