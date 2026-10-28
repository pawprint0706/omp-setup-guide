# omp 설정 변경·검증 히스토리

설치·설정 절차는 [omp 셋업 가이드](omp-setup-guide.md)를 따른다. 이 문서는 특정 환경에서 수행한 변경·검토·검증 결과를 보존하며, 현재 설치 지침이나 다른 환경의 동작 보장이 아니다.

## 기록 읽는 법

- 분리 기준: `47a79a1` 커밋의 `omp-setup-guide.md`.
- 원문 §8–13 번호와 기록 본문을 보존했다. §0–7 참조는 [가이드](omp-setup-guide.md)의 해당 절을, §8–13 참조는 이 문서의 해당 기록을 뜻한다.
- “현재”, “최신”, “이 PC”, “아직 검증하지 않았다”는 각 기록 작성 시점의 표현이다. 이후 기록이 앞선 상태를 대체할 수 있다.
- 아래 보충 기록은 기존 가이드 본문에 흩어져 있던 관찰과 검토를 원문 그대로 모았다. 설치 절차와 섞인 문장도 당시 맥락 보존을 위해 남긴다.

## 본문에서 분리한 검토·관찰 기록

### 기존 가이드 5–6행

- **현재 복구 구성:** 두 줄 상태줄(첫째 줄 캐시·지출액, 둘째 줄 CO·OC·OR), 🎯 캐시 아이콘, effort 문자열 표시, 모델 아이콘 제거, **조회 플러그인(3종 중 설치할 제공자는 사용자 선택, §1-5·§13) + `omp-usage-row` 레이아웃 확장**, 전역 규칙, Eval 프렐류드, 입력 단어 자동완성 off. 기존 공통 설정은 Windows 10 x64·macOS Apple Silicon의 omp 18.11.2에서 검증했고, 최신 두 줄 상태줄은 **macOS omp 18.11.3**에서 확인했다(§11).
- **Windows 재검증:** Windows 10 x64, Git Bash, omp **18.11.3**에서 Codex 추가·OC 접두어·두 줄 레이아웃을 적용하고 세 그룹의 실제 조회·배치를 확인했다(§12). §9의 18.11.2 및 §4의 18.11.1 검증은 당시 구성의 과거 기록이다.

### 기존 가이드 56–56행

macOS 신규 설치 명령은 이 환경에서 재실행하지 않았다. 기존 설치본 18.11.2로 설정·렌더링·제어 동작을 검증했다.

### 기존 가이드 81–81행

# 이 변환 예제는 macOS 검수에서 실행하지 않았다.

### 기존 가이드 134–134행

- Windows 과거 설치 커밋(참고): `omp-opencode-go-usage#fda9a4e`, `omp-openrouter-credits#a302954`. 재설치는 브랜치 최신을 받으므로 이 커밋과 같다고 보장하지 않는다.

### 기존 가이드 215–221행

- 다음 표는 **Windows 18.11.0 기록의 내장 `default` 프리셋**이다. 현재 공통 복구 설정은 §2 YAML 블록이며, 내장 프리셋의 최신 기본값이라고 가정하지 않는다:

  | 항목 | 값 |
  |---|---|
  | 기본 `leftSegments` | `pi, vim, model, mode, collab, stream, path, git, pr, context_pct, cost` |
  | 기본 `rightSegments` | `session_name` |
  | 기본 `segmentOptions` | `model.showThinkingLevel`, `path.abbreviate/maxLength=40/stripWorkPrefix`, `git.show*` 4종 |

### 기존 가이드 324–324행

- 복사본은 **스냅샷**이다. omp 업데이트로 내장 테마가 바뀌면 설치 버전에 맞는 파일을 다시 복사한 뒤 이름 변경과 위 전체 `symbols` 블록을 재적용한다. Windows 과거 기록은 v18.11.0, macOS 검증은 v18.11.2의 titanium을 사용했다. Windows 재검증에서는 기존 테마의 기본 속성이 v18.11.2와 동일함을 확인해 덮어쓰지 않고 전체 심볼 오버라이드만 병합했다(§9).

### 기존 가이드 343–343행

