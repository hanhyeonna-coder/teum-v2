# MALHAEBA — Privacy / Terms Drafts

Status: Draft for product preparation. Final operator identity/contact details, final domain, and the future STT provider must be inserted before public launch. This draft is not a substitute for jurisdiction-specific legal review.

---

# 개인정보 처리 안내 (초안)

시행 예정일: 공개 베타 시작일

말해바(MALHAEBA)는 사용자가 익명으로 이야기를 남기고 비슷한 이야기를 살펴볼 수 있는 서비스입니다. 서비스 제공에 필요한 범위에서 아래 정보를 처리합니다.

## 1. 처리하는 정보

### 계정 및 기기 이용 정보
- 기본 이용 시 Supabase Auth가 생성한 익명 사용자 식별자
- 사용자가 직접 계정을 연결한 경우 이메일 주소 및 이메일 인증 상태
- 로그인 세션 및 인증에 필요한 기술 정보

### 사용자가 직접 생성한 콘텐츠
- 공개 또는 비공개로 남긴 이야기
- 이야기의 자동 생성 제목 및 태그
- 댓글
- 공감
- 담아두기
- 신고 및 차단 정보

### 서비스 이용 측정 정보
현재 말해바는 최소한의 자체 이벤트를 기록합니다.
- 방문(visit)
- 이야기 작성 완료(story_created)
- 유입 출처(예: direct, instagram, threads, facebook, friend)
- 선택한 언어
- 이벤트 발생 시각
- 해당 익명/연결 계정 식별자

## 2. 음성 입력

현재 베타 버전의 음성 입력은 브라우저가 제공하는 음성 인식 기능을 사용합니다. 말해바 데이터베이스에는 원본 음성 파일을 저장하지 않습니다.

브라우저 또는 운영체제의 음성 인식 기능이 음성을 처리하는 방식은 사용 중인 브라우저/운영체제 제공자의 정책이 적용될 수 있습니다.

공개 전 별도의 STT 제공자를 연결하는 경우 이 항목을 반드시 수정하여 다음 내용을 명시해야 합니다.
- 음성 처리 업체
- 전송되는 데이터
- 원본 음성 보관 여부와 보관 기간
- 처리 목적
- 국외 이전 또는 외부 처리 여부(해당하는 경우)

## 3. 이용 목적

정보는 다음 목적으로 사용합니다.
- 익명 이야기 작성 및 저장
- 공개/비공개 설정 제공
- 비슷한 이야기 정렬 및 추천
- 댓글, 공감, 담아두기 기능
- 여러 기기에서 연결 계정의 기록 유지
- 신고 및 차단 등 안전 기능
- 서비스 이용 흐름 및 초기 제품 성과 분석
- 오류 대응 및 서비스 안정성 개선

## 4. 공개되는 정보

사용자가 ‘익명으로 공개하기’를 선택한 이야기는 다른 이용자에게 노출될 수 있습니다. 공개 이야기에는 본문, 자동 생성 제목, 관련 태그 및 다른 이용자의 반응이 표시될 수 있습니다.

‘나만 보기’를 선택한 이야기는 다른 이용자의 공개 피드에 표시하지 않습니다.

말해바는 공개 프로필, 팔로워 수, 실명 프로필을 기본 기능으로 제공하지 않습니다.

## 5. 외부 서비스

현재 또는 공개 전 사용 예정인 주요 서비스:
- Supabase: 인증 및 데이터베이스
- Vercel: 웹 호스팅
- Resend: 공개 전 인증 이메일 발송용 SMTP로 연결 예정
- STT 제공자: 공개 전 최종 확정 후 기재

각 서비스의 처리 범위는 실제 연결 상태에 맞춰 공개 전 최종 갱신합니다.

## 6. 보관 및 삭제

사용자가 남긴 기록은 서비스 기능 제공을 위해 저장됩니다. 사용자가 이야기 삭제 기능을 사용하면 해당 이야기는 서비스 화면에서 삭제 처리됩니다.

