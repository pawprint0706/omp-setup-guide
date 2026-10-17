# omp 셋업 가이드 (Windows · macOS)

기본 프로필의 설정을 재설치 후 복구하기 위한 가이드. §1–7은 공통 설정과 OS별 절차, §8은 macOS, §9는 Windows 적용·검증 기록이다. §10은 Codex 사용량 추가와 OpenCode 접두어 적용 기록이다.

- **현재 복구 구성:** 한 줄 상태줄, 🎯 캐시 아이콘, effort 문자열 표시, 모델 아이콘 제거, **플러그인 3종(Codex·OpenCode Go 사용률, OpenRouter 잔액)**, 전역 규칙, Eval 프렐류드, 입력 단어 자동완성 off. 기존 공통 설정은 Windows 10 x64·macOS Apple Silicon의 omp 18.11.2에서 검증했고, 3종 상태줄은 **macOS omp 18.11.3**에서 확인했다(§10).
- **Windows 재검증:** Windows 10 x64, Git Bash, omp **18.11.2**에서 당시 2종 플러그인 구성을 적용했다. 기존 모델 `openai-codex/gpt-6-astra:high`와 인증을 유지하고 effort·모델 아이콘·상태줄·브라우저·데스크톱 동작을 확인했다(§9). 18.11.1 검증은 §4의 과거 기록이며, §10의 Codex 추가·OC 접두어 변경은 Windows에서 별도로 재검증하지 않았다.
- 모델·프로바이더·인증은 기존 값을 유지한다. 아래 DeepSeek 모델명과 사용량·잔액은 표시 예시이며 고정 설정값이 아니다.

작성: 2026-10-15, 갱신: 2026-10-17.

## 0. 목표 상태

하단 상태줄이 **한 줄**이고, 모델 아이콘 없이 모델명 뒤에 effort 단어가 표시된다. 캐시 히트율은 🎯, 플러그인 값은 ` · `로 이어져 끝에 붙는다. 최종 설정의 표시 예시:

```
π · DeepSeek V4.1 Flash · high · 📁 omp-setup-guide · ◫ 0.9%/1M ⟲ · 🎯 49.17% · $0.00 · CO 5h 22% | Wk 19% · OC 5h 2% | Wk 0% | Mo 0% · OR $4.89
```

| 조각 | 출처 |
|---|---|
| `◫ 0.9%/1M ⟲` | 내장 `context_pct` 세그먼트 |
| `🎯 49.17%` | 내장 `cache_hit` 세그먼트 + 커스텀 테마의 아이콘 오버라이드 (§3) |
| `CO 5h 22% \| Wk 19%` | 플러그인 `omp-codex-usage` — Codex 구독 사용률 |
| `OC 5h 2% \| Wk 0% \| Mo 0%` | 플러그인 `omp-opencode-go-usage` — OpenCode Go 사용률 |
| `OR $4.89` | 플러그인 `omp-openrouter-credits` |

`CO`·`OC`는 **사용한 비율**(남은 비율 아님), `OR`는 계정 잔액이다. 그룹 내부는 ` | `, 플러그인 그룹 사이는 ` · `로 구분한다. Codex는 기본 플랜의 실제 기간만 표시하므로 주간 전용 플랜에서는 `CO Wk …%`만 보이며 월간 한도를 만들어 표시하지 않는다. 인증이 없거나 최초 조회에 실패한 그룹은 숨겨질 수 있다.

---

## 1. 설치 순서

### 1) omp 바이너리

설치되어 있으면 먼저 `omp --version`을 확인한다. 아래 설치기는 최신 배포본을 설치하므로 특정 버전을 보장하지 않는다.

**Windows — PowerShell**

```powershell
irm https://omp.sh/install.ps1 | iex        # 설치 위치: %LOCALAPPDATA%\omp\omp.exe
omp --version                               # 실제 설치 버전 확인
```

**macOS — 터미널의 zsh/bash**

```sh
curl -fsSL https://omp.sh/install.sh -o /tmp/omp-install.sh
less /tmp/omp-install.sh        # 설치 스크립트를 검토한 뒤 종료(q)
bash /tmp/omp-install.sh
omp --version
```

macOS 신규 설치 명령은 이 환경에서 재실행하지 않았다. 기존 설치본 18.11.2로 설정·렌더링·제어 동작을 검증했다.

- 설치 스크립트는 `https://raw.githubusercontent.com/can1357/oh-my-pi/main/scripts/install.sh|.ps1`로 302되고, 바이너리는 `PI_BUILD_URL`(기본 `https://build.stencil.so`)에서 sha256 검증 후 받는다.
- 업데이트는 `omp update` (`--canary` / `--stable`).
- **사용자 데이터는 `~/.omp`**이며 바이너리 재설치로는 사라지지 않는다. `~/.omp`를 지우면 설정·테마·자격증명·플러그인이 전부 사라진다.