- 모델명 앞 아이콘은 `icon.model`(unicode `⬢`, nerd `\uec19`, ascii `[M]`)이다. 이 PC는 `""`로 두어 상태줄이 `π · DeepSeek V4.1 Flash · high`로 시작한다(검증: `omp gallery --segment model --plain` → `Sonnet 4.5 · high`). 빈 값일 때 공백은 남지 않는다. 같은 심볼을 쓰는 표면도 함께 비워진다: model-hub(`/models`) 행, agents-hub, 모델 멘션 자동완성 드롭다운(`model-mention-autocomplete`), composer의 모델 첨부 칩(`composer-attachments`), `/setup` 테마 미리보기.

### 기존 가이드 357–361행

- **`auto` 미해결 상태의 `⟳`는 유지한다.** omp 18.11.2는 `${theme.thinking.autoPending} auto`로 렌더링하므로 테마 값을 `""`로 비우면 글리프는 사라지지만 `·  auto`처럼 고정 공백이 남는다. 현재 설정·테마만으로 글리프와 이 공백을 함께 없애는 방법은 확인되지 않아 원복했다. 코드 수정까지 불가능하다는 뜻은 아니다. auto가 레벨로 해결되면 해당 레벨 단어가 표시된다.
- **`off`의 `⦸`는 다른 화면의 표식을 보존하기 위해 유지한다.** off 전용 심볼이 없고 `${theme.status.disabled} off`를 사용한다. `status.disabled`를 비우면 글리프를 제거할 수 있지만 agents-hub·확장 관리·model-browser·plugin-settings의 비활성 표식까지 사라지고 앞 공백도 남는다. 현재 테마 설정으로 상태줄의 off만 독립적으로 제거할 수 없으므로 공유 심볼은 변경하지 않았다.
- 최종 테마의 갤러리 검증: `omp gallery --segment model --plain` → `Sonnet 4.5 · high`(모델 아이콘·effort 글리프 없음). 실제 TUI에서도 `DeepSeek V4.1 Flash · high`, `max` 등의 단어 표시를 확인했다.
- DeepSeek를 선택한 최종 설정에서 off·미해결 auto의 모델 세그먼트는 각각 `DeepSeek V4.1 Flash · ⦸ off`, `DeepSeek V4.1 Flash · ⟳ auto` 형태다. 이전 모델 아이콘 제거 전 출력과 혼동하지 않는다.
- 오버라이드는 테마 전역이다. 소스에서 확인한 사용처는 모델 세그먼트 render 경로와 에이전트 허브 행이며, 푸터의 auto 미해결 표기는 `thinking.autoPending`을 사용한다(이 가이드는 변경하지 않음). 단어를 별도 계산하는 `thinkingLevelWord()` 경로는 심볼과 무관하다.

### 기존 가이드 389–389행

1. **OS 권한:** 캡처·입력·접근성이 가능한지는 `computer.capabilities()`의 `capturePermission`/`inputPermission`/`axPermission`으로 확인한다. 이 macOS 환경에서 확인한 메뉴는 **시스템 설정 → 개인정보 보호 및 보안 → 기기 제어 및 데이터 접근**이다. 터미널 앱 권한을 허용한 뒤 터미널을 재시작했다(§8). 메뉴명은 macOS 버전에 따라 다를 수 있으며, `computer.enabled: true`나 도구 승인 정책으로 OS 권한을 대신 부여할 수 없다.

### 기존 가이드 393–398행

### Windows 과거 동작 기록 (18.11.1)

- 백엔드 `win32`는 과거 검증 환경에서 캡처·입력·UIA를 네이티브로 지원했고, `capturePermission`/`inputPermission`/`axPermission`이 모두 `granted`였다. 이는 그 환경의 OS 권한 보고값이며, 모든 Windows 환경이나 모든 동작에 사용자 승인이 불필요하다는 의미가 아니다.
- 스크린샷 저장: `computer`는 `%TEMP%\omp-computer-*.png`, `browser`는 `browser.screenshotDir`(미설정 시 `%TEMP%\omp-sshots-*.webp`).
- Windows 과거 검증에서는 관리형 headless 브라우저가 프로젝트 단위 공유 데몬 `omp.browser.headless`로 떴고, 설치돼 있던 `C:\Program Files\Google\Chrome\Application\chrome.exe`를 재사용했다(전용 프로필: `~/.omp/run/daemons/<hash>/omp.browser.headless.profile`). 필요한 브라우저가 없으면 첫 사용 시 준비된다.
- 이미 로그인된 자기 Chrome 탭을 그대로 몰려면 relay: `omp browser-relay install`(확장을 `~/.omp/browser-relay/extension`에 풀고 로드 절차를 출력) → 확장 로드 → `browser.relay: true`.

