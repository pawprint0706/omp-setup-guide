# omp 셋업 가이드 (Windows)

이 PC의 omp 상태를 재설치 후 그대로 복구하기 위한 기록.
기준: **omp 18.11.0**(검증 시점 설치본 18.11.1), Windows 10 x64, Git Bash, 프로바이더 `opencode-go` + `openrouter`, 상태줄 플러그인 2종 + 커스텀 테마 1개, 전역 규칙 `RULES.md`, Eval 프렐류드 `computer`·`browser` 활성, 입력 단어 자동완성 off.
작성: 2026-10-15, 갱신: 2026-10-16 (실제 설정 파일·설치된 바이너리에서 확인한 값).

## 0. 목표 상태

하단 상태줄이 **한 줄**이고, 캐시 히트율은 🎯, 플러그인 값은 ` · `로 이어져 끝에 붙는다:

```
π · ◒ DeepSeek V4.1 Flash · 📁 C:\Projects · ◫ 0.9%/1M ⟲ · 🎯 49.17% · $0.00 · 5h 2% | Wk 0% | Mo 0% · OR $4.89
```

| 조각 | 출처 |
|---|---|
| `◫ 0.9%/1M ⟲` | 내장 `context_pct` 세그먼트 |
| `🎯 49.17%` | 내장 `cache_hit` 세그먼트 + 커스텀 테마의 아이콘 오버라이드 (§3) |
| `5h 2% \| Wk 0% \| Mo 0%` | 플러그인 `omp-opencode-go-usage` |
| `OR $4.89` | 플러그인 `omp-openrouter-credits` |

---

## 1. 설치 순서

### 1) omp 바이너리

```powershell
irm https://omp.sh/install.ps1 | iex        # 설치 위치: %LOCALAPPDATA%\omp\omp.exe
omp --version                               # omp/18.11.0
```

- 설치 스크립트는 `https://raw.githubusercontent.com/can1357/oh-my-pi/main/scripts/install.sh|.ps1`로 302되고, 바이너리는 `PI_BUILD_URL`(기본 `https://build.stencil.so`)에서 sha256 검증 후 받는다.
- 업데이트는 `omp update` (`--canary` / `--stable`).
- **사용자 데이터는 `~/.omp`**이며 바이너리 재설치로는 사라지지 않는다. `~/.omp`를 지우면 설정·테마·자격증명·플러그인이 전부 사라진다.

### 2) 자격증명

```powershell
omp login opencode-go
omp login openrouter
```

또는 TUI에서 `/login <provider>`. 기존 PC에서 옮길 때:

```powershell
omp auth export > credentials.json     # 기존 PC
omp auth import credentials.json       # 새 PC
```

> `credentials.json`에는 평문 키가 들어 있다. 커밋 금지, 백업도 암호화된 곳에.

### 3) `~/.omp/agent/config.yml`

§2의 키만 병합한다. omp 사용자 설정 파일은 이 하나뿐이다(프로필 디렉터리 없음, 프로젝트 `.omp/config.yml` 없음, `agent/settings.json.bak`은 과거 마이그레이션 백업). 나머지 키는 설치 환경이 채운 값을 그대로 둔다.

### 4) 커스텀 테마 `~/.omp/agent/themes/titanium-custom.json`

🎯 아이콘 오버라이드용. 절차와 함정은 §3. 이미 맞춰둔 PC가 있으면 그 파일을 그대로 복사하는 게 제일 빠르다.

### 5) 플러그인 2종

```powershell
omp plugin install github:pawprint0706/omp-opencode-go-usage
omp plugin install github:pawprint0706/omp-openrouter-credits
omp plugin list                      # ● 로 enabled 2개 확인
```

- 로컬 클론이 있으면 `omp plugin install <경로>` (junction/symlink로 걸림).
- 플러그인이 같이 배포하는 `statusline.yml`은 **참고용 블록이며 omp가 자동 병합하지 않는다** — §2의 `statusLine` 블록이 그 역할을 한다.
- 이 PC에 실제 설치된 커밋(참고): `omp-opencode-go-usage#fda9a4e`, `omp-openrouter-credits#a302954`. 재설치는 브랜치 최신을 받으므로 버전이 달라질 수 있다.
- 플러그인 자체 설명서: `~/.omp/plugins/node_modules/<name>/README.md`.