익명 계정은 브라우저 데이터가 삭제되거나 로그아웃되는 경우 사용자가 동일 계정에 다시 접근하지 못할 수 있습니다. 중요한 기록을 여러 기기에서 이어보려면 이메일 계정 연결이 필요합니다.

계정 전체 삭제 기능과 법적 보관 기간은 공개 전 최종 정책에서 구체화합니다.

## 7. 안전 및 민감정보

말해바는 개인적인 감정과 경험을 털어놓는 공간이지만 다른 사람의 실명, 연락처, 주소 등 불필요한 개인정보를 게시하지 않도록 권장합니다.

특정인에 대한 위협, 괴롭힘, 혐오·차별, 성적 착취성 콘텐츠, 불법행위 조장, 반복 스팸은 제한 또는 삭제될 수 있습니다.

## 8. 문의

공개 전 최종 연락처를 기재합니다.

현재 베타 문의 채널:
Instagram @malhaeba.today

---

# MALHAEBA Privacy Notice (Draft)

Effective date: Public beta launch date

MALHAEBA is an anonymous space where people can let things out and browse stories that feel similar. We process only the information needed to provide and improve the service.

## 1. Information we process

### Account and session data
- An anonymous user identifier created through Supabase Auth
- Email address and verification state if you choose to connect an account
- Technical session/authentication information

### Content you create
- Public or private stories
- Automatically generated story titles and tags
- Comments
- Reactions
- Bookmarks
- Reports and blocks

### Basic product analytics
We currently record a small set of first-party events:
- visit
- story_created
- acquisition source such as direct, instagram, threads, facebook, or friend
- selected language
- event timestamp
- the anonymous or connected account identifier associated with the event

## 2. Voice input

The current beta uses speech-recognition functionality provided by the browser. MALHAEBA does not currently store raw audio files in its database.

How browser or operating-system speech recognition processes audio may also be governed by the policies of the browser or operating-system provider.

Before launch, if MALHAEBA switches to a separate speech-to-text provider, this notice must be updated to identify the provider, the data transmitted, retention behavior, purpose, and any relevant external or cross-border processing.

## 3. Why we use information

We use information to:
- save anonymous stories
- apply public/private visibility
- rank and show similar stories
- provide comments, reactions, and bookmarks
- preserve records across devices for connected accounts
- provide reporting and blocking tools
- measure basic product usage and acquisition
- troubleshoot and improve service reliability

## 4. What other users can see

Stories marked “public anonymously” may be shown to other users with their body, generated title, topic tags, and community reactions.

Stories marked private are not shown in the public story feed.

MALHAEBA does not currently provide public real-name profiles, follower counts, or direct messages.

## 5. Service providers

Current or planned providers include:
- Supabase for authentication and database services
- Vercel for web hosting
- Resend, planned before launch for authentication email delivery
- A speech-to-text provider to be named after the final pre-launch integration

This section must be updated to reflect the actual production configuration before launch.

## 6. Retention and deletion

Stories and related records are stored as needed to provide the service. Users can delete their own stories through the product.

Anonymous accounts may become inaccessible if browser data is cleared or the user signs out before connecting an email. Connecting an email is required to recover the same account on another device.

A final production policy must specify full-account deletion handling and any legally required retention periods.

## 7. Safety and sensitive information

Please avoid posting unnecessary identifying information about yourself or others, such as full names, phone numbers, or addresses.

Threats, harassment, hateful or discriminatory content, sexual exploitation, promotion of illegal activity, and repeated spam may be restricted or removed.

## 8. Contact

Final operator/contact information must be added before launch.

Current beta contact:
Instagram @malhaeba.today

---

# 이용약관 및 커뮤니티 규칙 (초안)

## 1. 서비스의 성격

말해바는 개인적인 경험과 감정을 익명으로 기록하고 다른 이용자의 비슷한 이야기를 볼 수 있도록 돕는 커뮤니티 서비스입니다.