### 2) 자격증명

```powershell
omp login openai-codex  # Codex 구독 OAuth — 이미 로그인되어 있으면 생략
omp login opencode-go
omp login openrouter
```

Codex 플러그인은 기존 `openai-codex` OAuth를 사용하며 별도의 키·토큰 저장소를 만들지 않는다. `OPENAI_API_KEY`는 Codex 구독 인증의 대체재가 아니다. 여러 계정이 있으면 전체 합계가 아니라 omp가 해당 세션에 선택한 계정의 사용률이다. 현재 모델을 Codex로 바꾸지 않아도 해당 인증이 있으면 조회할 수 있다.

또는 TUI에서 `/login <provider>`. 기존 PC에서 옮길 때는 **기존 PC에서 export**, **새 PC에서 import**한다. 다음 중 해당 OS의 내보내기 명령 하나만 사용한다.

```sh
# macOS / Git Bash — 개인 디렉터리에서 실행
(umask 077; omp auth export > credentials.json)
```

```powershell
# Windows PowerShell — UTF-16LE 리다이렉션을 피하고 UTF-8(BOM 없음)으로 저장
# 이 변환 예제는 macOS 검수에서 실행하지 않았다.
$credentials = omp auth export
if ($LASTEXITCODE -ne 0) { throw "omp auth export 실패" }
$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $PWD.Path "credentials.json"), ($credentials -join "`n"), $utf8)
Remove-Variable credentials
```

새 PC에서:

```sh
omp auth import credentials.json
```

> `credentials.json`에는 평문 API 키·OAuth 토큰이 들어 있다. 저장소 밖의 개인 디렉터리에서 다루고, 커밋·채팅 첨부 금지, 백업은 암호화된 곳에 보관한다. 이전 완료 후 임시 파일은 안전하게 정리한다. OAuth 토큰은 갱신 시 회전할 수 있어 복사한 두 PC가 같은 로그인을 공유하면 한쪽이 로그아웃될 수 있다. 여러 PC를 계속 사용할 경우 각 PC에서 별도로 로그인하는 편이 안전하다.

### 3) `~/.omp/agent/config.yml`

§2의 키만 병합한다. 이 가이드는 **기본 프로필**의 `~/.omp/agent/config.yml`을 기준으로 한다. 이름 있는 프로필은 `~/.omp/profiles/<profile>/agent/config.yml`을 사용하므로 해당 프로필에 적용하고, 실행·검증도 같은 프로필에서 한다. 특정 PC에 프로필 디렉터리가 없었다는 사실은 프로필 기능이 없다는 뜻이 아니다. 나머지 모델·머신별 설정은 기존 값을 유지한다.

### 4) 커스텀 테마 `~/.omp/agent/themes/titanium-custom.json`

🎯 캐시 아이콘·effort 문자열·모델 아이콘 제거용. §3에서 OS에 맞게 내장 테마를 복사하고 **전체 오버라이드 블록**을 병합한다. 이미 맞춰둔 PC가 있으면 완성된 테마 파일을 복사해도 된다.

### 5) 플러그인 3종

```powershell
omp plugin install github:pawprint0706/omp-codex-usage
omp plugin install github:pawprint0706/omp-opencode-go-usage
omp plugin install github:pawprint0706/omp-openrouter-credits
omp plugin list                      # ● 로 enabled 3개 확인
```

- 로컬 클론이 있으면 `omp plugin install <경로>`로 연결할 수 있다(junction/symlink). 같은 플러그인을 수동 extension 복사와 플러그인 설치로 중복 로드하지 않는다. 로컬 연결은 원본 프로젝트의 변경을 반영하므로 새 omp 세션에서 확인한다.
- 플러그인이 배포하는 `statusline.yml`은 **참고용이며 자동 병합되지 않는다**. 현재 §2의 `preset: custom`, `leftSegments` 끝의 `status`, `showHookStatus: false`면 3종 모두 같은 하단 행에 표시된다. `CO`·`OC`·`OR`는 플러그인 문자열의 접두어이지 `leftSegments`에 추가할 별도 세그먼트가 아니다. 플러그인 예제 목록으로 기존 테마·`cache_hit`·`segmentOptions`를 덮어쓰지 않는다.
- Windows 과거 설치 커밋(참고): `omp-opencode-go-usage#fda9a4e`, `omp-openrouter-credits#a302954`. 재설치는 브랜치 최신을 받으므로 이 커밋과 같다고 보장하지 않는다.
- 플러그인 자체 설명서: `~/.omp/plugins/node_modules/<name>/README.md`.
- OpenCode의 `OC` 접두어는 테마 설정이 아니라 플러그인 코드 변경이다. 예전 GitHub 설치본이면 `omp plugin upgrade omp-opencode-go-usage`로 갱신하고, 로컬 연결이면 원본 프로젝트의 해당 변경을 반영한다. 버전이 동일한 `1.0.0`이어도 코드가 다를 수 있으므로 버전 문자열만으로 접두어 적용을 판단하지 않는다.
- **18.11.3의 갱신 주의:** `omp plugin upgrade omp-opencode-go-usage --dry-run`이 실제로 설치본을 갱신하고 로컬 링크를 GitHub 설치본으로 교체하는 동작을 관찰했다. 이 명령의 `--dry-run`을 무변경 검사로 사용하지 않는다. 로컬 연결은 원본 프로젝트를 관리하고, 링크가 바뀌면 `omp plugin install <원래 로컬 경로>`로 다시 연결한다.
- 설치·갱신 후 omp를 다시 실행해 실제 상태줄을 확인한다. Codex·OpenCode는 시작 시, 턴 종료 시, 90초 주기로 조회한다. 기존 로그인·모델·승인 정책은 유지한다.
- 플러그인 설명서: [Codex](https://github.com/pawprint0706/omp-codex-usage), [OpenCode Go](https://github.com/pawprint0706/omp-opencode-go-usage), [OpenRouter](https://github.com/pawprint0706/omp-openrouter-credits).

### 6) Eval 프렐류드 (computer-use / browser-use)

데스크톱 백엔드는 플랫폼별 네이티브 애드온으로 제공되고, 관리형 Chromium은 필요 시 첫 사용 때 준비된다. Windows 애드온 경로 예시는 `~/.omp/natives/<version>/pi_natives.win32-x64-baseline.node`이며 macOS에 이 파일을 복사하지 않는다. `computer.enabled`는 프렐류드 스위치일 뿐, OS 권한이나 사용자 동의를 대신하지 않는다(§4).

- `browser`는 기본 on(`browser.enabled: true`)이라 아무것도 하지 않는다.
- `computer`는 기본 off이므로 §2의 `computer.enabled: true`를 넣는다(§4).
- 설정 파일은 omp가 감시하므로 재시작 없이 다음 Eval 호출부터 반영된다. 세션 한정으로만 쓰려면 `/computer on`.

### 7) 검증

아래 omp 명령은 Windows·macOS 공통이다. 기본 프로필이 아니라면 해당 프로필을 선택한 환경에서 실행한다.

```powershell
omp config get statusLine.preset          # custom
omp config get statusLine.leftSegments    # [..."context_pct","cache_hit","cost","status"]
omp config get statusLine.showHookStatus  # false
omp config get statusLine.compactThinkingLevel # false
omp config get theme.dark                 # titanium-custom
omp config get spelling.autocomplete      # off
omp config get computer.enabled           # true
omp config get browser.enabled            # true
omp plugin list                           # ● 3개

omp gallery --segment status --plain --width 200      # 훅 상태가 ' · '로 이어진 형태
omp gallery --segment cache_hit --plain --width 200   # 🎯 77.92%  ← 아이콘 오버라이드 확인
omp gallery --segment model --plain --width 200       # Sonnet 4.5 · high (⬢ 없음)
omp                                                   # 실제 TUI 확인 후 §4 Eval 스모크 실행
```

`omp gallery`는 자격증명 없이 세그먼트 렌더만 결정적으로 확인하는 도구다(`status`는 `Indexer ready · Tests passing`처럼 이어 붙여, `cache_hit`은 현재 테마의 아이콘으로 그린다). 두 프렐류드가 실제로 동작하는지는 Eval에서 확인한다 — §4.

사용량 플러그인 검증은 실제 TUI에서 `CO`·`OC`·`OR`를 확인한다. `status` 갤러리는 샘플 훅 문자열을 렌더링할 뿐, 세 플러그인의 인증이나 API 조회 성공을 증명하지 않는다.

`omp ps`는 §4의 `browser.open()` 이후에 확인한다. 첫 사용 전에는 브라우저 데몬이 없어도 정상이다. 🎯는 실제 캐시 읽기가 있을 때만 표시되므로 첫 TUI 화면에 없다고 실패로 판단하지 않는다.

---

## 2. `~/.omp/agent/config.yml` — 이 가이드가 관리하는 키만

아래 키만 넣는다(파일이 없으면 생성, 있으면 해당 키만 병합). `shellPath`, `modelRoles`, `symbolPreset`, `setupVersion` 같은 값은 머신·모델·설치 시점에 따라 달라지므로 여기서 고정하지 않는다 — 셋업 마법사와 `/models`가 채운 값을 그대로 둔다.

```yaml
# 1) 커스텀 테마 (§3의 전체 심볼 오버라이드)
theme:
  dark: titanium-custom

# 2) 입력창 모양
composer:
  shape: claude

# 3) 상태줄
statusLine:
  preset: custom
  # effort 레벨을 모델명 아이콘으로 접지 않고 ` · <레벨>` 문자열로 남긴다 (§3-5)
  compactThinkingLevel: false
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
  autocomplete: "off"

# 5) 데스크톱 제어 — computer Eval 프렐류드 (기본 false, §4)
#    browser 프렐류드는 기본 true라 키를 두지 않는다.
computer:
  enabled: true
```

- 다음 표는 **Windows 18.11.0 기록의 내장 `default` 프리셋**이다. 현재 공통 복구 설정은 §2 YAML 블록이며, 내장 프리셋의 최신 기본값이라고 가정하지 않는다:

  | 항목 | 값 |
  |---|---|
  | 기본 `leftSegments` | `pi, vim, model, mode, collab, stream, path, git, pr, context_pct, cost` |
  | 기본 `rightSegments` | `session_name` |
  | 기본 `segmentOptions` | `model.showThinkingLevel`, `path.abbreviate/maxLength=40/stripWorkPrefix`, `git.show*` 4종 |

- `preset: custom`은 `segmentOptions`가 **빈 맵에서 시작**한다. 위 블록을 생략하면 경로 축약·깃 플래그·thinking 아이콘이 사라진다.
- `composer.shape: claude`는 배치를 정한다: `rightSegments`는 입력창 **위** 꼬리줄, `leftSegments`는 **하단 행**에 그려진다. 그래서 캐시 히트율·플러그인 값이 하단 한 줄에 모인다(`rightSegments`로 옮기면 입력창 위로 올라간다). 기본값은 `band`.
- `statusLine.compactThinkingLevel: false`는 effort 레벨을 **모델명 아이콘으로 접지 않고** ` · <레벨>` 문자열로 남긴다. 기본값 `true`에서는 레벨 표시가 모델명 앞 아이콘 하나(`◒ DeepSeek…`)로 접히고 문자열은 사라진다. 레벨 문자열 자체는 심볼 값(`thinking.*`)이라 기호를 떼려면 §3-5의 오버라이드가 함께 필요하다.
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

## 3. 커스텀 테마 — 캐시·모델 아이콘과 effort 표기

### `cache_hit` 세그먼트

- `leftSegments`(또는 `rightSegments`)에 `cache_hit`을 넣으면 표시된다. `composer.shape: claude`에서는 `leftSegments`가 하단 행이므로 여기에 둔다.
- 값 = `cacheRead / (cacheRead + cacheWrite + input) × 100`, 소수 2자리.
- **`cacheRead`가 0이면 세그먼트 자체가 숨겨진다.** 캐시 읽기가 발생한 요청 이후 표시된다. 두 번째 요청에서도 캐시 읽기가 없으면 계속 숨겨지며, 특정 요청 횟수부터 표시된다고 보장하지 않는다.
- 아이콘은 심볼 프리셋의 `icon.cache`를 쓴다. `cache_read`, `cache_write` 세그먼트도 같은 `icon.cache`를 공유한다.

| 프리셋 | `icon.cache` 기본값 |
|---|---|
| `unicode` (기본값) | 💾 |
| `nerd` | `U+F1C0` (Nerd Font 필요) |
| `ascii` | `cache` |

### 커스텀 테마 만들기 (§3-1–4)

omp는 세그먼트 아이콘을 **테마의 `symbols.overrides`**로만 덮어쓸 수 있다(설정에는 아이콘 항목이 없다). 커스텀 테마는 `colors` 필수 토큰을 전부 요구하고 테마에 extends/overlay가 없으므로, **내장 테마를 통째로 복사한 뒤 `symbols`만 추가**한다.

**3-1. 설치 버전에 맞는 내장 테마 복사**

`omp --version`이 `omp/18.11.2`이면 태그는 `v18.11.2`다. 다른 버전을 설치했다면 아래 예제의 버전을 실제 출력에 맞춰 바꾼다. 해당 태그의 파일이 없거나 다운로드가 실패하면 임의 버전으로 대체하지 말고 먼저 배포 태그를 확인한다.

Windows PowerShell:

```powershell
$version = "18.11.2"   # omp --version 출력에 맞춘다
$themeDir = "$env:USERPROFILE\.omp\agent\themes"
New-Item -ItemType Directory -Force -Path $themeDir | Out-Null
curl.exe -fL -o "$themeDir\titanium-custom.json" `
  "https://raw.githubusercontent.com/can1357/oh-my-pi/v$version/packages/tui/src/theme/defaults/titanium.json"
if ($LASTEXITCODE -ne 0) { throw "테마 다운로드 실패" }
```

macOS zsh/bash:

```sh
version="18.11.2"       # omp --version 출력에 맞춘다
theme_dir="$HOME/.omp/agent/themes"
mkdir -p "$theme_dir"
curl -fL -o "$theme_dir/titanium-custom.json" \
  "https://raw.githubusercontent.com/can1357/oh-my-pi/v$version/packages/tui/src/theme/defaults/titanium.json"
```

> 두 다운로드 명령 모두 기존 `titanium-custom.json`을 덮어쓴다. 이미 사용자 변경이 있으면 먼저 백업한다. Windows PowerShell 5.1에서는 네이티브 출력에 `>`를 쓰면 UTF-16LE로 저장될 수 있으므로 테마는 `curl.exe -o`로 저장한다. 아래 편집도 UTF-8로 저장한다.

```diff
# 3-2. 이름 변경 (파일명과 JSON name을 맞춘다)
-  "name": "titanium",
+  "name": "titanium-custom",
```

**3-3. 전체 심볼 오버라이드 병합**

아래 JSON의 `symbols` 속성을 다운로드한 테마의 **최상위 객체에 병합**한다. 테마 파일 전체를 이 블록으로 교체하면 필수 `colors` 등이 사라지므로 안 된다. 기존 `symbols`가 있으면 해당 객체를 갱신하고, 중복 키를 만들지 않는다.

```json
{
  "symbols": {
    "overrides": {
      "icon.cache": "🎯",
      "icon.model": "",
      "thinking.minimal": "minimal",
      "thinking.low": "low",
      "thinking.medium": "medium",
      "thinking.high": "high",
      "thinking.xhigh": "xhigh",
      "thinking.max": "max"
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
- 복사본은 **스냅샷**이다. omp 업데이트로 내장 테마가 바뀌면 설치 버전에 맞는 파일을 다시 복사한 뒤 이름 변경과 위 전체 `symbols` 블록을 재적용한다. Windows 과거 기록은 v18.11.0, macOS 검증은 v18.11.2의 titanium을 사용했다. Windows 재검증에서는 기존 테마의 기본 속성이 v18.11.2와 동일함을 확인해 덮어쓰지 않고 전체 심볼 오버라이드만 병합했다(§9).
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

- 모델명 앞 아이콘은 `icon.model`(unicode `⬢`, nerd `\uec19`, ascii `[M]`)이다. 이 PC는 `""`로 두어 상태줄이 `π · DeepSeek V4.1 Flash · high`로 시작한다(검증: `omp gallery --segment model --plain` → `Sonnet 4.5 · high`). 빈 값일 때 공백은 남지 않는다. 같은 심볼을 쓰는 표면도 함께 비워진다: model-hub(`/models`) 행, agents-hub, 모델 멘션 자동완성 드롭다운(`model-mention-autocomplete`), composer의 모델 첨부 칩(`composer-attachments`), `/setup` 테마 미리보기.
- `compactThinkingLevel: true`에서는 이 자리가 thinking 글리프로 대체된다 — 그 조합에서는 `icon.model` 값이 상태줄에 쓰이지 않는다.

### effort 레벨을 문자열로 (§3-5)

- 레벨 표시 문자열은 심볼 값이다(키 네임스페이스 `thinking.*`). unicode 프리셋 기본값은 **글리프가 문자열에 붙은 형태**다: `thinking.minimal`=`○ min`, `thinking.low`=`◔ low`, `thinking.medium`=`◑ med`, `thinking.high`=`◒ high`, `thinking.xhigh`=`◕ xhigh`, `thinking.max`=`◉ max`, `thinking.autoPending`=`⟳`(auto 미해결 시 `⟳ auto`). nerd/ascii 프리셋도 같은 구조(`[med]` 등)다.
- 그래서 "기호 대신 문자열"은 설정 키 하나로는 안 되고 두 조각이 필요하다:

  | 조각 | 값 | 역할 |
  |---|---|---|
  | `statusLine.compactThinkingLevel` (§2) | `false` | 레벨 표시를 모델명 아이콘으로 접지 않고 ` · <문자열>` 꼬리로 유지 |
  | `symbols.overrides` `thinking.*` | `"medium"`, `"high"`, `"xhigh"` … | 문자열에서 글리프를 떼고 단어만 남김 |

- §3-3의 전체 블록은 `minimal`/`low`/`medium`/`high`/`xhigh`/`max`를 모두 단어로 바꾼다. 표시 가능한 effort 목록은 모델에 따라 다르다.
- **`auto` 미해결 상태의 `⟳`는 유지한다.** omp 18.11.2는 `${theme.thinking.autoPending} auto`로 렌더링하므로 테마 값을 `""`로 비우면 글리프는 사라지지만 `·  auto`처럼 고정 공백이 남는다. 현재 설정·테마만으로 글리프와 이 공백을 함께 없애는 방법은 확인되지 않아 원복했다. 코드 수정까지 불가능하다는 뜻은 아니다. auto가 레벨로 해결되면 해당 레벨 단어가 표시된다.
- **`off`의 `⦸`는 다른 화면의 표식을 보존하기 위해 유지한다.** off 전용 심볼이 없고 `${theme.status.disabled} off`를 사용한다. `status.disabled`를 비우면 글리프를 제거할 수 있지만 agents-hub·확장 관리·model-browser·plugin-settings의 비활성 표식까지 사라지고 앞 공백도 남는다. 현재 테마 설정으로 상태줄의 off만 독립적으로 제거할 수 없으므로 공유 심볼은 변경하지 않았다.
- 최종 테마의 갤러리 검증: `omp gallery --segment model --plain` → `Sonnet 4.5 · high`(모델 아이콘·effort 글리프 없음). 실제 TUI에서도 `DeepSeek V4.1 Flash · high`, `max` 등의 단어 표시를 확인했다.
- DeepSeek를 선택한 최종 설정에서 off·미해결 auto의 모델 세그먼트는 각각 `DeepSeek V4.1 Flash · ⦸ off`, `DeepSeek V4.1 Flash · ⟳ auto` 형태다. 이전 모델 아이콘 제거 전 출력과 혼동하지 않는다.
- 오버라이드는 테마 전역이다. 소스에서 확인한 사용처는 모델 세그먼트 render 경로와 에이전트 허브 행이며, 푸터의 auto 미해결 표기는 `thinking.autoPending`을 사용한다(이 가이드는 변경하지 않음). 단어를 별도 계산하는 `thinkingLevelWord()` 경로는 심볼과 무관하다.

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

### 권한·승인·사용자 동의는 별개

1. **OS 권한:** 캡처·입력·접근성이 가능한지는 `computer.capabilities()`의 `capturePermission`/`inputPermission`/`axPermission`으로 확인한다. 이 macOS 환경에서 확인한 메뉴는 **시스템 설정 → 개인정보 보호 및 보안 → 기기 제어 및 데이터 접근**이다. 터미널 앱 권한을 허용한 뒤 터미널을 재시작했다(§8). 메뉴명은 macOS 버전에 따라 다를 수 있으며, `computer.enabled: true`나 도구 승인 정책으로 OS 권한을 대신 부여할 수 없다.
2. **omp 도구 실행 승인:** 조회·스크린샷은 read 티어, 입력·변경은 exec 티어다. `tools.approvalMode` 등은 이 도구 호출의 승인 정책이다. `yolo`도 모든 종류의 동의나 권한을 없앤다는 뜻은 아니며, 이 가이드는 승인 정책을 변경하지 않는다.
3. **작업 단위 제어와 중요한 동작의 동의:** `computer.control.acquire({reason})`로 전경 제어를 획득하려면 별도 실시간 사용자 확인이 필요하다. 획득했다면 작업 종료 시 `finally`에서 `computer.control.release()`로 해제한다. 제어 권한을 얻었더라도 전송·구매·삭제·권한 변경 등은 대상·범위에 대한 별도 승인이 필요하며, 일반적인 “제어 테스트” 요청이 이를 허용하지 않는다.

### Windows 과거 동작 기록 (18.11.1)

- 백엔드 `win32`는 과거 검증 환경에서 캡처·입력·UIA를 네이티브로 지원했고, `capturePermission`/`inputPermission`/`axPermission`이 모두 `granted`였다. 이는 그 환경의 OS 권한 보고값이며, 모든 Windows 환경이나 모든 동작에 사용자 승인이 불필요하다는 의미가 아니다.
- 스크린샷 저장: `computer`는 `%TEMP%\omp-computer-*.png`, `browser`는 `browser.screenshotDir`(미설정 시 `%TEMP%\omp-sshots-*.webp`).
- Windows 과거 검증에서는 관리형 headless 브라우저가 프로젝트 단위 공유 데몬 `omp.browser.headless`로 떴고, 설치돼 있던 `C:\Program Files\Google\Chrome\Application\chrome.exe`를 재사용했다(전용 프로필: `~/.omp/run/daemons/<hash>/omp.browser.headless.profile`). 필요한 브라우저가 없으면 첫 사용 시 준비된다.
- 이미 로그인된 자기 Chrome 탭을 그대로 몰려면 relay: `omp browser-relay install`(확장을 `~/.omp/browser-relay/extension`에 풀고 로드 절차를 출력) → 확장 로드 → `browser.relay: true`.

### 공통 검증 순서

먼저 CLI에서 프렐류드 설정을 확인한다:

```sh
omp config get computer.enabled   # true
omp config get browser.enabled    # true
omp config get eval.js            # true
```

설정 파일의 프렐류드 스위치는 다음 Eval 호출부터 반영된다. 다음 코드는 **셸이 아니라 omp의 JavaScript Eval**에서 실행한다. 권한 조회는 실제 입력 동작 검증과 별개다.

```js
display(await computer.capabilities());
const tab = await browser.open({ url: "https://example.com" });
try {
  display(await tab.title());     // Example Domain
  display(await tab.observe());
} finally {
  await tab.close();              // 이 테스트에서 연 탭만 닫는다
}
```

**브라우저를 연 뒤에만** 같은 프로젝트 디렉터리의 CLI에서 데몬을 확인한다:

```sh
omp ps
```

관리형 headless Chromium을 사용했다면 `omp.browser.headless`가 `ready`인 것이 확인 예시다. 첫 사용 전에는 없어도 정상이다. Tern/cmux 네이티브 뷰·외부 CDP·relay 등 다른 백엔드에서는 같은 데몬 이름이 나온다고 가정하지 않는다. 브라우저 동작 여부는 탭 열기·제목·페이지 관찰 결과로 판단한다.

### Windows 과거 실측 결과

Windows 18.11.1 기록: capabilities가 `win32` + `capture`/`input`/`ax` 전부 `true`, `displayCount: 1`이었다. 창 열거·캡처·AX 읽기, 메모장 AX `setValue`, 입력·클립보드 왕복을 확인했다. 브라우저 `open`/`observe`/`evaluate`/`screenshot`/`tabs`/`close`도 확인했다. 당시 창 캡처는 1419×752였으며, 이 결과를 다른 OS·모델 transport의 해상도나 권한 보장으로 해석하지 않는다. macOS의 별도 실측은 §8에 기록한다.

최신 **Windows 18.11.2 재검증은 §9**에 기록한다. 이번에는 계산기의 AX 버튼 조작과 브라우저 입력·클릭을 검증했으며, 위 18.11.1의 키보드·포인터·클립보드 결과를 새 버전의 재검증 결과로 재사용하지 않는다.

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

세 플러그인은 `ctx.ui.setStatus(key, text)`로 훅 상태를 게시한다: Codex는 `openai-codex` 키와 `CO` 접두어, OpenCode Go는 `opencode-go` 키와 `OC` 접두어, OpenRouter는 `openrouter` 키와 `OR` 접두어를 사용한다. omp는 이를 어디에 그릴지를 설정으로 결정한다:

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
| 값 끝에 `?` | 플러그인 갱신 실패. 마지막 확인 값이므로 최신 사용량으로 보장되지 않음 | 로그에서 `codex-usage:`, `opencode-go-usage:`, `openrouter-credits:` 확인 |
| `🎯`가 안 보임 | 세그먼트 집계의 `cacheRead`가 0이면 숨겨짐 | 요청 횟수가 아니라 실제 캐시 읽기 발생 여부 확인. 두 번째 요청에도 숨겨질 수 있음 |
| 아이콘이 💾 그대로 | 커스텀 테마 미적용(오타·JSON 오류 → `dark` 폴백) | `omp config get theme.dark`, `omp gallery --segment cache_hit --plain` |
| 커스텀 테마가 무시됨 | `colors` 필수 토큰 누락 또는 JSON 오류 | §3의 내장 테마 복사부터 다시 |
| Codex `CO` 그룹이 안 보임 | Codex OAuth가 없거나 최초 조회 실패, 또는 인증을 사용할 수 없는 상태 | `/login openai-codex`, `codex-usage:` 로그 확인. 로그인 후 다음 90초 갱신·턴 종료 또는 재시작으로 확인 |
| OpenCode 사용률 앞에 `OC`가 없음 | 접두어 변경 이전 플러그인 코드가 로드됨 | §1-5의 설치 방식별 갱신 후 omp 재시작. `1.0.0` 표시만으로 최신 코드 여부를 판단하지 않음 |
| CO·OC의 항목 끝에 `!` | 사용 한도 소진 또는 API 제한 판정 | 단순 조회 실패(`?`)와 구분. Codex의 표식은 유료 크레딧으로 계속 사용 가능한지까지 뜻하지 않음 |

추가 함정:

- 좁은 터미널에서는 이 한 줄이 **줄바꿈되지 않고 잘린다**. 줄이 갈라져 보이면 폭이 아니라 위 표의 첫 줄을 의심한다.
- 밸런스를 자기 행에 두고 싶으면 반대로 하면 된다: `status`를 빼고 `showHookStatus: true` 유지.
- 설정·테마 변경 후에는 omp를 재시작한다(세그먼트 목록과 테마는 시작 시 로드).

---

## 6. 재설치 체크리스트와 백업 범위

### OS별 준비

- **Windows PowerShell:** §1-1의 Windows 설치 명령 → §1-2의 로그인 또는 UTF-8 인증 이전 → §3-1의 PowerShell 테마 복사.
- **macOS zsh/bash:** §1-1의 macOS 설치 명령 → §1-2의 로그인 또는 인증 이전 → §3-1의 셸 테마 복사. 데스크톱 제어를 쓸 경우 §4의 OS 권한을 확인하고 필요 시 터미널을 재시작한다.
- 이미 설치돼 있으면 설치기를 다시 실행하지 말고 `omp --version`부터 확인한다. 테마 버전은 설치 버전과 맞춘다.

### 공통 복구 순서

1. 사용할 프로필을 결정한다. 아래 경로는 기본 프로필 기준이며, 이름 있는 프로필은 §1-3의 경로를 사용한다.
2. `~/.omp/agent/config.yml`에 §2 키만 병합한다. 기존 모델·인증·머신별 값은 유지한다.
3. `~/.omp/agent/themes/titanium-custom.json`에 §3의 이름 변경과 **전체 오버라이드**를 적용한다.
4. `~/.omp/agent/RULES.md`에 §7 내용을 저장한다.
5. 다음 플러그인 설치 명령을 실행한다(두 OS 공통):

```sh
omp plugin install github:pawprint0706/omp-codex-usage
omp plugin install github:pawprint0706/omp-opencode-go-usage
omp plugin install github:pawprint0706/omp-openrouter-credits
```

6. 다음 CLI 검증을 실행한다:

```sh
omp plugin list                                # Codex·OpenCode·OpenRouter 3종 활성 확인
omp config get statusLine.leftSegments
omp config get statusLine.compactThinkingLevel  # false
omp config get theme.dark                      # titanium-custom
omp config get spelling.autocomplete           # off
omp config get computer.enabled                # true
omp config get browser.enabled                 # true
omp gallery --segment model --plain --width 200
omp gallery --segment status --plain --width 200
omp gallery --segment cache_hit --plain --width 200
```

7. omp를 다시 실행해 실제 TUI에서 `CO`·`OC`·`OR` 그룹을 확인한다(각 인증 필요). 기존 한 줄 배치는 그대로 유지한다. 좁은 터미널에서는 오른쪽 그룹이 잘릴 수 있으므로 검증 시 폭을 충분히 확보한다. 🎯는 캐시 읽기가 없으면 숨겨지므로 갤러리 결과와 구분한다.
8. §4의 Eval 스모크로 브라우저를 먼저 연다. 관리형 headless Chromium을 사용한 경우 같은 프로젝트의 CLI에서 `omp ps`로 데몬을 추가 확인한다.

### 백업 목적을 구분한다

- **설정만 재현:** `config.yml`, `themes/`, `RULES.md`, `~/.omp/plugins/package.json`과 플러그인 잠금 파일(`omp-plugins.lock.json`), 별도로 안전하게 내보낸 인증을 보관한다. 사용하는 프로필별로 필요한 파일·인증을 챙긴다. 이 목록만으로 이전 대화·사용량 이력까지 복원되지는 않는다.
- **로컬 연결 플러그인:** 설치 목록이나 `package.json`만으로는 원본 프로젝트가 복구되지 않는다. `omp plugin list --json`으로 설치 경로를 확인하고, 링크 대상 소스의 저장소·리비전·로컬 변경을 별도로 보존한다. 새 PC에서는 원본을 복원해 다시 연결하거나 위 GitHub 설치 명령을 사용한다. 심볼릭 링크만 백업하고 실제 소스를 빠뜨리지 않는다.
- **대화·이력까지 보존:** `sessions/`와 필요한 DB도 백업 대상이다. 실제 18.11.2의 `agent.db`에는 `auth_credentials`, `settings`, `usage_history` 등의 테이블이 있으므로 **`*.db`를 모두 폐기 가능한 캐시로 취급하지 않는다.** 로그 보존 여부는 진단 필요와 민감정보 보관 정책에 따라 결정한다.
- **전체 백업:** 관련 omp 프로세스·데몬을 정상 종료한 뒤 `~/.omp`와 사용하는 프로필 데이터를 암호화된 저장소에 일관된 스냅샷으로 보관한다. 실행 중 SQLite의 `.db`만 복사하면 WAL에 남은 변경을 놓칠 수 있으므로, 실행 중 백업이 필요하면 SQLite 백업 기능 등 일관성을 보장하는 방식을 사용한다. DB에는 자격증명이 포함될 수 있다.
- **재설치와 삭제는 별개:** 바이너리 재설치는 사용자 데이터를 지우는 작업이 아니다. 재설치를 이유로 `~/.omp`, DB, 세션을 일괄 삭제하지 않는다. 전체 백업의 다른 OS·다른 버전 복원은 별도 호환성 확인이 필요하다.

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
- 최종 표기는 §0의 예시와 같다. `compactThinkingLevel: false`와 §3의 전체 오버라이드로 6단계 effort를 단어로 표시하고 모델 아이콘을 제거했다. `off`는 공유 비활성 표식을 보존하기 위해, 미해결 `auto`는 글리프 제거 시 남는 고정 공백을 피하기 위해 기본 글리프를 유지하기로 했다. 이 제한은 18.11.2의 현재 설정·테마 방식에 관한 것이며 코드 수정까지 불가능하다는 뜻은 아니다.

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