### 기존 가이드 431–435행

### Windows 과거 실측 결과

Windows 18.11.1 기록: capabilities가 `win32` + `capture`/`input`/`ax` 전부 `true`, `displayCount: 1`이었다. 창 열거·캡처·AX 읽기, 메모장 AX `setValue`, 입력·클립보드 왕복을 확인했다. 브라우저 `open`/`observe`/`evaluate`/`screenshot`/`tabs`/`close`도 확인했다. 당시 창 캡처는 1419×752였으며, 이 결과를 다른 OS·모델 transport의 해상도나 권한 보장으로 해석하지 않는다. macOS의 별도 실측은 §8에 기록한다.

최신 **Windows 18.11.2 재검증은 §9**에 기록한다. 이번에는 계산기의 AX 버튼 조작과 브라우저 입력·클릭을 검증했으며, 위 18.11.1의 키보드·포인터·클립보드 결과를 새 버전의 재검증 결과로 재사용하지 않는다.

### 기존 가이드 480–480행

- 둘째 줄도 터미널 폭보다 길면 **잘리며 자동 줄바꿈하지 않는다**. 정상 수치의 세 그룹은 80열에서 모두 확인했다. 긴 수치·오류 표식 또는 더 좁은 창에서는 끝이 잘릴 수 있다.

### 기존 가이드 535–535행

- **대화·이력까지 보존:** `sessions/`와 필요한 DB도 백업 대상이다. 실제 18.11.2의 `agent.db`에는 `auth_credentials`, `settings`, `usage_history` 등의 테이블이 있으므로 **`*.db`를 모두 폐기 가능한 캐시로 취급하지 않는다.** 로그 보존 여부는 진단 필요와 민감정보 보관 정책에 따라 결정한다.

---

## 8. macOS 적용 기록 (2026-10-17)