말해바는 의료기관, 정신건강 치료 서비스, 법률 상담 서비스 또는 긴급 구조 서비스가 아닙니다. 긴급한 위험이 있는 경우 해당 지역의 긴급 구조·의료 기관을 이용해야 합니다.

## 2. 이용자의 책임

이용자는 자신이 작성하거나 공개하는 콘텐츠에 대해 책임을 집니다.

특히 다음 내용을 게시해서는 안 됩니다.
- 특정인에 대한 위협 또는 괴롭힘
- 혐오·차별 또는 성적 착취성 콘텐츠
- 타인의 이름, 연락처, 주소 등 불필요한 개인정보
- 불법행위 조장
- 반복적인 광고, 스팸 또는 서비스 악용

## 3. 익명성

말해바는 이용자의 화면상 익명성을 제공하지만 인터넷 서비스에서 절대적인 익명성을 보장한다는 의미는 아닙니다. 서비스 운영과 보안을 위해 기술적 사용자 식별자와 서비스 기록이 처리될 수 있습니다.

## 4. 공개 범위

이용자가 익명 공개를 선택한 콘텐츠는 다른 이용자에게 보여질 수 있습니다. 나만 보기를 선택한 콘텐츠는 공개 피드에 표시되지 않습니다.

이용자는 자신의 이야기 공개 범위를 변경하거나 이야기를 삭제할 수 있습니다.

## 5. 콘텐츠 관리

말해바는 서비스 안전, 이용자 보호, 법적 의무 이행 또는 서비스 운영을 위해 콘텐츠를 제한, 비공개 처리 또는 삭제할 수 있습니다.

이용자는 문제가 있는 콘텐츠를 신고하거나 해당 작성자를 차단할 수 있습니다.

## 6. 계정과 기록

기본 이용은 익명 계정으로 시작할 수 있습니다. 이메일을 연결하지 않은 익명 계정은 브라우저 데이터 삭제, 로그아웃, 기기 변경 등의 경우 복구가 불가능할 수 있습니다.

여러 기기에서 동일한 기록을 이용하려면 이메일 계정 연결이 필요합니다.

## 7. 베타 서비스

공개 베타 기간에는 기능, 화면, 추천 방식, 데이터 구조가 변경될 수 있습니다. 중요한 변경은 필요에 따라 서비스 내에서 안내합니다.

## 8. 문의

공개 전 최종 사업자/운영자 정보와 연락처를 추가합니다.

현재 베타 문의:
Instagram @malhaeba.today

---

# MALHAEBA Terms & Community Rules (Draft)

## 1. Nature of the service

MALHAEBA is a community product for anonymously recording personal experiences and emotions and browsing stories that feel similar.

MALHAEBA is not a medical provider, mental-health treatment service, legal-advice service, or emergency service. If you or someone else is in immediate danger, use the emergency or medical services available in your location.

## 2. User responsibility

You are responsible for content you create or publish.

Do not post:
- threats or harassment toward a specific person
- hateful, discriminatory, or sexually exploitative content
- unnecessary personal information about another person
- content promoting illegal activity
- repeated advertising, spam, or abuse of the service

## 3. Anonymity

MALHAEBA provides an anonymous user-facing experience, but this does not mean absolute technical anonymity. Technical user identifiers and service records may be processed for operation, security, and account continuity.

## 4. Visibility

Content marked public anonymously may be shown to other users. Content marked private is not displayed in the public feed.

Users can change the visibility of their own stories or delete them.

## 5. Moderation

MALHAEBA may restrict, hide, or remove content when reasonably needed for safety, user protection, legal obligations, or service operation.

Users can report content and block authors.

## 6. Accounts and record recovery

People can begin with an anonymous account. An anonymous account that has not been connected to email may become unrecoverable after browser data is cleared, the user signs out, or the user changes devices.

Email connection is required to access the same account across devices.

## 7. Beta changes

During public beta, features, interface behavior, recommendation logic, and data structures may change.

## 8. Contact

Final operator and contact information must be added before launch.

Current beta contact:
Instagram @malhaeba.today
