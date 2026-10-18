const stages = {
  start: { caption: '처음이라면 아래 예시 질문을 눌러 입장을 골라보세요.', welcome: '처음이라면 아래 예시 질문을 눌러 시작해보세요. 오늘의 사건은 “학교의 휴대전화 일괄 수거는 정당한가?”예요. 찬성·반대 중 마음이 가는 쪽과 이유를 적으면, 토론 코치가 헌법 조항과 공식 자료를 찾아 함께 다듬어드려요.', suggestions: ['찬성 입장을 정리하고 싶어요', '반대 입장을 정리하고 싶어요', '양쪽 주장을 비교해줘요'] },
  middle: { caption: '상대의 반론을 듣고 내 근거를 한 단계 더 다듬어요.', welcome: '토론이 한창이군요. 상대의 말에서 설득력 있었던 점 하나와 궁금한 점 하나를 찾아보세요. 질문을 적어주시면 공식 자료와 함께 살펴볼게요.', suggestions: ['상대 주장을 반박하고 싶어요', '내 주장을 헌법 조항과 연결해줘요', '새로운 해결책을 제안하고 싶어요'] },
  end: { caption: '가장 중요한 근거와 배운 점을 또렷하게 마무리해요.', welcome: '마무리 단계에서는 내 주장을 다시 한 문장으로 말하고, 상대 의견을 들으며 새롭게 생각한 점도 덧붙여 보세요.', suggestions: ['마무리 발언을 정리해줘요', '토론에서 배운 점을 정리하고 싶어요', '내 주장의 빈틈을 확인해줘요'] }
};
const constitutionCardsData = [
  [1, '민주공화국과 국민주권', '대한민국의 국가 형태와 모든 권력이 국민에게서 나온다는 원칙을 정합니다.'],
  [2, '국민의 자격과 국가의 보호', '국민이 되는 요건은 법률로 정하고, 국가는 재외국민을 보호할 의무를 집니다.'],
  [3, '대한민국의 영토', '대한민국의 영토 범위를 한반도와 그 부속도서로 정합니다.'],
  [4, '평화적 통일의 지향', '자유민주적 기본질서에 입각한 평화적 통일 정책을 수립하고 추진하도록 합니다.'],
  [5, '국제평화와 국군의 사명', '침략전쟁을 부인하고 국군의 국가안전보장·국토방위 사명과 정치적 중립을 정합니다.'],
  [6, '조약·국제법과 외국인의 지위', '헌법에 따라 체결된 조약의 국내 효력과 국제법에 따른 외국인의 지위를 다룹니다.'],
  [7, '공무원의 책임과 중립', '공무원은 국민 전체를 위해 봉사하며, 정치적 중립이 보장되어야 합니다.'],
  [8, '정당의 자유와 민주성', '정당 설립과 복수정당제를 보장하고, 정당의 민주적 활동 원칙을 정합니다.'],
  [9, '전통문화와 민족문화', '국가가 전통문화를 계승·발전시키고 민족문화를 창달하도록 노력하게 합니다.'],
  [10, '인간의 존엄과 행복추구권', '모든 사람의 존엄과 행복추구권을 확인하고 국가의 기본권 보장 의무를 정합니다.'],
  [11, '법 앞의 평등', '성별·종교·사회적 신분 등을 이유로 한 차별을 금지하고 평등 원칙을 세웁니다.'],
  [12, '신체의 자유와 적법절차', '체포·구속·수색, 고문 금지, 변호인의 조력 등 신체의 자유를 보호합니다.'],
  [13, '형벌의 소급 금지와 이중처벌 금지', '행위 당시 법률에 따른 처벌, 같은 범죄의 거듭 처벌 금지 등을 정합니다.'],
  [14, '거주·이전의 자유', '국민이 거주하거나 이동할 장소를 정할 자유를 보장합니다.'],
  [15, '직업선택의 자유', '국민이 자신의 직업을 선택할 자유를 보장합니다.'],
  [16, '주거의 자유', '주거의 평온과 자유를 보호하고 압수·수색에 영장을 요구합니다.'],
  [17, '사생활의 비밀과 자유', '개인의 사적인 생활이 부당하게 침해되지 않도록 보호합니다.'],
  [18, '통신의 비밀', '우편·통신 등 사적인 의사소통의 비밀을 보호합니다.'],
  [19, '양심의 자유', '개인이 자신의 양심에 따라 생각하고 판단할 자유를 보장합니다.'],
  [20, '종교의 자유와 정교분리', '종교의 자유를 보장하고 국교를 인정하지 않으며 종교와 정치를 분리합니다.'],
  [21, '언론·출판·집회·결사의 자유', '의견 표현과 집회·결사의 자유를 보장하고 허가·검열을 금지합니다.'],
  [22, '학문·예술의 자유와 창작자 권리', '학문과 예술의 자유, 저작자·발명가 등의 권리를 보호합니다.'],
  [23, '재산권과 공공필요에 따른 보상', '재산권을 보장하되 공공복리와 법률에 따른 제한·정당한 보상을 정합니다.'],
  [24, '선거권', '국민이 법률이 정하는 바에 따라 선거에 참여할 권리를 보장합니다.'],
  [25, '공무담임권', '국민이 법률이 정하는 바에 따라 공직에 취임할 권리를 보장합니다.'],
  [26, '청원권', '국가기관에 문서로 청원할 권리와 국가의 심사 의무를 정합니다.'],
  [27, '재판청구권과 형사절차 권리', '법률에 따른 재판, 신속·공개 재판, 무죄추정 등 사법 절차의 권리를 보장합니다.'],
  [28, '구금에 대한 형사보상', '구금 뒤 불기소나 무죄가 된 경우 법률에 따라 정당한 보상을 청구할 수 있습니다.'],
  [29, '공무원의 불법행위에 대한 배상', '공무원의 직무상 불법행위로 손해를 입은 경우 국가 등에 배상을 청구할 수 있습니다.'],
  [30, '범죄피해자 구조', '범죄로 생명·신체 피해를 입은 국민이 법률에 따라 국가 구조를 받을 수 있습니다.'],
  [31, '교육을 받을 권리와 의무교육', '균등한 교육 기회, 의무교육 무상 원칙, 교육의 자주성·중립성을 정합니다.'],
  [32, '근로의 권리와 근로조건', '근로권·최저임금·인간다운 근로조건과 여성·연소자 보호를 다룹니다.'],
  [33, '근로자의 단결·교섭·행동권', '근로조건 향상을 위한 노동자의 단결권·단체교섭권·단체행동권을 보장합니다.'],
  [34, '인간다운 생활과 사회보장', '사회보장·복지, 여성·노인·청소년·장애인 보호와 재해 예방을 다룹니다.'],
  [35, '환경권과 쾌적한 주거', '건강하고 쾌적한 환경에서 살 권리와 국가의 환경·주거 정책 의무를 정합니다.'],
  [36, '혼인·가족생활과 보건', '개인의 존엄과 양성평등에 기초한 가족생활, 모성 보호와 보건 보호를 정합니다.'],
  [37, '기본권 보장과 제한의 한계', '열거되지 않은 권리도 존중하고, 제한은 필요한 경우에 한하며 본질을 침해하지 못하게 합니다.'],
  [38, '납세의 의무', '국민은 법률이 정하는 바에 따라 세금을 납부할 의무를 집니다.'],
  [39, '국방의 의무와 불이익 금지', '국방의 의무와 병역 이행을 이유로 한 불이익 처우 금지를 정합니다.'],
  [40, '국회의 입법권', '법률을 만드는 권한이 국회에 있음을 정합니다.'],
  [41, '국회의 구성과 선거', '국회의원 선출의 기본 원칙과 국회의원 수·선거제도를 법률로 정하도록 합니다.'],
  [42, '국회의원의 임기', '국회의원의 임기를 4년으로 정합니다.'],
  [43, '국회의원의 겸직 제한', '국회의원이 겸할 수 없는 직을 법률로 정하도록 합니다.'],
  [44, '회기 중 체포 특례', '현행범이 아닌 국회의원의 회기 중 체포·구금에는 국회 동의를 요구합니다.'],
  [45, '국회 발언·표결의 면책', '국회에서 직무상 한 발언과 표결에 대해 국회 밖에서 책임을 지지 않도록 합니다.'],
  [46, '국회의원의 청렴과 직무 의무', '청렴 의무, 국가이익 우선, 양심에 따른 직무와 지위 남용 금지를 정합니다.'],
  [47, '국회의 회기', '정기회·임시회의 소집과 회기 기간을 정합니다.'],
  [48, '국회의장단 선출', '국회가 의장 1명과 부의장 2명을 선출하도록 합니다.'],
  [49, '국회의 의결 원칙', '별도 규정이 없을 때 의결에 필요한 출석·찬성 기준을 정합니다.'],
  [50, '국회 회의의 공개', '국회 회의를 공개하는 원칙과 예외를 정합니다.'],
  [51, '의안의 회기 계속 원칙', '회기 중 처리되지 않은 의안은 원칙적으로 다음 회기에도 이어집니다.'],
  [52, '법률안 제출권', '국회의원과 정부가 법률안을 제출할 수 있도록 합니다.'],
  [53, '법률안 공포와 재의요구', '대통령의 법률안 공포·재의요구와 국회의 재의결 절차를 정합니다.'],
  [54, '예산안 심의·확정', '국회의 예산안 심의와 회계연도에 따른 예산 편성·의결 시한을 정합니다.'],
  [55, '계속비와 예비비', '여러 해 지출할 계속비와 예비비의 국회 의결·승인 절차를 정합니다.'],
  [56, '추가경정예산안', '정부가 예산 변경이 필요할 때 추가경정예산안을 제출할 수 있도록 합니다.'],
  [57, '예산 증액의 제한', '국회가 정부 동의 없이 지출예산을 늘리거나 새 항목을 만들지 못하게 합니다.'],
  [58, '국채와 국가부담 계약', '국채 모집이나 예산 외 국가 부담 계약에 국회 의결을 요구합니다.'],
  [59, '조세법률주의', '세금의 종류와 세율은 법률로 정하도록 합니다.'],
  [60, '조약·전쟁 등에 대한 국회 동의', '중요 조약, 선전포고, 국군 파견 등에 대한 국회의 동의권을 정합니다.'],
  [61, '국정감사와 국정조사', '국회가 국정을 감사·조사하고 자료·증언을 요구할 수 있도록 합니다.'],
  [62, '국무위원의 국회 출석', '국무총리·국무위원 등이 국회에 출석해 보고·답변하는 절차를 정합니다.'],
  [63, '국무총리·국무위원 해임건의', '국회가 정해진 절차와 의결 기준에 따라 해임을 건의할 수 있습니다.'],
  [64, '국회의 자율과 의원 징계', '국회 내부 규칙과 의원 자격심사·징계·제명 절차를 정합니다.'],
  [65, '탄핵소추', '고위 공직자가 헌법·법률을 위반한 경우 국회의 탄핵소추 절차를 정합니다.'],
  [66, '대통령의 지위와 책무', '대통령의 국가 대표 역할, 헌법 수호와 평화통일 책무를 정합니다.'],
  [67, '대통령 선거', '대통령 선출의 보통·평등·직접·비밀선거 원칙과 당선 기준을 정합니다.'],
  [68, '대통령 선거 시기', '임기 만료나 궐위 때 후임자를 선거하는 시한을 정합니다.'],
  [69, '대통령 취임 선서', '대통령이 취임할 때 하는 헌법 준수와 국민 복리 증진의 선서를 정합니다.'],
  [70, '대통령 임기', '대통령 임기는 5년이며 중임할 수 없도록 합니다.'],
  [71, '대통령 권한대행', '대통령이 궐위·사고일 때 권한을 대행할 순서를 정합니다.'],
  [72, '국민투표 부의', '대통령이 국가안위 관련 중요정책을 국민투표에 부칠 수 있도록 합니다.'],
  [73, '대통령의 외교 권한', '조약, 외교사절, 선전포고와 강화에 관한 대통령의 권한을 정합니다.'],
  [74, '국군 통수권', '대통령의 국군 통수와 국군 조직·편성의 법률 근거를 정합니다.'],
  [75, '대통령령', '법률이 위임한 사항과 법률 집행에 필요한 대통령령을 정할 수 있습니다.'],
  [76, '긴급명령과 긴급재정경제처분', '국가 위기에서 필요한 최소한의 긴급조치와 국회 승인 절차를 정합니다.'],
  [77, '계엄 선포와 해제', '비상계엄·경비계엄의 요건, 조치와 국회의 해제 요구를 정합니다.'],
  [78, '공무원 임면', '대통령이 헌법과 법률에 따라 공무원을 임명·면직하도록 합니다.'],
  [79, '사면·감형·복권', '대통령의 사면 권한과 일반사면에 필요한 국회 동의를 정합니다.'],
  [80, '훈장과 영전', '훈장과 그 밖의 영전을 법률에 따라 수여하도록 합니다.'],
  [81, '대통령의 국회 의견 표명', '대통령이 국회에서 발언하거나 서한으로 의견을 전할 수 있습니다.'],
  [82, '대통령 국법행위의 문서화', '대통령의 국법상 행위는 문서로 하고 관계 국무위원 등이 부서하도록 합니다.'],
  [83, '대통령의 겸직 제한', '대통령이 다른 공·사직을 겸할 수 없도록 합니다.'],
  [84, '대통령의 형사상 불소추 특례', '재직 중 내란·외환죄 외에는 형사상 소추를 받지 않는 특례를 정합니다.'],
  [85, '전직 대통령 예우', '전직 대통령의 신분과 예우를 법률로 정하도록 합니다.'],
  [86, '국무총리의 임명과 역할', '국회 동의를 거친 국무총리 임명과 행정각부 통할 역할을 정합니다.'],
  [87, '국무위원의 구성과 임무', '국무위원의 임명, 국정 보좌와 국무회의 참여를 정합니다.'],
  [88, '국무회의의 구성과 심의', '정부의 중요한 정책을 심의하는 국무회의의 구성과 의장을 정합니다.'],
  [89, '국무회의 심의 사항', '예산·조약·법률안·긴급조치 등 국무회의 심의를 거칠 사항을 열거합니다.'],
  [90, '국가원로자문회의', '대통령의 국정 관련 자문을 위한 국가원로자문회의를 둘 수 있도록 합니다.'],
  [91, '국가안전보장회의', '국가안보 관련 정책을 국무회의 심의 전에 자문하는 회의를 둡니다.'],
  [92, '민주평화통일자문회의', '평화통일정책 수립에 관해 대통령에게 자문하는 회의를 둘 수 있습니다.'],
  [93, '국민경제자문회의', '국민경제 발전의 중요 정책에 관해 대통령에게 자문하는 회의를 둘 수 있습니다.'],
  [94, '행정각부의 장 임명', '행정각부의 장을 국무위원 중에서 임명하는 절차를 정합니다.'],
  [95, '총리령·부령', '국무총리와 행정각부의 장이 소관 사무에 관한 명령을 발할 수 있습니다.'],
  [96, '행정각부의 설치', '행정각부의 조직과 직무 범위를 법률로 정하도록 합니다.'],
  [97, '감사원 설치와 기능', '국가 결산·회계 검사와 행정기관·공무원 감찰을 위한 감사원을 둡니다.'],
  [98, '감사원 구성과 임기', '감사원장·감사위원의 구성, 임명과 임기를 정합니다.'],
  [99, '국가 결산 검사', '감사원이 매년 세입·세출 결산을 검사하고 결과를 보고하도록 합니다.'],
  [100, '감사원의 조직과 직무', '감사원의 세부 조직·직무와 감사위원 자격 등을 법률로 정합니다.'],
  [101, '사법권과 법원의 조직', '사법권을 법원에 두고 대법원과 각급법원으로 조직합니다.'],
  [102, '대법원과 법관', '대법원의 부·대법관과 법원 조직의 법률 근거를 정합니다.'],
  [103, '법관의 독립', '법관이 헌법과 법률, 양심에 따라 독립해 재판하도록 합니다.'],
  [104, '법관 임명 절차', '대법원장·대법관 등 법관 임명에 필요한 동의·제청 절차를 정합니다.'],
  [105, '법관의 임기와 정년', '대법원장·대법관·일반 법관의 임기와 정년을 정합니다.'],
  [106, '법관의 신분 보장', '법관을 법률이 정한 사유와 절차 없이 파면·불이익 처분하지 못하게 합니다.'],
  [107, '위헌법률심판과 행정심판', '재판 중인 법률의 위헌 여부와 명령·규칙·처분의 심사 절차를 정합니다.'],
  [108, '대법원의 규칙 제정권', '대법원이 소송 절차와 법원 내부 규칙을 정할 수 있도록 합니다.'],
  [109, '재판의 공개', '재판 심리와 판결은 공개하는 원칙과 비공개 예외를 정합니다.'],
  [110, '군사법원', '군사재판을 위한 군사법원의 설치와 재판 기준을 정합니다.'],
  [111, '헌법재판소의 관장 사항', '위헌법률·탄핵·정당해산·권한쟁의·헌법소원을 심판합니다.'],
  [112, '헌법재판관의 임기와 독립', '헌법재판관의 임기와 정치 관여 금지, 신분 보장을 정합니다.'],
  [113, '헌법재판의 의결 기준', '중요한 헌법재판 결정에 필요한 재판관 찬성 수와 규칙 제정권을 정합니다.'],
  [114, '선거관리위원회', '선거·국민투표를 공정하게 관리하는 독립된 위원회를 둡니다.'],
  [115, '선거관리 지시 권한', '선거관리위원회가 선거·국민투표 사무에 필요한 지시를 할 수 있습니다.'],
  [116, '선거운동의 공정성', '선거운동의 공정한 관리, 균등한 기회와 선거 비용 원칙을 정합니다.'],
  [117, '지방자치단체의 사무', '지방자치단체가 주민 복리 사무·재산 관리와 자치 규정을 맡도록 합니다.'],
  [118, '지방의회와 지방자치 조직', '지방의회를 두고 지방자치단체 조직과 운영을 법률로 정합니다.'],
  [119, '경제질서와 경제민주화', '경제상의 자유와 창의를 존중하며 균형 성장·분배와 경제민주화를 추구합니다.'],
  [120, '자원과 국토의 균형 개발', '주요 자원의 이용 허가와 국토·자원의 보호·균형 개발을 정합니다.'],
  [121, '농지 소유와 이용 원칙', '농지의 경자유전 원칙과 소작제 금지, 제한적인 임대차를 다룹니다.'],
  [122, '국토의 이용·개발·보전', '국토의 효율적이고 균형 있는 이용·개발·보전을 위한 제한을 둘 수 있습니다.'],
  [123, '농어촌·지역·중소기업 지원', '농어촌과 지역경제, 중소기업을 보호·육성하고 농수산물 유통을 지원합니다.'],
  [124, '소비자 보호', '국가가 건전한 소비와 제품 품질을 위한 소비자보호운동을 보장합니다.'],
  [125, '대외무역의 육성', '국가가 대외무역을 육성하고 필요한 경우 규제·조정할 수 있습니다.'],
  [126, '사기업 경영의 자율성', '긴급한 국방·국민경제 필요 외에는 사기업의 국유화·통제를 제한합니다.'],
  [127, '과학기술과 국가표준', '과학기술·정보·인력 개발과 국가표준제도 확립을 위한 국가의 노력을 정합니다.'],
  [128, '헌법개정안의 제안', '대통령 또는 국회 재적의원 과반수가 헌법개정안을 제안할 수 있습니다.'],
  [129, '헌법개정안의 공고', '제안된 헌법개정안을 대통령이 20일 이상 공고하도록 합니다.'],
  [130, '헌법개정안의 의결과 국민투표', '국회 의결과 국민투표를 거쳐 헌법개정이 확정되는 절차를 정합니다.']
];
const defaultClassTopic = { title: '학교의 휴대전화 일괄 수거는 정당한가?', scenario: '학교의 수업 집중과 생활지도를 위한 휴대전화 보관이 학생의 사생활·표현의 자유와 어떻게 균형을 이루어야 하는지 토론합니다.', sources: [] };
let classTopic = { ...defaultClassTopic };
let classTopicLoaded = false;
let topicFormDirty = false;
let topicDraftSources = [];
let topicSuggestionPromise = null;
let topicSuggestionSequence = 0;
const zodiacPersonas = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
const legacyPersonas = { owl: 'rooster', fox: 'tiger', turtle: 'ox', whale: 'dragon' };
function normalizePersona(persona) { return legacyPersonas[persona] || (zodiacPersonas.includes(persona) ? persona : 'rat'); }
const createDefaultState = () => ({ presentations: [], participations: 0, creative: false, logical: false, stage: 'start', messages: [], thoughtHistory: [], note: '', persona: 'rat' });
let legacyState = {};
let profiles = {};
let activeStudent = localStorage.getItem('courtroom-active-student') || '학생';
let profileReady = localStorage.getItem('courtroom-profile-ready') === 'true' || activeStudent !== '학생';
try { legacyState = JSON.parse(localStorage.getItem('courtroom-state') || '{}'); } catch {}
try { profiles = JSON.parse(localStorage.getItem('courtroom-profiles') || '{}'); } catch {}
let state = { ...createDefaultState(), ...(profiles[activeStudent] || (activeStudent === '학생' ? legacyState : {})) };
state.persona = normalizePersona(state.persona);
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
    meta.textContent = checked ? '완료 · 해제하면 뒤 기록도 취소' : '기록 전';
    row.append(check, title, meta);
    list.append(row);
  });
  document.querySelector('#rubricPresent').classList.toggle('met', count >= 3);
  document.querySelector('#rubricCreative').classList.toggle('met', state.creative);
  document.querySelector('#rubricLogic').classList.toggle('met', state.logical);
  document.querySelector('#celebrate').classList.toggle('show', milestoneCount >= 3 && state.creative && state.logical);
  const recordButton = document.querySelector('#recordBtn');
  recordButton.textContent = count >= 3 ? '3회 모두 완료 · 마지막 발표 해제' : '+ 발표 기록하기';
  recordButton.disabled = false;
  renderCharacter();
}