- Apple Silicon macOS의 **omp 18.11.2**에서 §2 설정, 플러그인 2종, §7 전역 규칙을 적용했다. 기존 모델·인증·설치 설정은 유지했다.
- macOS 신규 설치·테마 복사 절차는 §1·§3에 분리했다. 이 기록은 기존 설치본을 이용한 검증이며, Windows 설치 명령이나 애드온 파일을 macOS에서 재사용하지 않는다.
- 설정 경로는 동일하게 `~/.omp/agent/config.yml`, `~/.omp/agent/themes/titanium-custom.json`, `~/.omp/agent/RULES.md`다. 테마는 설치 버전과 일치하는 `v18.11.2`의 titanium JSON을 복사하고 §3의 이름·아이콘 변경만 적용했다.
- `omp plugin list`에서 두 플러그인의 활성 상태를 확인했다. 실제 TUI 하단 한 줄에서 OpenCode Go 사용률과 `OR $4.87`이 ` · `로 연결됨을 확인했다(잔액·사용률은 조회 시점 값).
- `omp gallery --segment cache_hit --plain --width 200`에서 `🎯 77.92%`, `status` 갤러리에서 `Indexer ready · Tests passing`을 확인했다. 새 TUI에서 캐시 읽기가 없으면 🎯가 숨겨지는 동작은 동일하다.
- Eval의 `browser.open` → 제목·페이지 관찰 → `close`가 정상 동작했다. 관리형 Chrome for Testing의 macOS ARM 바이너리가 준비됐고 `omp ps`에서 `omp.browser.headless`가 `ready`였다.
- 데스크톱 제어 권한: **시스템 설정 → 개인정보 보호 및 보안 → 기기 제어 및 데이터 접근**에서 omp를 실행하는 터미널 앱의 권한을 활성화하고, **터미널을 종료한 뒤 다시 실행한다**. 이 macOS 환경에서 실제 확인한 메뉴명이며, 기존 안내의 `손쉬운 사용`을 대신한다.
- 권한 적용 후 Eval에서 `await computer.capabilities()`로 확인한다. 이 환경에서는 터미널 재시작 후 `backend: quartz`, `capturePermission: granted`, `inputPermission: granted`, `axPermission: granted`와 `capture: true`, `input: true`, `ax: true`를 확인했다. 백그라운드 창 입력과 메뉴 제어도 지원 활성 상태다.
- 실제 컴퓨터 제어 검증: 계산기 창의 화면 캡처·접근성 트리 읽기에 성공했고, 접근성 버튼으로 `123 + 456 = 579`, 네이티브 키보드 입력으로 `7 × 8 = 56`을 계산해 화면·접근성 값으로 확인했다. macOS에서 `press('*')`는 키코드로 지원되지 않으므로 `press('shift+8')`을 사용했다.
- 실제 브라우저 제어 검증: 관리형 Chromium에서 `example.com` 제목·페이지를 읽고, 독립 테스트 페이지에 `맥OS 브라우저 제어 정상`을 입력한 뒤 확인 버튼을 클릭해 `확인: 맥OS 브라우저 제어 정상` 표시와 화면 캡처를 확인했다. 테스트 탭은 닫았으며 기존 문서·로그인된 브라우저 탭은 변경하지 않았다.
- 테마·상태줄과 새 플러그인을 현재 대화에도 확실히 반영하려면 omp를 종료 후 다시 실행한다. 전역 규칙은 새 세션 또는 `/new`·`/clear`에서 다시 읽는다.
- 모델·effort 표기는 현재 §0 예시에도 유지된다. `compactThinkingLevel: false`와 §3의 전체 오버라이드로 6단계 effort를 단어로 표시하고 모델 아이콘을 제거했다. 당시 사용량은 한 줄 구성이었으며 최신 두 줄 구성은 §11을 따른다. `off`는 공유 비활성 표식을 보존하기 위해, 미해결 `auto`는 글리프 제거 시 남는 고정 공백을 피하기 위해 기본 글리프를 유지하기로 했다. 이 제한은 18.11.2의 설정·테마 방식에 관한 것이며 코드 수정까지 불가능하다는 뜻은 아니다.

---

## 9. Windows 적용·재검증 기록 (2026-10-17)

- 최신 가이드 커밋 `13730f1`을 기준으로 **Windows 10 x64, omp 18.11.2**의 기본 프로필에 적용했다. 바이너리는 이미 18.11.2여서 재설치·업데이트하지 않았다.
- `~/.omp/agent/config.yml`의 `statusLine`에 **`compactThinkingLevel: false`**를 추가했다. `computer.enabled: true`, 입력 자동완성 `"off"`, 테마 선택과 나머지 §2 설정은 이미 일치했다. 기존 `shellPath`, 모델 `openai-codex/gpt-6-astra:high`, 인증·도구 승인 정책은 변경하지 않았다.
- `~/.omp/agent/themes/titanium-custom.json`의 `$schema`·`vars`·`colors`·`export`·`terminal`을 공식 `v18.11.2` titanium JSON과 비교해 모두 동일함을 확인했다. 기존 파일을 덮어쓰지 않고 `icon.cache`를 유지하면서 `icon.model: ""`와 6단계 `thinking.*` 단어 오버라이드를 병합했다. `thinking.autoPending`·`status.disabled`는 변경하지 않았다.
- `~/.omp/agent/RULES.md`는 §7과 일치해 유지했다. `omp plugin list`에서 `omp-opencode-go-usage@1.0.0`, `omp-openrouter-credits@1.0.0`이 모두 활성 상태였다. 플러그인 재설치는 하지 않았다.

### 상태줄 검증