### 6) Eval 프렐류드 (computer-use / browser-use)

별도 설치물이 없다 — 데스크톱 백엔드는 네이티브 애드온(`~/.omp/natives/<version>/pi_natives.win32-x64-baseline.node`)으로 바이너리에 포함되고, managed Chromium은 첫 사용 시 자동으로 준비된다. 켜는 일은 설정 한 줄이다.

- `browser`는 기본 on(`browser.enabled: true`)이라 아무것도 하지 않는다.
- `computer`는 기본 off이므로 §2의 `computer.enabled: true`를 넣는다(§4).
- 설정 파일은 omp가 감시하므로 재시작 없이 다음 Eval 호출부터 반영된다. 세션 한정으로만 쓰려면 `/computer on`.

### 7) 검증

```powershell
omp config get statusLine.preset          # custom
omp config get statusLine.leftSegments    # [..."context_pct","cache_hit","cost","status"]
omp config get statusLine.showHookStatus  # false
omp config get theme.dark                 # titanium-custom
omp config get spelling.autocomplete      # off
omp config get computer.enabled           # true
omp config get browser.enabled            # true
omp plugin list                           # ● 2개

omp gallery --segment status --plain --width 200      # 훅 상태가 ' · '로 이어진 형태
omp gallery --segment cache_hit --plain --width 200   # 🎯 77.92%  ← 아이콘 오버라이드 확인
omp ps                                                # omp.browser.headless  ready (browser 프렐류드 데몬)
omp                                                   # 실제 TUI: 하단이 한 줄 + 🎯 표시
```

`omp gallery`는 자격증명 없이 세그먼트 렌더만 결정적으로 확인하는 도구다(`status`는 `Indexer ready · Tests passing`처럼 이어 붙여, `cache_hit`은 현재 테마의 아이콘으로 그린다). 두 프렐류드가 실제로 동작하는지는 Eval에서 확인한다 — §4.

---

## 2. `~/.omp/agent/config.yml` — 이 가이드가 관리하는 키만

아래 키만 넣는다(파일이 없으면 생성, 있으면 해당 키만 병합). `shellPath`, `modelRoles`, `symbolPreset`, `setupVersion` 같은 값은 머신·모델·설치 시점에 따라 달라지므로 여기서 고정하지 않는다 — 셋업 마법사와 `/models`가 채운 값을 그대로 둔다.

```yaml
# 1) 커스텀 테마 (§3의 🎯 아이콘 오버라이드)
theme:
  dark: titanium-custom

# 2) 입력창 모양
composer:
  shape: claude

# 3) 상태줄
statusLine:
  preset: custom
  leftSegments: [pi, vim, model, mode, collab, stream, path, git, pr, context_pct, cache_hit, cost, status]
  rightSegments: [session_name]
  separator: powerline-thin
  segmentOptions:
    model: { showThinkingLevel: true }
    path: { abbreviate: true, maxLength: 40, stripWorkPrefix: true }
    git: { showBranch: true, showStaged: true, showUnstaged: true, showUntracked: true }
  showHookStatus: false

# 4) 입력 단어 자동완성 off
spelling:
  autocomplete: off

# 5) 데스크톱 제어 — computer Eval 프렐류드 (기본 false, §4)
#    browser 프렐류드는 기본 true라 키를 두지 않는다.
computer:
  enabled: true
```

- `leftSegments`는 omp 18.11.0의 내장 `default` 프리셋에 `cache_hit`과 `status`를 덧붙인 것이다. 나머지 프리셋 값:

  | 항목 | 값 |
  |---|---|
  | 기본 `leftSegments` | `pi, vim, model, mode, collab, stream, path, git, pr, context_pct, cost` |
  | 기본 `rightSegments` | `session_name` |
  | 기본 `segmentOptions` | `model.showThinkingLevel`, `path.abbreviate/maxLength=40/stripWorkPrefix`, `git.show*` 4종 |