const avatarPalettes = {
  rat: ['#c8b3a2', '#b98764', '#a96e4e', '#754b43'],
  ox: ['#b5bea8', '#8f9c70', '#718254', '#4f623f'],
  tiger: ['#d4bc91', '#d69b47', '#cb743a', '#a94d32'],
  rabbit: ['#d8c9c1', '#d9aba6', '#c98686', '#a95d69'],
  dragon: ['#9ebdb9', '#64a69a', '#438579', '#305f6e'],
  snake: ['#bdc39a', '#99a452', '#748a43', '#53673a'],
  horse: ['#c9ad91', '#aa7954', '#875638', '#613e36'],
  goat: ['#c8c1ad', '#a79a79', '#827553', '#635744'],
  monkey: ['#c3a58e', '#a87958', '#875d46', '#62483f'],
  rooster: ['#d4b98f', '#ca9b48', '#b8753c', '#944a3c'],
  dog: ['#bac2b4', '#8a9c9c', '#607f88', '#465f70'],
  pig: ['#e0b9b2', '#d9958e', '#c87578', '#a75161']
};
function avatarColor(persona, presentations) { return avatarPalettes[persona]?.[Math.min(presentations, 3)] || avatarPalettes.rat[0]; }

function characterSvg(persona, count, presentations = count) {
  const animals = {
    rat: { name: '쥐', ears: '<circle cx="31" cy="38" r="12"/><circle cx="69" cy="38" r="12"/><circle cx="31" cy="38" r="6" fill="#efc5bd"/><circle cx="69" cy="38" r="6" fill="#efc5bd"/>', back: '<path d="M73 73q21-3 16 10-3 5-13 3" fill="none" stroke="#8f6755" stroke-width="3"/>', markings: '', muzzle: '<ellipse cx="50" cy="66" rx="12" ry="8" fill="#f2ddd2"/><path d="M38 65 25 61m14 9-14 1m37-6 13-4m-12 9 13 1" fill="none" stroke="#57443e" stroke-width="1.5"/>', nose: '<path d="m47 62 3 3 3-3Z" fill="#a75161"/>' },
    ox: { name: '소', ears: '<path d="M29 41Q13 33 17 24q9 1 18 13m36 4q16-8 12-17-9 1-18 13"/><path d="M38 33Q35 17 43 15q8 6 6 17m3 0q-2-11 7-17 8 3 3 18" fill="#f2ead0"/>', back: '', markings: '<path d="M43 33q7-8 14 0" fill="none" stroke="#fff2d5" stroke-width="5" stroke-linecap="round"/>', muzzle: '<ellipse cx="50" cy="66" rx="16" ry="11" fill="#eee4d1"/><circle cx="44" cy="66" r="2" fill="#584b42"/><circle cx="56" cy="66" r="2" fill="#584b42"/>', nose: '' },
    tiger: { name: '호랑이', ears: '<circle cx="31" cy="36" r="10"/><circle cx="69" cy="36" r="10"/><circle cx="31" cy="36" r="5" fill="#f1d1a0"/><circle cx="69" cy="36" r="5" fill="#f1d1a0"/>', back: '', markings: '<path d="m38 38 7 7m17-7-7 7M28 53l11 3m33-3-11 3m-7-22v9" fill="none" stroke="#30343a" stroke-width="3" stroke-linecap="round"/>', muzzle: '<ellipse cx="50" cy="66" rx="13" ry="9" fill="#f7e5ca"/>', nose: '<path d="m47 61 3 3 3-3Z" fill="#523d37"/>' },
    rabbit: { name: '토끼', ears: '<path d="M38 43Q27 22 34 10q11-2 16 31m2 0Q55 13 67 10q8 10-5 33Z"/><path d="M40 36Q35 19 38 15m20 21q7-17 9-21" fill="none" stroke="#efc5bd" stroke-width="4" stroke-linecap="round"/>', back: '', markings: '', muzzle: '<ellipse cx="44" cy="66" rx="8" ry="7" fill="#fff4ed"/><ellipse cx="56" cy="66" rx="8" ry="7" fill="#fff4ed"/><path d="M47 65h6v12q-3 3-6 0Z" fill="#fffaf0" stroke="#725c53" stroke-width="1.5"/>', nose: '<circle cx="50" cy="61" r="3" fill="#cc7e86"/>' },
    dragon: { name: '용', ears: '<path d="M31 40Q16 26 28 13q12 2 13 19m18 0q1-17 13-19 12 13-3 27Z"/>', back: '<path d="M25 60Q8 48 17 34l13 10m45 16q17-12 8-26L78 46" fill="#8ac0b0" stroke="#314d50" stroke-width="2"/>', markings: '<path d="m34 43 5-8 4 8m14 0 4-8 5 8" fill="none" stroke="#f1d08a" stroke-width="2.5"/>', muzzle: '<ellipse cx="50" cy="66" rx="13" ry="8" fill="#d8e3b5"/>', nose: '<path d="m47 63 3 3 3-3Z" fill="#315457"/>' },
    snake: { name: '뱀', ears: '', back: '<path d="M24 73q-9 13 8 15 19 3 20-10 1-11-13-12-11-1-8 7 2 4 8 2" fill="none" stroke="#83a354" stroke-width="10" stroke-linecap="round"/>', markings: '<path d="m39 33 4 4-4 4m15-8 4 4-4 4" fill="none" stroke="#e9d17e" stroke-width="2.5"/>', muzzle: '<ellipse cx="50" cy="67" rx="16" ry="9" fill="#d4e0a0"/>', nose: '<path d="M48 68q2 4 4 0m-2 1v7m0 0-4 4m4-4 4 4" fill="none" stroke="#8a4652" stroke-width="2"/>' },
    horse: { name: '말', ears: '<path d="M34 41 31 15q12 3 18 24m3 0q7-21 18-24l-3 26Z"/>', back: '<path d="M29 43q-13 12 1 27m40-27q14 12-1 27" fill="none" stroke="#55453c" stroke-width="5" stroke-linecap="round"/>', markings: '<path d="M50 34v12" stroke="#f3dfbd" stroke-width="4" stroke-linecap="round"/>', muzzle: '<ellipse cx="50" cy="67" rx="14" ry="10" fill="#eedbc6"/>', nose: '<circle cx="45" cy="67" r="1.8" fill="#56443c"/><circle cx="55" cy="67" r="1.8" fill="#56443c"/>' },
    goat: { name: '양', ears: '<path d="M32 38Q13 30 17 17q14 0 22 17m23 0q8-17 22-17 4 13-15 21"/><path d="M37 36Q26 15 35 10q10 8 10 23m10 0q0-15 10-23 9 5-2 26Z" fill="#f0e5c8"/>', back: '<path d="M41 76q9 13 18 0" fill="#eee2c2" stroke="#37434a" stroke-width="2"/>', markings: '', muzzle: '<ellipse cx="50" cy="63" rx="15" ry="10" fill="#f3e8dc"/>', nose: '<path d="m47 60 3 3 3-3Z" fill="#8b5c58"/>' },
    monkey: { name: '원숭이', ears: '<circle cx="25" cy="52" r="12"/><circle cx="75" cy="52" r="12"/><circle cx="25" cy="52" r="6" fill="#e5c5a5"/><circle cx="75" cy="52" r="6" fill="#e5c5a5"/>', back: '', markings: '<ellipse cx="50" cy="61" rx="21" ry="17" fill="#e8caa7"/>', muzzle: '<ellipse cx="50" cy="66" rx="13" ry="8" fill="#f3e1c9"/>', nose: '<circle cx="47" cy="63" r="1.8" fill="#453a35"/><circle cx="53" cy="63" r="1.8" fill="#453a35"/>' },
    rooster: { name: '닭', ears: '', back: '<path d="M40 31q-10-13 0-17 4 9 10 11 5-14 12-9 2 8-6 16" fill="#c84e46" stroke="#34434a" stroke-width="2"/>', markings: '<path d="M34 40q-6-8-11-2m43 2q6-8 11-2" fill="none" stroke="#d87b40" stroke-width="5" stroke-linecap="round"/>', muzzle: '<path d="m44 61 6 8 6-8Z" fill="#e4b94e"/>', nose: '<path d="M50 69q-5 5-1 8 5-3 1-8" fill="#c94d48"/>' },
    dog: { name: '개', ears: '<path d="M29 34Q11 27 17 56q4 12 18 6m31-28q18-7 12 22-4 12-18 6"/>', back: '', markings: '', muzzle: '<ellipse cx="50" cy="66" rx="14" ry="10" fill="#f0e3ca"/>', nose: '<ellipse cx="50" cy="61" rx="5" ry="3.5" fill="#35404a"/>' },
    pig: { name: '돼지', ears: '<path d="M29 42 24 20q15 1 22 17m7 0q7-16 22-17l-5 22Z"/><path d="m29 31 8 9m34-9-8 9" fill="none" stroke="#f0c4bc" stroke-width="3"/>', back: '', markings: '', muzzle: '<ellipse cx="50" cy="66" rx="16" ry="12" fill="#f3c3bf"/>', nose: '<ellipse cx="44" cy="66" rx="2" ry="3" fill="#99565b"/><ellipse cx="56" cy="66" rx="2" ry="3" fill="#99565b"/>' }
  };
  const character = animals[persona] || animals.rat;
  const color = avatarColor(persona, presentations);
  const ears = character.ears;
  const sprout = count >= 1 ? `<path d="M50 23V${count >= 2 ? 9 : 16}" stroke="#56745c" stroke-width="3" stroke-linecap="round"/><path d="M50 16q-12-10-16 1 10 5 16-1Z" fill="#70966b"/>${count >= 2 ? '<path d="M50 11q10-11 17-3-4 11-17 9Z" fill="#91ad70"/>' : ''}` : '';
  const sparks = count >= 3 ? '<path d="m15 37 2 4 4 2-4 2-2 4-2-4-4-2 4-2Zm70 0 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" fill="#c5944a"/>' : '';
  const badge = count >= 5 ? '<path d="m50 74 3 5 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1Z" fill="#c5944a" stroke="#fff7df" stroke-width="1"/>' : '';
  const face = `<ellipse cx="50" cy="57" rx="27" ry="29" fill="${color}" stroke="#28394a" stroke-width="2.5"/>`;
  const eyes = '<ellipse cx="41" cy="52" rx="7" ry="8" fill="#fff8e8"/><ellipse cx="59" cy="52" rx="7" ry="8" fill="#fff8e8"/><circle cx="43" cy="53" r="3" fill="#273744"/><circle cx="61" cy="53" r="3" fill="#273744"/>';
  const smile = '<path d="M44 73q6 5 12 0" fill="none" stroke="#4a4140" stroke-width="2" stroke-linecap="round"/>';
  return `<svg viewBox="0 0 100 100" role="img" aria-label="${character.name}띠 토론 아바타"><circle cx="50" cy="53" r="43" fill="#fff8e8"/><g stroke="#28394a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${character.back}</g><g fill="${color}" stroke="#28394a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${ears}${face}</g>${character.markings}${eyes}${character.muzzle}${character.nose}${smile}${sprout}${sparks}${badge}</svg>`;
}