| 실행 | 관찰 결과 |
|---|---|
| `omp config get statusLine.compactThinkingLevel` | `false` |
| `omp gallery --segment model --plain --width 200` | 기본 사례 `Sonnet 4.5 · high` — 모델 아이콘·effort 글리프 없음 |
| `omp gallery --segment status --plain --width 200` | `Indexer ready · Tests passing` |
| `omp gallery --segment cache_hit --plain --width 200` | `🎯 77.92%` |
| 새 TUI `omp --no-session --no-title` | 하단 한 줄에서 `GPT-6 Astra · high`와 `5h 0% \| Wk 1% \| Mo 0% · OR $4.68` 확인 |

새 TUI는 PTY에서 실행해 플러그인 값이 로드된 실제 출력을 확인한 뒤 검증 명령의 제한 시간으로 종료됐다. 사용률·잔액은 조회 시점 값이다. 모델 요청은 보내지 않았고, 새 세션에 캐시 읽기가 없어 실제 TUI에는 🎯가 표시되지 않았다. 캐시 아이콘 검증은 갤러리 결과와 구분한다.

### computer-use / browser-use 재검증

- CLI에서 `computer.enabled`, `browser.enabled`, `eval.js`가 모두 `true`였다.
- `computer.capabilities()`는 `backend: win32`, `capture/input/ax: true`, 세 권한 모두 `granted`, `displayCount: 1`, `screenLocked/displayAsleep: false`를 보고했다. 이 보고값만으로 모든 입력 경로가 검증됐다고 판단하지 않는다.
- 새로 연 Windows 계산기의 **315×534 창 캡처와 AX 트리**를 확인했다. AX 버튼으로 `123 + 456 =`를 입력하고, 새 AX의 `표시는 579`와 화면의 `579`를 모두 확인했다. 이번 검증에서는 네이티브 키보드·좌표 입력·클립보드를 변경하지 않았고 전경 제어권도 획득하지 않았다.
- 관리형 headless 브라우저에서 `https://example.com`의 제목 `Example Domain`과 페이지를 관찰했다. 이어 독립 `data:` 테스트 페이지에 `Windows 브라우저 제어 정상`을 입력하고 확인 버튼을 클릭해 **`확인: Windows 브라우저 제어 정상`** 텍스트와 화면 캡처를 확인했다.
- 브라우저 사용 후 `omp ps`에서 `omp.browser.headless`가 `ready`였고, 실행 파일은 기존 `C:\Program Files\Google\Chrome\Application\chrome.exe`였다. 로그인된 사용자 브라우저 탭이나 relay는 사용하지 않았다.
- 테스트용 계산기 창과 브라우저 탭만 닫고 목록에서 사라진 것을 확인했다. 데스크톱 제어 세션도 종료했다. 기존 문서·클립보드·로그인 상태는 변경하지 않았다.
- 현재 실행 중인 omp의 테마·상태줄에도 확실히 반영하려면 종료 후 다시 실행한다. 설정·테마·전역 규칙은 사용자 디렉터리에 있고, 저장소에는 이 검증 기록만 반영한다.

---

## 10. Codex 사용량·OC 접두어 추가 확인 (2026-10-17)

- **macOS Apple Silicon, omp 18.11.3**에서 3종 상태줄을 검증했다. 이번 작업에서는 omp 바이너리·모델·인증·테마·승인 정책을 변경하지 않았다.
- 확인 시점에 `omp-codex-usage@1.0.0`, `omp-opencode-go-usage@1.0.0`, `omp-openrouter-credits@1.0.0`이 이미 활성화돼 있었다. Codex와 OpenCode는 각각 `~/Projects/omp-codex-usage`, `~/Projects/omp-opencode-go-usage`로 연결된 로컬 플러그인이었다. Codex는 재설치하지 않았다. OpenCode는 갱신 명령의 `--dry-run` 확인 중 링크가 실제 설치본으로 교체되어, 원래 로컬 경로를 `omp plugin install`로 다시 연결했다. 원본 프로젝트 코드는 수정하지 않았다.
- 설치된 코드에서 Codex의 `CO`와 OpenCode의 `OC` 접두어를 확인했다. Codex 플러그인은 기존 OAuth로 기본 플랜 사용률을 조회한다. 추가 모델별 한도·코드 리뷰·유료 크레딧·저장된 리셋 횟수는 이 미터에 합산하지 않는다.
- 기존 `composer.shape: claude`, `preset: custom`, `leftSegments` 끝의 `status`, `rightSegments: [session_name]`, `showHookStatus: false`를 유지했다. 새 세그먼트나 별도 상태 행은 추가하지 않았다.
- 240열 PTY에서 실제 `omp --no-session --no-title`을 실행해 아래 **한 줄** 출력을 캡처했다. 모델 프롬프트는 전송하지 않았으며, 사용률·잔액은 조회 시점 값이다:

