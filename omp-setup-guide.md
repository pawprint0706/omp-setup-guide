# omp 셋업 가이드 (Windows)

이 PC의 omp 상태를 재설치 후 그대로 복구하기 위한 기록.
기준: **omp 18.11.0**, Windows 10 x64, Git Bash, 프로바이더 `opencode-go` + `openrouter`, 상태줄 플러그인 2종 + 커스텀 테마 1개, 전역 규칙 `RULES.md`, 입력 단어 자동완성 off.
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

### 6) 검증

```powershell
omp config get statusLine.preset          # custom
omp config get statusLine.leftSegments    # [..."context_pct","cache_hit","cost","status"]
omp config get statusLine.showHookStatus  # false
omp config get theme.dark                 # titanium-custom
omp config get spelling.autocomplete      # off
omp plugin list                           # ● 2개

omp gallery --segment status --plain --width 200      # 훅 상태가 ' · '로 이어진 형태
omp gallery --segment cache_hit --plain --width 200   # 🎯 77.92%  ← 아이콘 오버라이드 확인
omp                                                   # 실제 TUI: 하단이 한 줄 + 🎯 표시
```

`omp gallery`는 자격증명 없이 세그먼트 렌더만 결정적으로 확인하는 도구다(`status`는 `Indexer ready · Tests passing`처럼 이어 붙여, `cache_hit`은 현재 테마의 아이콘으로 그린다).

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

## 4. 왜 이 설정이 필요한가 (증상 재발 시 진단)

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

## 5. 재설치 체크리스트 (복붙용)

```powershell
# 1. 바이너리
irm https://omp.sh/install.ps1 | iex

# 2. 자격증명 (이전 PC에서 export 후 import, 아니면 login)
omp auth import credentials.json
#   omp login opencode-go ; omp login openrouter

# 3. 설정 파일 (%USERPROFILE%\.omp\agent\config.yml) — §2의 키 병합

# 4. 커스텀 테마 (%USERPROFILE%\.omp\agent\themes\titanium-custom.json) — §3 절차

# 4-1. 전역 규칙 (%USERPROFILE%\.omp\agent\RULES.md) — §6 내용 저장

# 5. 플러그인
omp plugin install github:pawprint0706/omp-opencode-go-usage
omp plugin install github:pawprint0706/omp-openrouter-credits

# 6. 검증
omp plugin list
omp config get statusLine.leftSegments
omp config get theme.dark
omp config get spelling.autocomplete
omp gallery --segment status --plain --width 200
omp gallery --segment cache_hit --plain --width 200
omp        # 하단 상태줄: 한 줄 + 🎯
```

백업해 둘 것: `~/.omp/agent/config.yml`, `~/.omp/agent/themes/`, `~/.omp/agent/RULES.md`, `~/.omp/plugins/package.json` + `omp-plugins.lock.json`, 그리고 자격증명(`omp auth export`). `~/.omp/agent/*.db`, `sessions/`, `logs/`는 재설치와 무관한 런타임 데이터다.

---

## 6. 전역 규칙 `~/.omp/agent/RULES.md`

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