function renderCharacter(animate = false) {
  const member = classMembers.find(item => item.name === activeStudent);
  const presentations = Math.max(state.presentations.length, member?.presentations || 0);
  const participations = Math.max(state.participations || 0, member?.participations || 0);
  const growthPoints = presentations * 3 + participations;
  const count = Math.floor(growthPoints / 3);
  const persona = state.persona || 'rat';
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
  const next = String(name || '').trim().slice(0, 10) || '학생';
  profileReady = true;
  localStorage.setItem('courtroom-profile-ready', 'true');
  persist();
  if (next === activeStudent) { document.querySelector('#profileName').value = next; return; }
  activeStudent = next;
  state = { ...createDefaultState(), ...(profiles[activeStudent] || {}) };
  state.persona = normalizePersona(state.persona);
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
    const history = document.createElement('details');
    history.className = 'side-history';
    const summary = document.createElement('summary');
    summary.textContent = `상호작용 기록 ${member.activityTrail?.length || 0}개 보기`;
    const records = document.createElement('div');
    records.className = 'side-record-list';
    (member.activityTrail || []).slice().reverse().forEach(activity => {
      const record = document.createElement('article');
      record.className = 'side-record';
      const heading = document.createElement('strong');
      heading.textContent = `${activity.label} · ${new Date(activity.at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
      record.append(heading);
      if (activity.text) {
        const text = document.createElement('p');
        text.textContent = activity.text;
        record.append(text);
      }
      if (activity.feedback) {
        const feedback = document.createElement('p');
        feedback.className = 'side-coach-feedback';
        feedback.textContent = `토론 코치: ${activity.feedback}`;
        record.append(feedback);
      }
      if (activity.topicTitle) {
        const topic = document.createElement('small');
        topic.textContent = `주제: ${activity.topicTitle}`;
        record.append(topic);
      }
      records.append(record);
    });
    history.append(summary, records);
    body.append(name, counts, events, history);
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
    const query = new URLSearchParams({ persona: state.persona || 'rat' });
    if (profileReady) query.set('name', activeStudent);
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

function renderTopicSources(sources) {
  const container = document.querySelector('#topicSources');
  container.innerHTML = '';
  (sources || []).slice(0, 5).forEach(source => {
    const link = document.createElement('a');
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = source.title;
    container.append(link);
  });
}

function hasConstitutionTopicTerms(title, scenario) {
  return String(title).trim().length >= 6 && /헌법|권리|기본권|평등|표현|사생활|개인정보|교육|학교|학생|휴대|자유|존엄|차별|제한|인권|공익|노동|종교|언론|집회|양심|참정|선거|정당|대통령|국회|탄핵|공직|권력분립|영토|재산|주거|신체|보건|환경/i.test(`${title} ${scenario}`);
}

function applyClassTopic(topic) {
  const firstLoad = !classTopicLoaded;
  const changed = topic.title !== classTopic.title || topic.scenario !== classTopic.scenario;
  classTopic = { title: topic.title || defaultClassTopic.title, scenario: topic.scenario || '', sources: topic.sources || [] };
  topicDraftSources = classTopic.sources;
  const titleInput = document.querySelector('#topicTitle');
  const scenarioInput = document.querySelector('#topicScenario');
  const editingTopic = topicFormDirty || document.activeElement === titleInput || document.activeElement === scenarioInput;
  if (!editingTopic) {
    titleInput.value = classTopic.title;
    scenarioInput.value = classTopic.scenario;
  }
  document.querySelector('#heroTopic').textContent = `오늘의 주제 · ${classTopic.title}`;
  document.querySelector('#sideCaseTitle').textContent = classTopic.title;
  document.querySelector('#sideCaseContext').textContent = classTopic.scenario;
  document.querySelector('.room-panel .panel-caption').textContent = `“${classTopic.title}”에 대한 발언을 AI가 확인한 뒤 친구들과 공유해요.`;
  renderTopicSources(topicDraftSources);
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

async function requestTopicSuggestion(titleValue = document.querySelector('#topicTitle').value, notes = document.querySelector('#topicScenario').value, force = false) {
  const title = String(titleValue || '').trim();
  const scenarioInput = document.querySelector('#topicScenario');
  const originalNotes = String(notes || '').trim();
  const status = document.querySelector('#topicStatus');
  const button = document.querySelector('#suggestTopicButton');
  if (!hasConstitutionTopicTerms(title, originalNotes)) {
    status.classList.add('error');
    status.textContent = '토론 주제에 헌법이나 기본권 쟁점을 드러내 주세요. 예: “헌법상 ___의 자유는 어디까지 보장될까요?”';
    return null;
  }
  const version = ++topicSuggestionSequence;
  const articles = getTopicFlightArticles({ title, scenario: originalNotes }).map(card => ({ number: card.number, title: card.title, summary: card.short }));
  button.disabled = true;
  status.classList.remove('error');
  status.textContent = 'AI가 상황과 헌법 근거를 살펴보고 있어요...';
  try {
    const response = await fetch('/api/class/topic/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, scenario: originalNotes, articles })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'AI 주제 제안을 받지 못했어요.');
    if (version !== topicSuggestionSequence) return null;
    const related = (result.relatedArticles || []).map(article => `제${article.number}조 ${article.title}`).join(' · ');
    const questions = (result.questions || []).map((question, index) => `${index + 1}. ${question}`).join('\n');
    const proposal = `상황: ${result.situation}\n\n토론 범위: ${result.scope}\n\n관련 헌법 조항: ${related}\n\n토론 질문:\n${questions}`;
    const teacherHasEdited = !force && scenarioInput.value.trim() && scenarioInput.value.trim() !== originalNotes;
    if (!teacherHasEdited) scenarioInput.value = proposal;
    topicDraftSources = result.sources || [];
    renderTopicSources(topicDraftSources);
    status.classList.remove('error');
    status.textContent = teacherHasEdited ? 'AI 제안을 준비했어요. 선생님이 입력 중인 설명은 그대로 두었습니다.' : 'AI가 상황·토론 범위·관련 조항을 제안했어요. 수정한 뒤 저장할 수 있습니다.';
    return proposal;
  } catch (error) {
    if (version === topicSuggestionSequence) {
      status.classList.add('error');
      status.textContent = error.message;
    }
    return null;
  } finally {
    if (version === topicSuggestionSequence) button.disabled = false;
  }
}

async function saveClassTopic() {
  const title = document.querySelector('#topicTitle').value.trim();
  if (topicSuggestionPromise) {
    const generated = await topicSuggestionPromise;
    topicSuggestionPromise = null;
    if (!generated && !document.querySelector('#topicScenario').value.trim()) return;
  }
  let scenario = document.querySelector('#topicScenario').value.trim();
  const status = document.querySelector('#topicStatus');
  if (!hasConstitutionTopicTerms(title, scenario)) {
    status.classList.add('error');
    status.textContent = '헌법의 권리나 기본권 쟁점과 연결된 주제를 입력해 주세요.';
    return;
  }
  if (!scenario) {
    topicSuggestionPromise = requestTopicSuggestion(title, '', false);
    const generated = await topicSuggestionPromise;
    topicSuggestionPromise = null;
    if (!generated) return;
    scenario = document.querySelector('#topicScenario').value.trim();
  }
  const button = document.querySelector('#saveTopicButton');
  button.disabled = true;
  status.classList.remove('error');
  status.textContent = '주제를 수업 공간에 공유하고 있어요...';
  try {
    const response = await fetch('/api/class/topic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, scenario, sources: topicDraftSources })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '주제를 저장하지 못했어요.');
    topicFormDirty = false;
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

async function sendChat(value, options = {}) {
  const text = String(value || input.value).trim();
  if (!text) return;
  if (!profileReady) {
    renderMessage({ who: 'bot', text: '참여 기록을 나누어 저장할 수 있도록 위의 ‘학생 참여 프로필’에서 10자 이내 별명을 먼저 정해주세요.' });
    input.value = '';
    document.querySelector('#profileName').focus();
    return;
  }
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
      body: JSON.stringify({ message: text, history, stage: state.stage, position: document.querySelector('#roomSide').value, name: activeStudent, persona: state.persona, topic: classTopic, articleCard: options.articleCard || null })
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

function showRoomModeration(text, kind = 'warning') {
  let notice = document.querySelector('#roomModeration');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'roomModeration';
    notice.className = 'room-moderation';
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');
    document.querySelector('#roomFeed').before(notice);
  }
  notice.className = `room-moderation show ${kind}`;
  notice.textContent = text;
  if (kind === 'success') setTimeout(() => notice.classList.remove('show'), 3500);
}

function nextPresentationSlot() {
  const member = classMembers.find(item => item.name === activeStudent);
  const complete = completedPresentationSlots(member);
  return [0, 1, 2].find(slot => !complete.has(slot));
}

function completedPresentationSlots(member = classMembers.find(item => item.name === activeStudent)) {
  return new Set([...state.presentations.map(item => item.slot), ...(member?.presentationSlots || [])]);
}

function openPresentationModal(slot = nextPresentationSlot()) {
  if (slot === undefined) { toast('발표 3회를 모두 기록했어요. 체크를 다시 눌러 수정할 수 있습니다.'); return; }
  presentationSlot = slot;
  document.querySelector('#presentationTitle').textContent = `${slot + 1}번째 발표 기록`;
  ['#presentationClaim', '#presentationReason', '#presentationExample'].forEach(selector => { document.querySelector(selector).value = ''; });
  document.querySelector('#presentationError').textContent = '';
  document.querySelector('#presentationModal').classList.add('open');
  document.querySelector('#presentationClaim').focus();
}

async function togglePresentation(slot) {
  const member = classMembers.find(item => item.name === activeStudent);
  const completed = completedPresentationSlots(member);
  if (!completed.has(slot)) {
    const next = nextPresentationSlot();
    if (slot !== next) { toast(`먼저 ${next + 1}번째 발표를 기록해 주세요.`); return; }
    openPresentationModal(slot);
    return;
  }
  const slotsToUndo = [...completed].filter(item => item >= slot).sort((a, b) => b - a);
  const removedRecords = state.presentations.filter(item => slotsToUndo.includes(item.slot));
  state.presentations = state.presentations.filter(item => !slotsToUndo.includes(item.slot));
  const removedIds = new Set(removedRecords.map(item => item.id));
  state.thoughtHistory = state.thoughtHistory.filter(event => !removedIds.has(event.presentationId));
  persist();
  renderProgress();
  renderCharacter(true);
  try {
    for (const item of slotsToUndo) {
      const response = await fetch('/api/class/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'presentation', action: 'uncheck', slot: item, name: activeStudent, persona: state.persona })
      });
      if (!response.ok) throw new Error('class_board_unavailable');
    }
    await pollClassBoard();
    renderProgress();
    renderCharacter(true);
    toast(`${slotsToUndo.length}개의 뒤 발표 체크를 순서대로 해제했어요. 다시 기록할 수 있습니다.`);
  } catch {
    toast('내 체크는 해제했지만 학급 집계와 연결하지 못했어요. 다시 확인해 주세요.');
  }
}

async function savePresentation() {
  const fields = [
    { label: '주장', selector: '#presentationClaim', text: document.querySelector('#presentationClaim').value.trim() },
    { label: '이유·헌법 근거', selector: '#presentationReason', text: document.querySelector('#presentationReason').value.trim() },
    { label: '예시·반대 의견', selector: '#presentationExample', text: document.querySelector('#presentationExample').value.trim() }
  ];
  const error = document.querySelector('#presentationError');
  const shortField = fields.find(field => Array.from(field.text).length <= 10);
  if (shortField || presentationSlot === null) {
    error.textContent = shortField ? `${shortField.label}을(를) 11자 이상 구체적으로 적어주세요. 짧은 글은 발표로 기록되지 않아요.` : '발표 순서를 다시 확인해 주세요.';
    document.querySelector(shortField?.selector || '#presentationClaim').focus();
    return;
  }
  error.textContent = '';
  const text = `주장: ${fields[0].text}\n이유·헌법 근거: ${fields[1].text}\n예시·반대 의견: ${fields[2].text}`;
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
      body: JSON.stringify({ type: 'presentation', action: 'check', slot, name: activeStudent, persona: state.persona, text, stage: state.stage })
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
  if (event.type === 'tetris-line') return '헌법 블록 줄 완성';
  if (event.type === 'tetris-complete') return '헌법 블록 게임';
  if (event.type === 'public-debate') return `학급 토론 · ${event.side || '발언'}`;
  return '생각 기록';
}

function constitutionChapter(number) {
  if (number <= 9) return { id: 1, name: '제1장 총강' };
  if (number <= 39) return { id: 2, name: '제2장 국민의 권리와 의무' };
  if (number <= 65) return { id: 3, name: '제3장 국회' };
  if (number <= 100) return { id: 4, name: '제4장 정부' };
  if (number <= 110) return { id: 5, name: '제5장 법원' };
  if (number <= 113) return { id: 6, name: '제6장 헌법재판소' };
  if (number <= 116) return { id: 7, name: '제7장 선거관리' };
  if (number <= 118) return { id: 8, name: '제8장 지방자치' };
  if (number <= 127) return { id: 9, name: '제9장 경제' };
  return { id: 10, name: '제10장 헌법개정' };
}

function renderConstitutionCards() {
  const query = document.querySelector('#articleSearch').value.trim().toLowerCase();
  const normalizedQuery = query.replace(/제|조/g, '').trim();
  const chapterFilter = document.querySelector('#articleChapterFilter').value;
  const articles = constitutionCardsData.filter(([number, title, summary]) => {
    const chapter = constitutionChapter(number);
    const haystack = `${number}조 ${title} ${summary} ${chapter.name}`.toLowerCase();
    return (chapterFilter === 'all' || Number(chapterFilter) === chapter.id)
      && (!query || haystack.includes(query) || Boolean(normalizedQuery && haystack.includes(normalizedQuery)));
  });
  document.querySelector('#articleCount').textContent = `${articles.length}개 조항`;
  const grid = document.querySelector('#articleGrid');
  grid.innerHTML = '';
  if (!articles.length) {
    const empty = document.createElement('div');
    empty.className = 'article-empty';
    empty.textContent = '검색 결과가 없어요. 조항 번호나 권리 이름으로 다시 찾아보세요.';
    grid.append(empty);
    return;
  }
  articles.forEach(([number, title, summary]) => {
    const chapter = constitutionChapter(number);
    const card = document.createElement('article');
    card.className = 'article-card';
    const head = document.createElement('div');
    head.className = 'article-card-head';
    const badge = document.createElement('span');
    badge.className = 'article-number';
    badge.textContent = `제${number}조`;
    const heading = document.createElement('div');
    const chapterLabel = document.createElement('div');
    chapterLabel.className = 'article-chapter';
    chapterLabel.textContent = chapter.name;
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    heading.append(chapterLabel, titleElement);
    head.append(badge, heading);
    const description = document.createElement('p');
    description.className = 'article-summary';
    description.textContent = summary;
    const actions = document.createElement('div');
    actions.className = 'article-card-actions';
    const ask = document.createElement('button');
    ask.type = 'button';
    ask.className = 'article-help';
    ask.textContent = '오늘 주제로 도움받기';
    ask.addEventListener('click', () => {
      closeConstitutionCards();
      document.querySelectorAll('[data-nav]').forEach(nav => nav.classList.toggle('active', nav.dataset.nav === 'debate'));
      sendChat(`오늘 수업 주제 “${classTopic.title}”에서 헌법 제${number}조(${title})를 어떻게 연결해 토론할 수 있을까요? 이 조항의 학습 요약은 “${summary}”입니다. 공식 자료를 확인하고, 찬성·반대 양쪽에서 생각할 질문을 주세요.`, { articleCard: { number, title, summary } });
      document.querySelector('.chat-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    const source = document.createElement('a');
    source.className = 'article-source';
    source.href = 'https://www.law.go.kr/법령/대한민국헌법';
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    source.textContent = '원문 ↗';
    actions.append(ask, source);
    card.append(head, description, actions);
    grid.append(card);
  });
}

function openConstitutionCards() {
  document.querySelector('#articleSearch').value = '';
  document.querySelector('#articleChapterFilter').value = 'all';
  renderConstitutionCards();
  document.querySelector('#constitutionModal').classList.add('open');
}
function closeConstitutionCards() { document.querySelector('#constitutionModal').classList.remove('open'); }

function renderThoughtNote() {
  const events = [...(state.thoughtHistory || [])];
  const ids = new Set(events.map(event => event.id));
  roomPosts.filter(post => post.name === activeStudent).forEach(post => {
    const id = `room-${post.id}`;
    if (!ids.has(id)) events.push({ id, type: 'public-debate', text: post.body, side: post.side, at: post.at, stage: 'middle' });
  });
  events.sort((a, b) => (a.at || 0) - (b.at || 0));
  const contributions = events.filter(event => ['presentation', 'question', 'public-debate', 'game-answer', 'tetris-line'].includes(event.type));
  const counts = [
    ['발표', events.filter(event => event.type === 'presentation').length],
    ['내 발언·질문', events.filter(event => ['question', 'public-debate', 'game-answer', 'tetris-line'].includes(event.type)).length],
    ['코치·게임 피드백', events.filter(event => ['coach', 'encouragement', 'game-complete', 'tetris-complete'].includes(event.type)).length]
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
    card.className = `room-post ${post.name === activeStudent ? 'mine' : ''} ${post.replyTo ? 'reply' : ''}`;
    const avatar = document.createElement('div');
    avatar.className = 'room-avatar';
    avatar.style.background = `${avatarColor(post.persona || 'rat', post.presentations || 0)}35`;
    avatar.innerHTML = characterSvg(post.persona || 'rat', post.level || 0, post.presentations || 0);
    const content = document.createElement('div');
    content.className = 'room-content';
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
    content.append(meta);
    const parent = byId.get(post.replyTo);
    if (parent) {
      const context = document.createElement('div');
      context.className = 'reply-context';
      context.textContent = `${parent.name}의 발언: ${parent.body.slice(0, 110)}`;
      content.append(context);
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
    content.append(body, reply);
    card.append(avatar, content);
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
document.querySelector('#recordBtn').addEventListener('click', () => {
  if (!profileReady) { toast('먼저 별명을 설정해 주세요.'); document.querySelector('#profileName').focus(); return; }
  const slots = [...completedPresentationSlots()].sort((a, b) => a - b);
  if (slots.length >= 3) togglePresentation(slots.at(-1));
  else openPresentationModal(nextPresentationSlot());
});
function closePresentation() {
  presentationSlot = null;
  document.querySelector('#presentationModal').classList.remove('open');
}
document.querySelector('#closePresentation').addEventListener('click', closePresentation);
document.querySelector('#cancelPresentation').addEventListener('click', closePresentation);
document.querySelector('#presentationModal').addEventListener('click', event => { if (event.target.id === 'presentationModal') closePresentation(); });
document.querySelector('#savePresentation').addEventListener('click', savePresentation);
document.querySelector('#applyProfile').addEventListener('click', () => {
  const name = document.querySelector('#profileName').value.trim();
  if (!name) { toast('참여할 별명을 입력해 주세요.'); document.querySelector('#profileName').focus(); return; }
  const persona = document.querySelector('#personaSelect').value;
  switchStudent(name);
  profileReady = true;
  localStorage.setItem('courtroom-profile-ready', 'true');
  state.persona = persona;
  persist();
  renderProgress();
  renderCharacter(true);
  pollClassBoard();
  toast(`${activeStudent} 아바타로 참여를 시작해요.`);
});
document.querySelector('#saveTopicButton').addEventListener('click', saveClassTopic);
document.querySelector('#topicTitle').addEventListener('input', () => { topicFormDirty = true; });
document.querySelector('#topicScenario').addEventListener('input', () => { topicFormDirty = true; });
document.querySelector('#suggestTopicButton').addEventListener('click', () => {
  topicSuggestionPromise = requestTopicSuggestion(document.querySelector('#topicTitle').value, document.querySelector('#topicScenario').value, true);
});
document.querySelector('#topicTitle').addEventListener('change', event => {
  const title = event.target.value.trim();
  const scenarioInput = document.querySelector('#topicScenario');
  if (!title || title === classTopic.title) return;
  if (!scenarioInput.value.trim() || scenarioInput.value.trim() === classTopic.scenario.trim()) {
    scenarioInput.value = '';
    topicDraftSources = [];
    renderTopicSources(topicDraftSources);
    topicSuggestionPromise = requestTopicSuggestion(title, '', false);
  } else {
    topicDraftSources = [];
    renderTopicSources(topicDraftSources);
    document.querySelector('#topicStatus').textContent = '새 주제와 함께 직접 작성한 범위를 적용할 수 있어요. AI 제안도 사용할 수 있습니다.';
  }
});
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
    openConstitutionCards();
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
document.querySelector('#closeConstitution').addEventListener('click', closeConstitutionCards);
document.querySelector('#constitutionModal').addEventListener('click', event => { if (event.target.id === 'constitutionModal') closeConstitutionCards(); });
document.querySelector('#articleSearch').addEventListener('input', renderConstitutionCards);
document.querySelector('#articleChapterFilter').addEventListener('change', renderConstitutionCards);
document.querySelector('#roomForm').addEventListener('submit', async event => {
  event.preventDefault();
  const field = document.querySelector('#roomInput');
  const text = field.value.trim();
  if (!text) return;
  if (!profileReady) { toast('발언 전에 먼저 별명을 설정해 주세요.'); document.querySelector('#profileName').focus(); return; }
  if (isLowEffortInput(text)) {
    showRoomModeration(`“${classTopic.title}”와 연결되는 주장이나 질문을 조금 더 구체적으로 적어주세요. 예: “저는 ___라고 생각해요. 이유는 ___입니다.”`);
    return;
  }
  const button = document.querySelector('.room-send');
  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = 'AI가 주제를 확인 중…';
  try {
    const response = await fetch('/api/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ side: document.querySelector('#roomSide').value, name: document.querySelector('#roomName').value, persona: state.persona, body: text, replyTo })
    });
    const result = await response.json();
    if (response.status === 422) {
      showRoomModeration(result.feedback || `이 발언은 “${classTopic.title}”와 연결해 다시 적어볼까요?`, result.error === 'personal_attack' ? 'attack' : 'warning');
      field.focus();
      return;
    }
    if (!response.ok) throw new Error(result.error || '주제 확인에 실패했어요. 잠시 뒤 다시 시도해 주세요.');
    if (document.querySelector('#roomName').value.trim() === activeStudent) {
      state.participations = (state.participations || 0) + 1;
      state.thoughtHistory.push({ id: `room-${result.post.id}`, type: 'public-debate', text, side: result.post.side, at: result.post.at, stage: state.stage });
      persist();
      renderProgress();
      renderCharacter(true);
    }
    field.value = '';
    showRoomModeration('주제와 연결된 발언이에요. 학급 토론에 등록했어요.', 'success');
    replyTo = '';
    document.querySelector('#replying').classList.remove('show');
    await pollRoom();
    await pollClassBoard();
  } catch (error) { showRoomModeration(error.message, 'warning'); }
  finally { button.disabled = false; button.textContent = originalLabel; }
});

function flightArticle(number) {
  const row = constitutionCardsData.find(card => card[0] === Number(number));
  return row ? { number: row[0], title: `제${row[0]}조 · ${row[1]}`, short: row[2] } : null;
}

function getTopicFlightArticles(topic = classTopic) {
  const text = `${topic.title} ${topic.scenario}`;
  const numbers = [];
  if (/사생활|개인정보|휴대전화|스마트폰|촬영|통신/.test(text)) numbers.push(17, 18, 16, 12, 37);
  if (/표현|언론|발언|게시|집회|시위/.test(text)) numbers.push(21, 22, 11, 37);
  if (/교육|학교|학생|수업|급식/.test(text)) numbers.push(31, 11, 10, 37);
  if (/평등|차별|장애|종교|성별/.test(text)) numbers.push(11, 10, 31, 37);
  if (/대통령|국회|탄핵|긴급명령|권력분립|정부/.test(text)) numbers.push(76, 66, 89, 91, 107, 37, 10);
  if (/선거|투표|정당|선거운동/.test(text)) numbers.push(24, 25, 41, 60, 114, 116, 11);
  if (/노동|근로|임금|노동조합/.test(text)) numbers.push(32, 33, 11, 10, 37);
  if (/환경|기후|오염|주거|재산/.test(text)) numbers.push(35, 23, 120, 122, 37, 10);
  if (/양심|종교/.test(text)) numbers.push(19, 20, 11, 10);
  for (const number of [10, 11, 17, 21, 31, 37]) if (numbers.length < 8) numbers.push(number);
  return [...new Set(numbers)].map(flightArticle).filter(Boolean).slice(0, 16);
}

function buildFallbackFlightQuestions() {
  const topicCards = getTopicFlightArticles();
  const available = topicCards.map(card => card.number);
  const fallbackIds = [10, 11, 17, 21, 31, 37];
  for (const number of fallbackIds) if (available.length < 4 && !available.includes(number)) available.push(number);
  const title = classTopic.title;
  const byNumber = number => flightArticle(number) || flightArticle(10);
  const choose = (answer, prompt, hint) => {
    const options = [answer, ...available.filter(number => number !== answer)].slice(0, 4);
    const article = byNumber(answer);
    return { prompt, hint: `${hint} ${article.short}`, answer, options, explanation: article.short };
  };
  const focus = topicCards[0]?.number || 10;
  const second = topicCards.find(card => card.number !== focus)?.number || 11;
  const rounds = [
    choose(focus, `이번 수업 주제 “${title}”와 가장 직접 연결되는 조항은 무엇일까요?`, '상황에서 가장 영향을 받는 기본권을 떠올려보세요.'),
    choose(37, `“${title}”과 관련해 기본권 제한이 꼭 필요한지 따져볼 때 참고할 조항은?`, '기본권 제한의 필요성과 한계를 다루는 조항이에요.'),
    choose(11, `“${title}”을 적용할 때 학생들을 공평하게 대하는 원칙과 가장 가까운 조항은?`, '법 앞의 평등과 차별 금지를 확인해보세요.'),
    choose(second, `오늘 주제에서 함께 보호해야 할 또 다른 권리를 찾는다면 어떤 조항일까요?`, '아바타의 조항 카드를 읽고 연결되는 권리를 골라보세요.'),
    choose(10, `“${title}”을 논의할 때 사람의 존엄과 자율을 떠올리게 하는 조항은?`, '헌법의 기본권을 해석할 때 바탕이 되는 원칙이에요.')
  ];
  return rounds;
}
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
let flightLane = 1;
let flightObstacles = [];
let flightObstacleLayer;
let flightMarkers;
let flightAnimationId;
let flightLastFrame = 0;
let flightSpawnClock = 0;
let flightHits = 0;
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
  document.querySelector('#gamePlane').style.left = `${3 + progress * 0.68}%`;
  setFlightLane(flightLane);
}

function setFlightLane(lane) {
  flightLane = Math.max(0, Math.min(2, lane));
  const tops = [18, 44, 68];
  document.querySelector('#gamePlane').style.top = `${tops[flightLane]}%`;
  const laneLabel = document.querySelector('#flightLaneName');
  if (laneLabel) laneLabel.textContent = ['위 항로', '가운데 항로', '아래 항로'][flightLane];
}

function initFlightControls() {
  const sky = document.querySelector('.flight-sky');
  if (!flightObstacleLayer) {
    flightMarkers = document.createElement('div');
    flightMarkers.className = 'flight-lane-markers';
    flightMarkers.setAttribute('aria-hidden', 'true');
    flightObstacleLayer = document.createElement('div');
    flightObstacleLayer.className = 'flight-obstacles';
    flightObstacleLayer.setAttribute('aria-hidden', 'true');
    sky.append(flightMarkers, flightObstacleLayer);
    const controls = document.createElement('div');
    controls.className = 'flight-steering';
    const label = document.createElement('span');
    label.textContent = '항로';
    const laneName = document.createElement('strong');
    laneName.id = 'flightLaneName';
    const up = document.createElement('button');
    up.type = 'button';
    up.dataset.flight = 'up';
    up.setAttribute('aria-label', '비행기를 위 항로로 조종');
    up.textContent = '↑ 상승';
    const down = document.createElement('button');
    down.type = 'button';
    down.dataset.flight = 'down';
    down.setAttribute('aria-label', '비행기를 아래 항로로 조종');
    down.textContent = '↓ 하강';
    controls.append(label, laneName, up, down);
    sky.insertAdjacentElement('afterend', controls);
    up.addEventListener('click', () => setFlightLane(flightLane - 1));
    down.addEventListener('click', () => setFlightLane(flightLane + 1));
    const hits = document.createElement('span');
    hits.className = 'game-score';
    hits.id = 'gameHits';
    hits.textContent = '충돌 0';
    document.querySelector('.game-head .game-scoreboard').append(hits);
  }
  document.querySelector('.flight-kbd').textContent = '↑ ↓ 항로 피하기 · 1-4 조항 선택 · Enter 확인';
  document.querySelector('.game-intro p').textContent = '45초 동안 오늘 주제에 맞는 헌법 조항을 고르세요. ↑ ↓ 나 터치 버튼으로 비행기를 위아래로 조종해 새·먹구름·강풍을 피하세요. 정답은 1-4 또는 선택 후 Enter로 고릅니다.';
}

function spawnFlightObstacle() {
  const variants = [
    { className: 'storm', label: '먹구름', svg: '<svg viewBox="0 0 64 54"><path d="M14 39a12 12 0 0 1 2-24 18 18 0 0 1 34 4 10 10 0 0 1 2 20Z" fill="#657a87" stroke="#344a55" stroke-width="3"/><path d="m32 27-6 10h7l-3 9 12-15h-7l4-4Z" fill="#f0c35e"/></svg>' },
    { className: 'bird', label: '새 무리', svg: '<svg viewBox="0 0 64 54"><path d="M5 29q12-18 25 0 13-18 29 0M13 42q9-13 18 0 9-13 20 0" fill="none" stroke="#576b73" stroke-width="5" stroke-linecap="round"/></svg>' },
    { className: 'wind', label: '강풍', svg: '<svg viewBox="0 0 64 54"><path d="M7 17h36q12 0 6-9m-42 20h48q10 0 5 9M16 42h25" fill="none" stroke="#b48d4d" stroke-width="4" stroke-linecap="round"/></svg>' }
  ];
  const variant = variants[Math.floor(Math.random() * variants.length)];
  const element = document.createElement('div');
  element.className = `flight-obstacle ${variant.className}`;
  element.setAttribute('aria-label', variant.label);
  element.innerHTML = variant.svg;
  element.style.left = '106%';
  const lane = Math.floor(Math.random() * 3);
  element.style.top = `${[33, 59, 83][lane]}%`;
  flightObstacleLayer.append(element);
  flightObstacles.push({ element, lane, x: 106, checked: false });
}

function startFlightAnimation() {
  cancelAnimationFrame(flightAnimationId);
  flightLastFrame = 0;
  flightSpawnClock = 0;
  flightObstacles = [];
  flightObstacleLayer.replaceChildren();
  flightAnimationId = requestAnimationFrame(updateFlightScene);
}

function updateFlightScene(now) {
  if (!gameStarted) return;
  const delta = flightLastFrame ? Math.min(now - flightLastFrame, 80) : 16;
  flightLastFrame = now;
  flightSpawnClock += delta;
  if (flightSpawnClock >= 1050) {
    flightSpawnClock = 0;
    spawnFlightObstacle();
  }
  const sky = document.querySelector('.flight-sky');
  const plane = document.querySelector('#gamePlane');
  const planeCenter = ((parseFloat(plane.style.left) / 100 * sky.clientWidth) + plane.clientWidth / 2) / sky.clientWidth * 100;
  flightObstacles = flightObstacles.filter(obstacle => {
    obstacle.x -= delta * 0.032;
    obstacle.element.style.left = `${obstacle.x}%`;
    if (!obstacle.checked && obstacle.x <= planeCenter + 1) {
      obstacle.checked = true;
      if (obstacle.lane === flightLane) {
        flightHits += 1;
        gameTimeLeft = Math.max(0, gameTimeLeft - 3);
        gameStreak = 0;
        document.querySelector('#gameHits').textContent = `충돌 ${flightHits}`;
        const feedback = document.querySelector('#gameFeedback');
        feedback.className = 'game-feedback try';
        feedback.textContent = '장애물과 부딪혀 3초가 줄었어요. ↑ ↓ 로 빈 항로를 찾아보세요.';
        refreshGameBadges();
      }
    }
    if (obstacle.x < -12) { obstacle.element.remove(); return false; }
    return true;
  });
  if (gameTimeLeft <= 0) { finishConstitutionGame(false); return; }
  flightAnimationId = requestAnimationFrame(updateFlightScene);
}
async function startConstitutionGame() {
  if (!profileReady) { toast('비행 점수를 학급에 기록하려면 먼저 별명을 설정해 주세요.'); document.querySelector('#profileName').focus(); return; }
  clearInterval(gameTimerId);
  clearTimeout(gameTransitionId);
  const startButton = document.querySelector('#gameStart');
  const originalLabel = startButton.textContent;
  startButton.disabled = true;
  startButton.textContent = '오늘의 주제로 문제 만드는 중…';
  try {
    const response = await fetch('/api/game/flight-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles: getTopicFlightArticles().map(card => ({ number: card.number, title: card.title, summary: card.short })) })
    });
    if (!response.ok) throw new Error('topic_questions_unavailable');
    const result = await response.json();
    if (!Array.isArray(result.questions) || result.questions.length < 5) throw new Error('invalid_topic_questions');
    gameDeck = shuffled(result.questions.slice(0, 5));
  } catch {
    gameDeck = shuffled(buildFallbackFlightQuestions());
    document.querySelector('#gameHelp').textContent = `“${classTopic.title}” 관련 기본 문제로 비행을 시작해요.`;
  } finally {
    startButton.disabled = false;
    startButton.textContent = originalLabel;
  }
  gameScore = 0;
  gameStreak = 0;
  gameTimeLeft = 45;
  gameQuestionNumber = 0;
  gameStarted = true;
  flightLane = 1;
  flightHits = 0;
  initFlightControls();
  document.querySelector('#gameIntro').hidden = true;
  document.querySelector('#gameSession').hidden = false;
  document.querySelector('#gameResult').hidden = true;
  document.querySelector('#gamePlay').hidden = false;
  refreshGameBadges();
  updateFlightProgress();
  document.querySelector('#gameHits').textContent = '충돌 0';
  renderGameQuestion();
  startFlightAnimation();
  gameTimerId = setInterval(() => {
    gameTimeLeft -= 1;
    refreshGameBadges();
    if (gameTimeLeft <= 0) finishConstitutionGame(false);
  }, 1000);
}
function renderGameQuestion() {
  if (!gameDeck.length) gameDeck = shuffled(buildFallbackFlightQuestions());
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
    const option = flightArticle(article);
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
}
function saveGameThought(question, article, correct) {
  const at = Date.now();
  const chosen = flightArticle(article);
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
  feedback.textContent = `${success ? '정답! +1점. ' : `정답은 ${flightArticle(question.answer).title}예요. `}${question.explanation}`;
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
  cancelAnimationFrame(flightAnimationId);
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
    setFlightLane(flightLane - 1);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    setFlightLane(flightLane + 1);
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

const tetrisColumns = 10;
const tetrisRows = 18;
const tetrisCell = 30;
const tetrisGoal = 6;
const tetrisShapes = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 0], [0, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]]
];
const tetrisColorSet = ['#d87958', '#d0a84f', '#588ca0', '#70936a', '#8970a7', '#b9677f'];
const tetrisCanvas = document.querySelector('#constitutionTetris');
const tetrisContext = tetrisCanvas.getContext('2d');
let tetrisBoard = [];
let tetrisPiece = null;
let tetrisArticlePool = [];
let tetrisArticleCursor = 0;
let tetrisLastClearedArticles = [];
let tetrisActive = false;
let tetrisFrame = 0;
let tetrisLastFrame = 0;
let tetrisDropCounter = 0;
let tetrisScore = 0;
let tetrisLines = 0;
let tetrisTimeLeft = 90;

function getTetrisArticlesForTopic() {
  const context = `${classTopic.title} ${classTopic.scenario}`;
  const numbers = [];
  if (/사생활|개인정보|휴대전화|스마트폰|촬영/.test(context)) numbers.push(17, 12);
  if (/표현|의견|발언|게시/.test(context)) numbers.push(21);
  if (/교육|급식|학생|수업|학교/.test(context)) numbers.push(31);
  if (/평등|차별|기회/.test(context)) numbers.push(11);
  if (/존엄|행복|자유|인권/.test(context)) numbers.push(10);
  if (/제한|규칙|보관|수거|공익/.test(context)) numbers.push(37);
  for (const number of [10, 11, 17, 21, 31, 37]) if (numbers.length < 4) numbers.push(number);
  return [...new Set(numbers)].map(number => constitutionCardsData.find(card => card[0] === number)).filter(Boolean);
}

function updateTetrisStats() {
  document.querySelector('#tetrisScore').textContent = `점수 ${tetrisScore}`;
  document.querySelector('#tetrisLines').textContent = `줄 ${tetrisLines} / ${tetrisGoal}`;
  document.querySelector('#tetrisTimer').textContent = `${Math.ceil(tetrisTimeLeft)}초`;
}

function tetrisArticleInfo(article) {
  document.querySelector('#tetrisClauseTitle').textContent = `제${article[0]}조 · ${article[1]}`;
  document.querySelector('#tetrisClauseSummary').textContent = article[2];
}

function collisionTetris(matrix, x, y) {
  for (let row = 0; row < matrix.length; row += 1) {
    for (let col = 0; col < matrix[row].length; col += 1) {
      if (!matrix[row][col]) continue;
      const boardX = x + col;
      const boardY = y + row;
      if (boardX < 0 || boardX >= tetrisColumns || boardY >= tetrisRows) return true;
      if (boardY >= 0 && tetrisBoard[boardY][boardX]) return true;
    }
  }
  return false;
}

function spawnTetrisPiece() {
  if (tetrisArticleCursor >= tetrisArticlePool.length) {
    tetrisArticlePool = shuffled(getTetrisArticlesForTopic());
    tetrisArticleCursor = 0;
  }
  const shape = tetrisShapes[Math.floor(Math.random() * tetrisShapes.length)];
  const article = tetrisArticlePool[tetrisArticleCursor++];
  tetrisPiece = {
    matrix: shape.map(row => [...row]),
    x: Math.floor((tetrisColumns - shape[0].length) / 2),
    y: 0,
    article
  };
  tetrisArticleInfo(article);
  if (collisionTetris(tetrisPiece.matrix, tetrisPiece.x, tetrisPiece.y)) finishTetris(false);
}

function drawTetrisBlock(x, y, articleNumber) {
  const color = tetrisColorSet[articleNumber % tetrisColorSet.length];
  const left = x * tetrisCell + 2;
  const top = y * tetrisCell + 2;
  tetrisContext.fillStyle = color;
  tetrisContext.fillRect(left, top, tetrisCell - 4, tetrisCell - 4);
  tetrisContext.strokeStyle = '#f8f4e8';
  tetrisContext.lineWidth = 1;
  tetrisContext.strokeRect(left + .5, top + .5, tetrisCell - 5, tetrisCell - 5);
  tetrisContext.fillStyle = '#fffefa';
  tetrisContext.font = 'bold 9px sans-serif';
  tetrisContext.textAlign = 'center';
  tetrisContext.textBaseline = 'middle';
  tetrisContext.fillText(String(articleNumber), left + (tetrisCell - 4) / 2, top + (tetrisCell - 4) / 2);
}

function drawTetrisBoard() {
  tetrisContext.fillStyle = '#0e1b2b';
  tetrisContext.fillRect(0, 0, tetrisCanvas.width, tetrisCanvas.height);
  tetrisContext.strokeStyle = '#24364a';
  tetrisContext.lineWidth = 1;
  for (let row = 0; row < tetrisRows; row += 1) {
    for (let col = 0; col < tetrisColumns; col += 1) {
      tetrisContext.strokeRect(col * tetrisCell, row * tetrisCell, tetrisCell, tetrisCell);
      const block = tetrisBoard[row]?.[col];
      if (block) drawTetrisBlock(col, row, block.number);
    }
  }
  if (tetrisPiece) {
    tetrisPiece.matrix.forEach((line, row) => line.forEach((cell, col) => {
      if (cell && tetrisPiece.y + row >= 0) drawTetrisBlock(tetrisPiece.x + col, tetrisPiece.y + row, tetrisPiece.article[0]);
    }));
  }
}

function rotateTetrisPiece() {
  if (!tetrisActive || !tetrisPiece) return;
  const rotated = tetrisPiece.matrix[0].map((_, index) => tetrisPiece.matrix.map(row => row[index]).reverse());
  for (const offset of [0, -1, 1, -2, 2]) {
    if (!collisionTetris(rotated, tetrisPiece.x + offset, tetrisPiece.y)) {
      tetrisPiece.matrix = rotated;
      tetrisPiece.x += offset;
      drawTetrisBoard();
      return;
    }
  }
}

function moveTetrisPiece(dx, dy, pointsForDrop = false) {
  if (!tetrisActive || !tetrisPiece) return false;
  if (!collisionTetris(tetrisPiece.matrix, tetrisPiece.x + dx, tetrisPiece.y + dy)) {
    tetrisPiece.x += dx;
    tetrisPiece.y += dy;
    if (pointsForDrop) { tetrisScore += 1; updateTetrisStats(); }
    drawTetrisBoard();
    return true;
  }
  if (dy > 0) lockTetrisPiece();
  return false;
}

function hardDropTetrisPiece() {
  if (!tetrisActive || !tetrisPiece) return;
  let distance = 0;
  while (!collisionTetris(tetrisPiece.matrix, tetrisPiece.x, tetrisPiece.y + 1)) {
    tetrisPiece.y += 1;
    distance += 1;
  }
  tetrisScore += distance * 2;
  updateTetrisStats();
  lockTetrisPiece();
}

function lockTetrisPiece() {
  const article = tetrisPiece.article;
  for (let row = 0; row < tetrisPiece.matrix.length; row += 1) {
    for (let col = 0; col < tetrisPiece.matrix[row].length; col += 1) {
      if (!tetrisPiece.matrix[row][col]) continue;
      const y = tetrisPiece.y + row;
      if (y < 0) { finishTetris(false); return; }
      tetrisBoard[y][tetrisPiece.x + col] = { number: article[0] };
    }
  }
  const clearedRows = tetrisBoard.filter(row => row.every(Boolean));
  if (clearedRows.length) {
    const articleNumbers = [...new Set(clearedRows.flat().map(block => block.number))];
    const clearedArticles = articleNumbers.map(number => constitutionCardsData.find(card => card[0] === number)).filter(Boolean);
    const keepRows = tetrisBoard.filter(row => !row.every(Boolean));
    while (keepRows.length < tetrisRows) keepRows.unshift(Array(tetrisColumns).fill(null));
    tetrisBoard = keepRows;
    tetrisLines += clearedRows.length;
    tetrisScore += [0, 100, 300, 500, 800][clearedRows.length] || clearedRows.length * 200;
    tetrisLastClearedArticles = clearedArticles;
    document.querySelector('#tetrisFeedback').textContent = `${clearedRows.length}줄 완성! ${clearedArticles.map(item => `제${item[0]}조 ${item[1]}`).join(' · ')} 조항 블록을 정리했어요.`;
    document.querySelector('#tetrisAskCoach').disabled = false;
    const at = Date.now();
    state.thoughtHistory.push({ id: `tetris-line-${at}`, type: 'tetris-line', text: `헌법 조항 블록 게임에서 ${clearedRows.length}줄을 지웠어요: ${clearedArticles.map(item => `제${item[0]}조 ${item[1]}`).join(', ')}.`, at, stage: state.stage, sources: [{ title: '대한민국헌법 · 국가법령정보센터', url: 'https://www.law.go.kr/법령/대한민국헌법' }] });
    persist();
    updateTetrisStats();
    if (tetrisLines >= tetrisGoal) { drawTetrisBoard(); finishTetris(true); return; }
  }
  spawnTetrisPiece();
  drawTetrisBoard();
}

function startTetris() {
  if (!profileReady) { toast('블록 점수를 기록하려면 먼저 별명을 설정해 주세요.'); document.querySelector('#profileName').focus(); return; }
  if (tetrisFrame) cancelAnimationFrame(tetrisFrame);
  tetrisBoard = Array.from({ length: tetrisRows }, () => Array(tetrisColumns).fill(null));
  tetrisArticlePool = shuffled(getTetrisArticlesForTopic());
  tetrisArticleCursor = 0;
  tetrisLastClearedArticles = [];
  tetrisScore = 0;
  tetrisLines = 0;
  tetrisTimeLeft = 90;
  tetrisDropCounter = 0;
  tetrisLastFrame = performance.now();
  tetrisActive = true;
  document.querySelector('#tetrisOverlay').classList.add('hidden');
  document.querySelector('#tetrisFeedback').textContent = '블록을 움직여 가로줄을 완성해보세요.';
  document.querySelector('#tetrisAskCoach').disabled = true;
  document.querySelector('#tetrisStart').textContent = '다시 도전';
  updateTetrisStats();
  spawnTetrisPiece();
  drawTetrisBoard();
  tetrisCanvas.focus({ preventScroll: true });
  tetrisFrame = requestAnimationFrame(tetrisLoop);
}

function tetrisLoop(now) {
  if (!tetrisActive) return;
  const delta = Math.min(now - tetrisLastFrame, 80);
  tetrisLastFrame = now;
  tetrisTimeLeft = Math.max(0, tetrisTimeLeft - delta / 1000);
  tetrisDropCounter += delta;
  const speed = Math.max(130, 720 - Math.floor(tetrisLines / 2) * 70);
  if (tetrisDropCounter >= speed) {
    tetrisDropCounter = 0;
    moveTetrisPiece(0, 1);
  }
  updateTetrisStats();
  drawTetrisBoard();
  if (tetrisTimeLeft <= 0) { finishTetris(false); return; }
  tetrisFrame = requestAnimationFrame(tetrisLoop);
}

async function finishTetris(won) {
  if (!tetrisActive) return;
  tetrisActive = false;
  cancelAnimationFrame(tetrisFrame);
  drawTetrisBoard();
  const overlay = document.querySelector('#tetrisOverlay');
  overlay.classList.remove('hidden');
  document.querySelector('#tetrisOverlayTitle').textContent = won ? '조항 줄 완성! 멋지게 쌓았어요.' : '게임 종료! 다음 판에 다시 도전해요.';
  document.querySelector('#tetrisOverlayText').textContent = `${tetrisScore}점 · ${tetrisLines}줄을 완성했어요. 블록에 담긴 조항을 생각 노트에서 다시 볼 수 있어요.`;
  const at = Date.now();
  state.thoughtHistory.push({ id: `tetris-complete-${at}`, type: 'tetris-complete', text: `헌법 조항 블록 게임 완료: ${tetrisScore}점, ${tetrisLines}줄.`, at, stage: state.stage });
  persist();
  try {
    const response = await fetch('/api/class/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'participation', source: 'constitutional-tetris', name: activeStudent, persona: state.persona })
    });
    if (response.ok) await pollClassBoard();
  } catch {}
}

function handleTetrisKeys(event) {
  if (!tetrisActive || event.altKey || event.ctrlKey || event.metaKey || event.target.matches('input, textarea, select')) return;
  if (event.key === 'ArrowLeft') { event.preventDefault(); moveTetrisPiece(-1, 0); }
  else if (event.key === 'ArrowRight') { event.preventDefault(); moveTetrisPiece(1, 0); }
  else if (event.key === 'ArrowDown') { event.preventDefault(); moveTetrisPiece(0, 1, true); }
  else if (event.key === 'ArrowUp') { event.preventDefault(); rotateTetrisPiece(); }
  else if (event.code === 'Space') { event.preventDefault(); hardDropTetrisPiece(); }
}

document.addEventListener('keydown', handleTetrisKeys);
document.querySelector('#tetrisStart').addEventListener('click', startTetris);
document.querySelectorAll('[data-tetris]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.tetris === 'left') moveTetrisPiece(-1, 0);
  if (button.dataset.tetris === 'right') moveTetrisPiece(1, 0);
  if (button.dataset.tetris === 'down') moveTetrisPiece(0, 1, true);
  if (button.dataset.tetris === 'rotate') rotateTetrisPiece();
  if (button.dataset.tetris === 'drop') hardDropTetrisPiece();
  tetrisCanvas.focus({ preventScroll: true });
}));
document.querySelector('#tetrisAskCoach').addEventListener('click', () => {
  if (!tetrisLastClearedArticles.length) return;
  const articles = tetrisLastClearedArticles.map(([number, title, summary]) => `헌법 제${number}조 ${title}: ${summary}`).join('\n');
  sendChat(`오늘의 주제 “${classTopic.title}”와 방금 줄을 지운 조항을 연결해 설명해주세요.\n${articles}\n이 조항을 토론에서 어떻게 활용하고, 반대쪽에서는 어떤 질문을 할 수 있을까요?`);
});

initFlightControls();
setFlightLane(1);
document.querySelector('#roomStatus').innerHTML = '<i></i>AI 주제·예의 확인';
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