```text
π · GPT-6 Astra · high · 📁 omp-setup-guide · ⑂ main · ◫ 3.0%/272K ⟲ · (sub) · CO 5h 70% | Wk 27% · OC 5h 0% | Wk 2% | Mo 1% · OR $4.65
```

- 기존 두 플러그인 사이 구분 방식과 동일하게 각 사용량 그룹은 ` | `, 그룹 사이는 ` · `로 표시됐다. 넓은 PTY에서는 세 그룹이 모두 보였으며, 좁은 화면은 오른쪽이 잘릴 수 있다.
- 검증용 omp 프로세스는 종료했다. 이미 실행 중인 세션에서 새 플러그인·접두어가 보이지 않으면 omp를 재시작한다. §8·§9는 변경 전 2종 구성의 과거 검증 기록으로 보존하며, 이번 Codex 추가·OC 접두어 구성의 Windows 실동작은 아직 재검증하지 않았다.

---

## 11. 사용량을 둘째 줄 하나로 분리 (2026-10-17)

- **macOS Apple Silicon, omp 18.11.3**에서 적용했다. 원본 조회 플러그인 소스·인증·모델·테마는 변경하지 않았다.
- 이 저장소를 로컬 `omp-usage-row@1.0.0` 플러그인으로 연결했다. 원본 3종은 설치 상태를 유지하고 자동 로딩만 껐다. 통합 확장이 원본 조회 함수를 실행하며, 결과는 CO → OC → OR 순서로 ` · `로 합쳐 한 훅으로 게시한다. 세 그룹 사이에 줄바꿈 문자는 넣지 않는다.
- `leftSegments` 끝의 `status`를 제거하고 `showHookStatus: true`로 바꿨다. 그 외 첫째 줄의 `cache_hit`·`cost`, 컴포저와 세그먼트 옵션은 유지했다.
- 실제 `omp --no-session --no-title`을 **120열과 80열 PTY**에서 각각 실행했다. 두 폭 모두 첫째 줄의 `(sub)` 바로 다음 행에 아래 세 그룹이 모두 표시됐고 확장 로딩 오류가 없었다. 사용률·잔액은 조회 시점 값이다:

```text
π · GPT-6 Astra · high · 📁 …p-setup-guide · ⑂ main ?2 · ◫ 3.0%/272K ⟲ · (sub)
CO 5h 49% | Wk 8% · OC 5h 0% | Wk 2% | Mo 1% · OR $4.65
```

- 모델 프롬프트를 보내지 않아 새 검증 세션에는 캐시 읽기 값이 없었다. 🎯는 숨겨졌고, Codex 구독 모델의 지출 표시는 달러액 대신 기존 `(sub)`였다. 캐시·지출액 계산 로직은 변경하지 않았다.
- 검증 프로세스는 모두 종료했다. 현재 열린 omp에는 기존 확장이 남아 있으므로 **종료 후 다시 실행**해야 새 로딩 구성이 적용된다. Windows 실행은 아직 검증하지 않았으며 §8–10은 당시 레이아웃의 과거 기록으로 보존한다.

### Pi 배지·정렬·색상 변경 이력 (최종: 사용량은 Pi와 같은 색상)