- `preset: custom`은 `segmentOptions`가 **빈 맵에서 시작**한다. 위 블록을 생략하면 경로 축약·깃 플래그·thinking 아이콘이 사라진다.
- `composer.shape: claude`는 배치를 정한다: `rightSegments`는 입력창 **위** 꼬리줄, `leftSegments`는 **하단 행**에 그려진다. 그래서 캐시 히트율·플러그인 값이 하단 한 줄에 모인다(`rightSegments`로 옮기면 입력창 위로 올라간다). 기본값은 `band`.
- `spelling.autocomplete: off`는 **입력창 단어 자동완성(고스트 힌트)만** 끈 값이다. 같은 `interaction → Input` 그룹의 자동완성 항목은 서로 독립이라 따로 지정해야 한다:

  | 설정 키 | 설정 UI 라벨 | 이 PC 값 | 끄는 값 |
  |---|---|---|---|
  | `spelling.autocomplete` | Word Autocomplete | `off` | `off` (기본 `auto`, 그 외 `ngram`/`smollm`/`apple`) |
  | `emojiAutocomplete` | Emoji Autocomplete | `true` (기본) | `false` |
  | `autocompleteMaxVisible` | Autocomplete Items | `10` (기본) | 끄는 값은 없음(3~20 개수만) |

  `/settings`(interaction 탭 → Input 그룹)에서도 같은 항목을 바꿀 수 있다.
- omp를 올려서 내장 `default` 프리셋이 바뀌면 이 목록도 다시 맞춘다(`/settings` → `statusLine`에서 확인).
- `computer.enabled`는 Eval 프렐류드(호스트 데스크톱 제어) 스위치다. `browser.*`는 기본값을 그대로 쓰므로 키를 두지 않는다 — 두 프렐류드의 설정·검증은 §4.
- 이름 있는 프로필을 쓰면 프로필마다 같은 키가 필요하다: `~/.omp/profiles/<profile>/agent/config.yml`.

---

## 3. 캐시 히트율(`cache_hit`) + 🎯 아이콘

### `cache_hit` 세그먼트

- `leftSegments`(또는 `rightSegments`)에 `cache_hit`을 넣으면 표시된다. `composer.shape: claude`에서는 `leftSegments`가 하단 행이므로 여기에 둔다.
- 값 = `cacheRead / (cacheRead + cacheWrite + input) × 100`, 소수 2자리.
- **`cacheRead`가 0이면 세그먼트 자체가 숨겨진다.** 세션 첫 요청에는 캐시 읽기가 없으므로 2번째 요청부터 나타난다(실측: 첫 턴 이후 `🎯 49.17%` → 다음 턴 `🎯 34.30%`).
- 아이콘은 심볼 프리셋의 `icon.cache`를 쓴다. `cache_read`, `cache_write` 세그먼트도 같은 `icon.cache`를 공유한다.

| 프리셋 | `icon.cache` 기본값 |
|---|---|
| `unicode` (기본값) | 💾 |
| `nerd` | `` (Nerd Font f1c0) |
| `ascii` | `cache` |

### 이모지 오버라이드 = 커스텀 테마

omp는 세그먼트 아이콘을 **테마의 `symbols.overrides`**로만 덮어쓸 수 있다(설정에는 아이콘 항목이 없다). 커스텀 테마는 `colors` 필수 토큰을 전부 요구하고 테마에 extends/overlay가 없으므로, **내장 테마를 통째로 복사한 뒤 `symbols`만 추가**한다.

```powershell
# 3-1. 내장 테마 복사 (설치된 버전 태그로 고정)
$themeDir = "$env:USERPROFILE\.omp\agent\themes"
New-Item -ItemType Directory -Force -Path $themeDir | Out-Null
curl.exe -sL -o "$themeDir\titanium-custom.json" `
  https://raw.githubusercontent.com/can1357/oh-my-pi/v18.11.0/packages/tui/src/theme/defaults/titanium.json