- `extensions/usage-row.ts`에서 `ctx.ui.theme.icon.omp`와 `theme.fg()`를 사용한다. 배지는 `dim`이며, CO·OC·OR에 처음 적용했던 `statusLineModel` 강조색은 아래 회색 변경으로 대체했다. 모든 조회 값이 없으면 배지만 남기지 않고 행 전체를 숨긴다.
- macOS omp 18.11.3의 80열·120열 실제 TUI에서 `π · CO … · OC … · OR …`가 같은 둘째 행에 표시되는 것을 확인했다. 터미널 셀의 전경색을 비교해 세 사용량 그룹과 당시 모델명 `GPT-6.1 Sol` 모두 `#00b4ff`, 두 행의 `π` 배지도 같은 색임을 확인했다. 기존 모델 선택은 변경하지 않았다.
- 좌측 정렬: 기본 훅 상태는 앞쪽 일반 공백을 제거하므로, 둘째 줄 앞에 한 칸 폭의 빈 문자 `U+2800`을 넣어 `claude` 컴포저의 첫째 줄 들여쓰기와 맞췄다. 80열·120열 실제 TUI에서 두 `π`가 모두 **두 번째 열**에 놓이는 것과 강조색·CO/OC/OR의 동일 행 유지도 확인했다. 이 들여쓰기는 현재 `composer.shape: claude` 기준이다.
- `π` 바로 뒤 첫 구분자 `·`는 기본 글자색이 아닌 `statusLineSep`로 칠해 윗줄과 통일했다. 80열 실제 TUI의 셀 색상을 비교해 두 구분자가 모두 `#2a3038`, 굵게 표시하지 않는 상태임을 확인했다. 배지 정렬과 사용량 강조색은 유지했다.
- 이전 회색 조정: 사용량 강조색이 너무 눈에 띈다는 피드백에 따라 CO·OC·OR 전체를 첫 구분자와 같은 `statusLineSep`로 변경했다. 당시 80열 실제 TUI에서 사용량의 모든 문자·수치·구분자가 윗줄 첫 `·`와 같은 `#2a3038`인 것을 확인했다. 이후 macOS 터미널에서 너무 희미하다는 피드백으로 아래 최종 설정으로 대체했다.
- 최종 색상: 사용량 텍스트·숫자·`|`는 둘째 줄 `π`와 같은 `dim`으로 변경하고, 첫 dot와 그룹 사이 dot는 `statusLineSep`를 유지했다. 80열 실제 TUI의 셀 비교에서 사용량과 `π`가 같은 `#767676`, 세 dot가 기존 구분자 색상 `#303030`으로 렌더링됨을 확인했다(해당 실행의 터미널 색상 모드 기준). 좌측 정렬·CO/OC/OR 순서·동일 행 배치는 유지했다.
- 이 검증에서도 모델 요청은 보내지 않았고 검증 프로세스는 종료했다. 적용에는 omp 재시작이 필요하다.

### 조회 플러그인 3종의 GitHub 설치 전환

- Codex·OpenCode Go·OpenRouter를 각각 `github:pawprint0706/omp-codex-usage`, `github:pawprint0706/omp-opencode-go-usage`, `github:pawprint0706/omp-openrouter-credits`에서 강제 설치했다. 사용자 플러그인 `package.json`의 세 의존성이 이 GitHub 주소이며, 설치 디렉터리가 심볼릭 링크가 아닌 것을 확인했다.
- 기존 로컬 원본 프로젝트는 변경·삭제하지 않았다. `omp-usage-row`는 이 가이드 저장소로 연결된 로컬 확장을 유지했고, 중복 조회를 막기 위해 조회 원본 3종의 자동 로딩은 비활성 상태를 유지했다.
- macOS omp 18.11.3의 80열 실제 TUI에서 `π · CO 5h 8% | Wk 1% · OC 5h 0% | Wk 2% | Mo 1% · OR $4.65`를 확인했다(조회 시점 값). 두 줄 배치·Pi 정렬·사용량과 Pi의 동일색·dot 색상 유지도 확인했다. 모델 요청은 보내지 않았고 검증 프로세스는 종료했다.

---

## 12. Windows 조회 플러그인·두 줄 레이아웃 적용 (2026-10-17)