```

> `>` 리다이렉션은 쓰지 말 것. Windows PowerShell 5.1은 네이티브 명령 출력을 **UTF-16LE**로 저장해 테마 JSON이 깨진다(실측: `>` = 6292바이트 `FF FE` BOM, `curl.exe -o` = 3045바이트 UTF-8).

```diff
# 3-2. 이름 변경 (파일명과 JSON name을 맞춘다)
-  "name": "titanium",
+  "name": "titanium-custom",
```

```jsonc
// 3-3. 파일 끝, 마지막 "}" 앞에 symbols 블록 추가 (앞 블록 뒤에 쉼표 필요)
  "terminal": {
    ...
  },
  "symbols": {
    "overrides": {
      "icon.cache": "🎯"
    }
  }
}
```

```yaml
# 3-4. config.yml에서 이 테마 선택
theme:
  dark: titanium-custom
```

- `symbols.overrides`의 키는 **SymbolKey**(네임스페이스 이름)다. 잘못된 키는 무시되고 debug 로그에만 남는다 → 안 바뀌면 키 철자를 확인한다.
- 우선순위: 설정 `symbolPreset` > 테마 `symbols.preset` > 기본 `unicode`. `overrides`는 그 위에 적용된다.
- 검증: `omp gallery --segment cache_hit --plain` → `🎯 77.92%` (기본값 💾가 아니면 오버라이드가 먹은 것).
- 커스텀 테마가 로드되지 않으면(JSON 오류·필수 토큰 누락) omp는 조용히 `dark`로 폴백한다 → `omp config get theme.dark`와 `~/.omp/logs`를 함께 본다.
- 복사본은 **스냅샷**이다. omp 업데이트로 내장 테마 색이 바뀌면 복사본은 옛 색으로 남는다. 그때는 최신 내장 테마를 다시 복사하고 `symbols` 블록만 옮긴다. (18.11.0 태그 파일이 이 PC의 내장 titanium과 동일함은 vars/colors/export/terminal 비교로 확인했다.)
- 라이트 터미널에서도 같은 방식으로: `theme.light`용 복사본에 같은 `overrides`를 넣는다.

### 다른 아이콘도 바꾸려면

`overrides`에 키를 추가한다. unicode 프리셋 기준 자주 쓰는 키:

| 키 | 기본 | 키 | 기본 |
|---|---|---|---|
| `icon.cache` | 💾 | `icon.cost` | 💲 |
| `icon.context` | ◫ | `icon.time` | ⏱ |
| `icon.omp` | π | `icon.auto` | ⟲ |
| `icon.input` | ⤵ | `icon.output` | ⤴ |
| `icon.throughput` | ⚡ | `icon.agents` | 👥 |
| `icon.job` | ⚙ | `icon.host` | 🖥 |
| `icon.session` | 🆔 | `icon.warning` | ⚠ |

그 외: `icon.cacheMiss`, `icon.subscription`, `icon.advisor(Closed)`, `icon.ghost`, `icon.package`, `icon.rewind`, `icon.intelligence`, `icon.fast`, `icon.mic`, `icon.camera`, `icon.vim*`, `icon.extension*`(Skill/Tool/SlashCommand/Mcp/Rule/Hook/Prompt/ContextFile/Instruction).

---

## 4. computer-use / browser-use (Eval 프렐류드)

omp의 두 프렐류드는 AgentTool이 아니라 `eval` 커널에 마운트되는 전역 객체다. 따라서 **켜져 있는 Eval 런타임이 전제**이고(`eval.js`/`eval.py`, 기본 `true`), 켜고 끄는 것은 별도 키다.

| 프렐류드 | 다루는 대상 | 스위치 | 기본값 |
|---|---|---|---|
| `browser` | Chromium/CDP 탭 — DOM·ARIA·페이지 JS·스크린샷·다운로드·요청 라우팅 | `browser.enabled` | `true` |
| `computer` | 실제 호스트 데스크톱 — 창 열거·캡처·OS 입력·UI Automation·클립보드 | `computer.enabled` | **`false`** |

`browser`는 기본 on이라 손댈 것이 없고, §2의 `computer.enabled: true` 한 줄이 데스크톱 제어를 켠다. 세션 한정으로만 켜려면 `/computer on`(`/computer status`로 현재 상태, `/computer off`로 해제) — 이 명령들은 설정 파일을 쓰지 않는다.

| 키 | 기본 | 이 PC | 비고 |
|---|---|---|---|
| `computer.enabled` | `false` | `true` | |
| `computer.display` | `active` | 기본 | `desktop` 대상 전용. `active`=포커스 창과 겹침이 가장 큰 모니터(없으면 주 모니터), `all`=전체 합성, 또는 숫자 디스플레이 ID |
| `computer.maxWidth` / `maxHeight` | `3840` / `2400` | 기본 | 원본 디테일을 보존하지 못하는 transport(Claude 계열 폴백 포함)는 실효 상한이 `1280×896` |
| `browser.enabled` | `true` | `true` | |
| `browser.headless` | `true` | `true` | 탭별로는 `browser.open({headed:true})` |
| `browser.cdpUrl` / `relay` / `relayUrl` | unset / `false` / unset | 기본 | 기존 Chrome(CDP)·relay 연결용 |
| `browser.cmux` / `tern` | `true` | `true` | macOS 네이티브 뷰 백엔드 — Windows에서는 후보에 들지 않는다 |
| `browser.freezeOnTurnEnd` / `idleCloseSec` | `true` / `1800` | 기본 | omp 소유 탭의 턴 종료 동결 / 유휴 정리(초) |

승인: `computer`의 입력·변경 헬퍼는 exec 티어다. 이 PC는 `tools.approvalMode`가 `yolo`(설치 기본값)라 묻지 않고 실행된다. 확인을 받고 싶으면 `tools.approvalMode: write`(조회·스크린샷은 자동 승인, 입력·변경만 질문) 또는 `tools.approval: { computer: prompt }`를 쓴다.

### Windows에서의 동작

- 백엔드 `win32`: 캡처·입력·UIA가 모두 네이티브이고, macOS와 달리 **권한 승인이 필요 없다** — `computer.capabilities()`가 `capturePermission`/`inputPermission`/`axPermission`을 `granted`로 보고한다.
- 스크린샷 저장: `computer`는 `%TEMP%\omp-computer-*.png`, `browser`는 `browser.screenshotDir`(미설정 시 `%TEMP%\omp-sshots-*.webp`).
- managed 브라우저는 프로젝트 단위 공유 데몬이다. `omp ps`에 `omp.browser.headless`로 뜨며, 이 PC에서는 이미 설치돼 있던 `C:\Program Files\Google\Chrome\Application\chrome.exe`를 재사용했다(전용 프로필: `~/.omp/run/daemons/<hash>/omp.browser.headless.profile`). 없으면 첫 사용 시 자동 설치한다.
- 이미 로그인된 자기 Chrome 탭을 그대로 몰려면 relay: `omp browser-relay install`(확장을 `~/.omp/browser-relay/extension`에 풀고 로드 절차를 출력) → 확장 로드 → `browser.relay: true`.

### 검증 (이 PC, omp 18.11.1 실측)

```powershell
omp config get computer.enabled   # true
omp config get browser.enabled    # true
omp config get eval.js            # true
omp ps                            # omp.browser.headless  ready
```

설정 파일을 고치면 omp가 파일을 감시해 **다음 Eval 호출부터** 새 프렐류드를 반영한다(재시작 불필요). Eval에서 직접 두드려 확인한다:

```js
await computer.capabilities()
// {backend:"win32", capture:true, input:true, ax:true, backgroundWindowInput:true, takeover:true,
//  applications:true, menus:true, heldInput:true, spaces:false, globalEscape:true,
//  capturePermission:"granted", inputPermission:"granted", axPermission:"granted",
//  displayCount:1, screenLocked:false, displayAsleep:false, displayServer:"win32"}
const tab = await browser.open({ url: "https://example.com" });
await tab.title(); await tab.evaluate(() => document.title); await tab.close();
```

실측 결과: capabilities가 `win32` + `capture`/`input`/`ax` 전부 `true`, `displayCount: 1`. 데스크톱 쪽은 창 열거 → 창 캡처(동시에 AX 트리 수집) → AX `setValue`로 메모장 본문 변경 → `move`/`click`/`type`(`ctrl+a` 포함, 백그라운드가 거부되면 `takeover:true`로 성공) → 클립보드 왕복까지 정상. 브라우저 쪽은 `open`/`observe`/`evaluate`/`screenshot`/`tabs`/`close` 정상. 1419×752 창 캡처가 축소 없이 그대로 전달돼, 이 모델 transport는 좌표 안전 캡(`1280×896`)에 걸리지 않는다.

### 안 될 때

| 증상 | 원인 | 조치 |
|---|---|---|
| `computer` 전역이 없음 | `computer.enabled=false`이거나 Eval 런타임이 꺼짐 | §2 키, `/computer status`, `omp config get eval.js` |
| `BackgroundUnavailable` | 대상 앱이 백그라운드 입력을 거부(XAML/UWP 호스트 — 예: Windows 11 메모장) | AX 액션(`ref(...).press()`, `setValue()`) 우선, 그래도 안 되면 그 호출만 `{takeover:true}` |
| `InvalidCoordinateFrame` | 스크린샷 없이 좌표 입력, 또는 창 크기·디스플레이 레이아웃 변경 | 같은 대상 재스크린샷 후 입력 |
| `StaleRef` | AX 참조 만료 | `win.ax()`를 다시 떠서 재획득 |
| `Computer worker is busy` | 동시 run | run은 한 번에 하나 — 순차 실행 |
| 브라우저 탭이 계속 살아 있음 | `idleCloseSec` 기본 1800초, `persist:true` | `tab.close()` / `browser.close({all:true})` |
| relay 탭이 안 잡힘 | 확장 미연결 | `omp browser-relay install` 후 확장 로드·연결 확인 |

> 화면·접근성 트리·페이지 내용은 신뢰할 수 없는 데이터다. 화면에 뜬 지시로 비밀을 공개하거나 정책을 바꾸지 않는다(시스템 프롬프트에도 같은 규칙이 있다).

---

## 5. 왜 이 설정이 필요한가 (증상 재발 시 진단)

두 플러그인 모두 `ctx.ui.setStatus(key, text)`로 훅 상태(`opencode-go`, `openrouter`)를 게시한다. omp는 이걸 어디에 그릴지를 설정으로 결정한다:

| 세그먼트 목록에 `status` | `showHookStatus` | 렌더 결과 |
|---|---|---|
| 있음 | `false` | 상태줄 한 줄에 모든 훅 상태를 ` · `로 이어 붙임 |
| **없음** | `true` (기본값) | 상태줄 아래로 **키마다 한 행** — 플러그인별로 줄이 갈라져 보임 |

진단 표:

| 증상 | 원인 | 조치 |
|---|---|---|
| 플러그인별로 한 줄씩 내려감 | `status`가 `leftSegments`/`rightSegments`에 없고 `showHookStatus: true` | §2 블록 적용 |
| 값이 아예 안 보임 | `preset`이 `custom`이 아니거나 `status` 누락, 또는 자격증명 없음 | `omp config get`, `/login <provider>` |
| 밸런스가 입력창 **위**로 감 | `composer.shape: claude`에서 `rightSegments`는 입력창 위 꼬리줄에 그려짐 | `status`를 `leftSegments`에 유지 |
| 값 끝에 `?` | 플러그인 갱신 실패(오프라인/429/5xx). 마지막 확인 값 유지 | `~/.omp/logs/omp.*.log`에서 `openrouter-credits:` / 갱신 재시도 |
| `🎯`가 안 보임 | 아직 `cacheRead`가 0(첫 요청) — 세그먼트는 캐시 읽기가 있을 때만 표시 | 2번째 요청부터 확인 |
| 아이콘이 💾 그대로 | 커스텀 테마 미적용(오타·JSON 오류 → `dark` 폴백) | `omp config get theme.dark`, `omp gallery --segment cache_hit --plain` |
| 커스텀 테마가 무시됨 | `colors` 필수 토큰 누락 또는 JSON 오류 | §3의 내장 테마 복사부터 다시 |

추가 함정:

- 좁은 터미널에서는 이 한 줄이 **줄바꿈되지 않고 잘린다**. 줄이 갈라져 보이면 폭이 아니라 위 표의 첫 줄을 의심한다.
- 밸런스를 자기 행에 두고 싶으면 반대로 하면 된다: `status`를 빼고 `showHookStatus: true` 유지.
- 설정·테마 변경 후에는 omp를 재시작한다(세그먼트 목록과 테마는 시작 시 로드).

---

## 6. 재설치 체크리스트 (복붙용)

```powershell
# 1. 바이너리
irm https://omp.sh/install.ps1 | iex

# 2. 자격증명 (이전 PC에서 export 후 import, 아니면 login)
omp auth import credentials.json
#   omp login opencode-go ; omp login openrouter

# 3. 설정 파일 (%USERPROFILE%\.omp\agent\config.yml) — §2의 키 병합
#    (computer.enabled: true 포함)

# 4. 커스텀 테마 (%USERPROFILE%\.omp\agent\themes\titanium-custom.json) — §3 절차

# 4-1. 전역 규칙 (%USERPROFILE%\.omp\agent\RULES.md) — §7 내용 저장

# 5. 플러그인
omp plugin install github:pawprint0706/omp-opencode-go-usage
omp plugin install github:pawprint0706/omp-openrouter-credits

# 6. 검증
omp plugin list
omp config get statusLine.leftSegments
omp config get theme.dark
omp config get spelling.autocomplete
omp config get computer.enabled       # true  (browser는 기본 on)
omp gallery --segment status --plain --width 200
omp gallery --segment cache_hit --plain --width 200
omp ps                                # omp.browser.headless
omp        # 하단 상태줄: 한 줄 + 🎯, Eval에서 프렐류드 스모크 테스트(§4)
```

백업해 둘 것: `~/.omp/agent/config.yml`, `~/.omp/agent/themes/`, `~/.omp/agent/RULES.md`, `~/.omp/plugins/package.json` + `omp-plugins.lock.json`, 그리고 자격증명(`omp auth export`). `~/.omp/agent/*.db`, `sessions/`, `logs/`는 재설치와 무관한 런타임 데이터다.

---

## 7. 전역 규칙 `~/.omp/agent/RULES.md`

`RULES.md`는 **항상 적용되는 sticky 규칙**이다(일반 컨텍스트 파일이 아니다). 본문 전체가 매 요청에 실려 대화가 길어져도 빠지지 않는다.

| 항목 | 값 |
|---|---|
| 위치 | `~/.omp/agent/RULES.md` (사용자 단위) |
| 적용 | 항상(sticky). frontmatter로 해제할 수 없다 |
| 리로드 | 세션 시작·`/clear`·`/new` 때 디스크에서 재독 — 재시작 불필요 |
| 길이 | 짧게 유지. 긴 배경은 `AGENTS.md`(컨텍스트 파일)에 둔다 |

이 PC의 내용(그대로 저장):

```markdown
# 전역 지침

- 답변 언어는 사용자 메시지의 언어를 그대로 따른다. 사용자가 쓰지 않은 언어로 답하지 않는다. 선택된 모델·역할과 무관하게 적용한다.
  - 한국어 메시지 → 한국어로 답변.
  - 한국어가 아닌 메시지(영어·일본어·중국어 등) → 그 메시지의 언어로 답변한다. 예: `Describe a hash table.`에는 영어로, `ハッシュテーブルとは？`에는 일본어로 답변한다.
- 메시지에 언어 단서가 전혀 없거나(코드·명령만 제출, 도구 출력만 있는 턴 등) 여러 언어가 섞여 있으면 한국어를 기본값으로 쓴다.
- 코드, 식별자, 파일 경로, 명령어, 인용한 도구 출력은 번역하지 않고 원문 그대로 둔다.
```

검증: 규칙이 실려 있는지 보려면 아무 세션에서나 첫 요청의 시스템 프롬프트에 본문이 포함돼야 하고, `RULES.md`를 비우면(또는 삭제하면) 다음 `/new`부터 사라진다.

---

## 8. macOS 적용 기록 (2026-10-17)

- Apple Silicon macOS의 **omp 18.11.2**에서 §2 설정, 플러그인 2종, §7 전역 규칙을 적용했다. 기존 모델·인증·설치 설정은 유지했다.
- 이미 omp가 설치되어 있으면 재설치는 필요 없다. 신규 설치는 공식 macOS 셸 설치 스크립트 `https://omp.sh/install.sh`를 검토한 뒤 실행한다. PowerShell 명령과 Windows 네이티브 애드온 경로는 사용하지 않는다.
- 설정 경로는 동일하게 `~/.omp/agent/config.yml`, `~/.omp/agent/themes/titanium-custom.json`, `~/.omp/agent/RULES.md`다. 테마는 설치 버전과 일치하는 `v18.11.2`의 titanium JSON을 복사하고 §3의 이름·아이콘 변경만 적용했다.
- `omp plugin list`에서 두 플러그인의 활성 상태를 확인했다. 실제 TUI 하단 한 줄에서 OpenCode Go 사용률과 `OR $4.87`이 ` · `로 연결됨을 확인했다(잔액·사용률은 조회 시점 값).
- `omp gallery --segment cache_hit --plain --width 200`에서 `🎯 77.92%`, `status` 갤러리에서 `Indexer ready · Tests passing`을 확인했다. 새 TUI에서 캐시 읽기가 없으면 🎯가 숨겨지는 동작은 동일하다.
- Eval의 `browser.open` → 제목·페이지 관찰 → `close`가 정상 동작했다. 관리형 Chrome for Testing의 macOS ARM 바이너리가 준비됐고 `omp ps`에서 `omp.browser.headless`가 `ready`였다.
- 데스크톱 제어 권한: **시스템 설정 → 개인정보 보호 및 보안 → 기기 제어 및 데이터 접근**에서 omp를 실행하는 터미널 앱의 권한을 활성화하고, **터미널을 종료한 뒤 다시 실행한다**. 이 macOS 환경에서 실제 확인한 메뉴명이며, 기존 안내의 `손쉬운 사용`을 대신한다.
- 권한 적용 후 Eval에서 `await computer.capabilities()`로 확인한다. 이 환경에서는 터미널 재시작 후 `backend: quartz`, `capturePermission: granted`, `inputPermission: granted`, `axPermission: granted`와 `capture: true`, `input: true`, `ax: true`를 확인했다. 백그라운드 창 입력과 메뉴 제어도 지원 활성 상태다.
- 실제 컴퓨터 제어 검증: 계산기 창의 화면 캡처·접근성 트리 읽기에 성공했고, 접근성 버튼으로 `123 + 456 = 579`, 네이티브 키보드 입력으로 `7 × 8 = 56`을 계산해 화면·접근성 값으로 확인했다. macOS에서 `press('*')`는 키코드로 지원되지 않으므로 `press('shift+8')`을 사용했다.
- 실제 브라우저 제어 검증: 관리형 Chromium에서 `example.com` 제목·페이지를 읽고, 독립 테스트 페이지에 `맥OS 브라우저 제어 정상`을 입력한 뒤 확인 버튼을 클릭해 `확인: 맥OS 브라우저 제어 정상` 표시와 화면 캡처를 확인했다. 테스트 탭은 닫았으며 기존 문서·로그인된 브라우저 탭은 변경하지 않았다.
- 테마·상태줄과 새 플러그인을 현재 대화에도 확실히 반영하려면 omp를 종료 후 다시 실행한다. 전역 규칙은 새 세션 또는 `/new`·`/clear`에서 다시 읽는다.