- 최신 가이드 커밋 `a9a8041` 기준으로 기존 Windows omp **18.11.3**에 적용했다. 기존 모델 `openai-codex/gpt-6.1-sol:medium`, 인증·승인 정책·커스텀 테마·전역 규칙은 유지했다.
- §1-5의 GitHub 강제 설치 명령으로 Codex를 신규 설치하고 OpenCode Go·OpenRouter를 최신 설치본으로 맞췄다. 세 패키지는 심볼릭 링크가 아닌 GitHub 설치본이며, OpenCode 코드의 `OC` 접두어도 확인했다.
- `omp plugin install .`로 `omp-usage-row`를 `C:\Projects\omp-setup-guide`에 연결했다. 조회 원본 3종은 자동 로딩만 비활성화하고 통합 확장만 활성화했다. 이 저장소 폴더를 유지해야 한다.
- `statusLine.leftSegments`에서 `status`를 제거하고 `showHookStatus: true`로 변경했다. 나머지 §2 설정과 §3 테마 오버라이드는 유지했다.
- `omp plugin doctor` 결과는 **7 ok, 0 warnings, 0 errors**였다.
- 실제 PTY에서 `omp --no-session --no-title`을 실행해 첫째 줄의 `GPT-6.1 Sol · medium`·컨텍스트·`(sub)` 바로 아래 한 행에 다음 조회 결과가 함께 나오는 것을 확인했다:

```text
 π · GPT-6.1 Sol · medium · 📁 C:\Projects\omp-setup-guide · ⑂ main · ◫ 1.6%/500K ⟲ · (sub)
 π · CO 5h 11% | Wk 2% · OC 5h 0% | Wk 2% | Mo 1% · OR $4.64
```

- 수치는 조회 시점 값이다. 세 그룹이 모두 조회됐고 `?` 오류 표식·중복 사용량 행·확장 로딩 오류는 없었다. 새 세션에는 모델 요청을 보내지 않아 캐시 읽기 아이콘은 표시되지 않았다.
- 사용량의 `dim` 색상과 dot의 `statusLineSep`, 둘째 줄 들여쓰기는 저장소의 확장을 그대로 사용한다. 이번 검증에서는 터미널 셀의 RGB 값이나 좁은 폭별 배치를 별도로 측정하지 않았다.
- 검증 프로세스는 12초 제한으로 종료했다. 현재 대화의 기존 확장 로딩을 교체하려면 omp를 종료 후 다시 실행한다. 로그인이나 모델 변경은 필요하지 않다.

---

## 13. OpenRouter 플러그인 제거와 조회 플러그인 선택 사항 확정 (2026-10-29)

- 2026-10-22 Windows 세션에서 "오픈라우터 잔액 조회 플러그인을 제거해줘" 요청을 반영해 `omp plugin uninstall omp-openrouter-credits`를 실행했다. 제거 후 `omp plugin list`와 lock 파일에서 3종 구성에서 빠졌음을 확인했다. 다시 필요해지면 §1-5의 설치 명령과 `disable`으로 복구한다.
- 이에 따라 `extensions/usage-row.ts`의 로딩을 보강했다: 설치 디렉터리에 확장 파일이 없는 제공자는 건너뛰고, import나 팩토리 시작이 실패한 제공자도 건너뛴다. 나머지 제공자는 계속 로드되며, 3종 전부가 미설치여도 확장 로딩은 성공하고 두째 줄 전체만 숨겨진다. 시나리오 테스트(전부 미설치 / 일부 미설치 / import 실패 / 시작 실패)로 확인했다.
- 조회 플러그인 3종의 설치 구성은 사용자 선택 사항으로 확정했다. 설치·삭제 요청은 이 가이드가 관리하는 구성 변경이며, 요청받은 제공자만 설치하거나 제거한다. 제거해도 `omp-usage-row`와 이 가이드 저장소는 유지한다.
- 이 PC 기준 상태: `omp-codex-usage`·`omp-opencode-go-usage`는 GitHub 설치 + 자동 로딩 비활성, `omp-usage-row` 활성, `omp-openrouter-credits` 미설치. `omp plugin doctor`는 6 ok, 0 errors였다.


## 문서 역할 분리 (2026-10-29)

- 설치 가이드는 Windows·macOS별 진행 순서, 공통 설정, 설치 후 확인 및 문제 해결에 집중하도록 정리했다.
- 기존 §8–13과 본문에 섞인 버전별 관찰·검토 결과를 이 문서로 이동했다. 프로그램 코드와 사용자 환경 설정은 변경하지 않았다.
