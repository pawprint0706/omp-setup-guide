# omp 셋업 가이드 (Windows · macOS)

Windows와 macOS에서 omp를 설치하고 기본 프로필의 설정을 구성·복구하는 가이드다. 해당 OS의 진행 순서부터 시작하고, 공통 설정은 §1–7을 따른다. 특정 환경의 적용 결과·버전별 검토·변경 이력은 [설정 변경·검증 히스토리](omp-setup-history.md)에 별도로 보관한다.

- **구성:** 두 줄 상태줄, 🎯 캐시 아이콘, effort 문자열 표시, 모델 아이콘 제거, 선택한 조회 플러그인과 `omp-usage-row` 레이아웃 확장, 전역 규칙, Eval 프렐류드, 입력 단어 자동완성 off.
- 모델·프로바이더·인증은 기존 값을 유지한다. 아래 DeepSeek 모델명과 사용량·잔액은 표시 예시이며 고정 설정값이 아니다.

작성: 2026-10-15, 갱신: 2026-10-29.

## Windows 설치·설정 진행 순서

PowerShell을 사용한다. 기본 프로필의 `~/.omp`는 `$env:USERPROFILE\.omp`에 해당한다.

1. §1-1의 **Windows — PowerShell** 명령으로 설치하고 `omp --version`을 확인한다. 기존 설치본은 먼저 버전부터 확인한다.
2. §1-2에서 사용할 제공자에 로그인한다. 인증을 이전한다면 **Windows PowerShell용 UTF-8 내보내기** 절차를 사용한다.
3. §2의 설정 키를 `~/.omp/agent/config.yml`에 병합한다.
4. §3-1의 **Windows PowerShell** 명령으로 설치 버전에 맞는 테마를 복사하고, §3-2–4의 이름·심볼·테마 선택을 적용한다.
5. §1-5에서 원하는 조회 플러그인만 설치하고 이 저장소를 `omp-usage-row`로 연결한다. 설치한 조회 플러그인의 자동 로딩은 끈다.
6. §7의 전역 규칙을 저장한다. 데스크톱·브라우저 제어는 §4에서 설정하고 권한을 확인한다. 다른 OS의 네이티브 애드온을 복사하지 않는다.
7. omp를 다시 실행하고 §1-7의 설치 후 확인과 §4의 동작 확인을 수행한다. 재설치·백업은 §6을 따른다.

## macOS 설치·설정 진행 순서

터미널의 zsh/bash를 사용한다. 기본 프로필의 `~/.omp`는 `$HOME/.omp`에 해당한다.

1. §1-1의 **macOS — 터미널의 zsh/bash** 명령으로 설치하고 `omp --version`을 확인한다. 기존 설치본은 먼저 버전부터 확인한다.
2. §1-2에서 사용할 제공자에 로그인한다. 인증을 이전한다면 **macOS / Git Bash용 내보내기** 절차를 사용한다.
3. §2의 설정 키를 `~/.omp/agent/config.yml`에 병합한다.
4. §3-1의 **macOS zsh/bash** 명령으로 설치 버전에 맞는 테마를 복사하고, §3-2–4의 이름·심볼·테마 선택을 적용한다.
5. §1-5에서 원하는 조회 플러그인만 설치하고 이 저장소를 `omp-usage-row`로 연결한다. 설치한 조회 플러그인의 자동 로딩은 끈다.
6. §7의 전역 규칙을 저장한다. 데스크톱 제어를 사용한다면 §4에 따라 터미널 앱의 OS 권한을 허용하고 터미널을 다시 실행한다.
7. omp를 다시 실행하고 §1-7의 설치 후 확인과 §4의 동작 확인을 수행한다. 재설치·백업은 §6을 따른다.

## 공통 설정 찾아보기

| 절 | 내용 |
|---|---|
| §0 | 목표 상태와 선택한 제공자의 표시 방식 |
| §1 | 바이너리·인증·플러그인 설치 및 설치 후 확인 |
| §2 | `config.yml`에 병합할 설정 |
| §3 | OS별 테마 복사와 공통 오버라이드 |
| §4 | 데스크톱·브라우저 제어 설정과 권한 |
| §5 | 상태줄 문제 해결 |
| §6 | 재설치·백업 |
| §7 | 전역 규칙 |

## 0. 목표 상태

하단 상태줄은 **두 줄**이다. 첫째 줄은 모델·컨텍스트·🎯 캐시 적중률·지출액까지, 둘째 줄은 같은 `π` 배지 뒤에 **CO → OC → OR를 줄바꿈 없이** ` · `로 이어 표시한다. 사용량 문자열은 둘째 줄 `π`와 같은 `dim` 색상을 사용하며, dot 구분자는 `statusLineSep`를 유지한다. 모델 아이콘 없이 모델명 뒤에 effort 단어가 표시된다. 표시 예시:

```
 π · DeepSeek V4.1 Flash · high · 📁 omp-setup-guide · ◫ 0.9%/1M ⟲ · 🎯 49.17% · $0.00
 π · CO 5h 22% | Wk 19% · OC 5h 2% | Wk 0% | Mo 0% · OR $4.89
```

| 조각 | 출처 |
|---|---|
| `◫ 0.9%/1M ⟲` | 내장 `context_pct` 세그먼트 |
| `🎯 49.17%` | 내장 `cache_hit` 세그먼트 + 커스텀 테마의 아이콘 오버라이드 (§3) |
| `CO 5h 22% \| Wk 19%` | 플러그인 `omp-codex-usage` — Codex 구독 사용률 |
| `OC 5h 2% \| Wk 0% \| Mo 0%` | 플러그인 `omp-opencode-go-usage` — OpenCode Go 사용률 |
| `OR $4.89` | 플러그인 `omp-openrouter-credits` |

`CO`·`OC`는 **사용한 비율**(남은 비율 아님), `OR`는 계정 잔액이다. 세 그룹의 설치 여부 자체가 선택 사항이다. §1-5에서 원하는 제공자만 설치하며, 미설치 제공자의 그룹은 표시되지 않는다. 그룹 내부는 ` | `, 플러그인 그룹 사이는 ` · `로 구분한다. Codex는 기본 플랜의 실제 기간만 표시하므로 주간 전용 플랜에서는 `CO Wk …%`만 보이며 월간 한도를 만들어 표시하지 않는다. 인증이 없거나 최초 조회에 실패한 그룹은 숨겨질 수 있다.

둘째 줄 배지는 현재 테마의 `icon.omp`를 사용하며, 사용량 텍스트·숫자·그룹 내부 `|`와 함께 `dim` 색상이다. 배지 뒤와 그룹 사이의 dot 구분자 `·`만 `statusLineSep`를 사용한다. 색상값은 코드에 고정하지 않으므로 터미널 색상 모드에 맞춰 렌더링된다. 윗줄의 작업 중 스피너까지 복제하는 배지는 아니다.

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

§2의 키만 병합한다. 이 가이드는 **기본 프로필**의 `~/.omp/agent/config.yml`을 기준으로 한다. 이름 있는 프로필은 `~/.omp/profiles/<profile>/agent/config.yml`을 사용하므로 해당 프로필에 적용하고, 실행·확인도 같은 프로필에서 한다. 나머지 모델·머신별 설정은 기존 값을 유지한다.

### 4) 커스텀 테마 `~/.omp/agent/themes/titanium-custom.json`

🎯 캐시 아이콘·effort 문자열·모델 아이콘 제거용. §3에서 OS에 맞게 내장 테마를 복사하고 **전체 오버라이드 블록**을 병합한다. 이미 맞춰둔 PC가 있으면 완성된 테마 파일을 복사해도 된다.

### 5) 조회 플러그인 3종 + 사용량 행 확장

```powershell
omp plugin install github:pawprint0706/omp-codex-usage
omp plugin install github:pawprint0706/omp-opencode-go-usage
omp plugin install github:pawprint0706/omp-openrouter-credits
```

- 조회 플러그인 3종은 **전부 필수가 아니다. 위 명령 중 원하는 제공자의 명령만 실행한다.** 통합 확장(`omp-usage-row`)은 미설치·로드 실패·시작 실패 제공자를 건너뛰고 나머지를 로드한다. 모두 미설치면 둘째 줄 전체를 숨긴다. 제거할 때는 `omp plugin uninstall <name>`을 사용하고 통합 확장과 가이드 저장소는 유지한다.

기존 로컬 연결을 GitHub 설치본으로 교체할 때는 아래 명령에 **교체할 제공자만** 남겨 실행한다. 이후 설치한 제공자의 `disable` 명령을 다시 실행한다. 로컬 원본 프로젝트는 삭제하지 않는다:

```sh
omp plugin install github:pawprint0706/omp-codex-usage github:pawprint0706/omp-opencode-go-usage github:pawprint0706/omp-openrouter-credits --force
```

이 가이드 저장소의 루트에서 다음을 실행한다(Windows PowerShell·macOS 공통). `omp plugin install .`은 저장소를 로컬 플러그인으로 연결하므로 이후에도 폴더를 유지한다. **`disable`은 설치한 제공자에 대해서만 실행한다:**

```sh
omp plugin install .
omp plugin disable omp-codex-usage
omp plugin disable omp-opencode-go-usage
omp plugin disable omp-openrouter-credits
omp plugin list   # omp-usage-row 활성, 설치한 원본 조회 플러그인은 비활성
```

- `omp-usage-row`는 이 저장소의 `extensions/usage-row.ts`로 구현된다. 설치된 세 플러그인의 조회 함수를 그대로 실행하되 UI 출력만 `usage-row` 키 하나로 합친다. 원본 3종의 **자동 로딩만 비활성화**하며 삭제하지 않는다. 다시 활성화하면 조회·표시가 중복된다.
- 원본 조회 플러그인은 기본 사용자 경로 `~/.omp/plugins/node_modules/<name>`에 **GitHub 저장소에서 설치**한다. 다른 플러그인 루트는 통합 확장의 지원 범위가 아니다. 로컬 연결은 개발할 때만 선택적으로 사용하고, 수동 extension 복사로 중복 로드하지 않는다. `omp-usage-row` 자체는 이 가이드 저장소에 연결된 로컬 레이아웃 확장을 유지한다.
- 플러그인이 배포하는 `statusline.yml`은 **참고용이며 자동 병합되지 않는다**. 현재 §2는 `leftSegments`에서 `status`를 빼고 `showHookStatus: true`를 사용한다. 합쳐진 훅 하나만 둘째 줄에 표시되며, `CO`·`OC`·`OR`는 세그먼트 이름이 아니다. 플러그인 예제로 기존 테마·`cache_hit`·`segmentOptions`를 덮어쓰지 않는다.
- 원본 조회 플러그인 설명서: `~/.omp/plugins/node_modules/<name>/README.md`. `omp-usage-row`의 설치·복구 설명서는 이 가이드다.
- OpenCode의 `OC` 접두어는 테마 설정이 아니라 플러그인 코드 변경이다. 예전 GitHub 설치본이면 `omp plugin upgrade omp-opencode-go-usage`로 갱신하고, 로컬 연결이면 원본 프로젝트의 해당 변경을 반영한다. 버전이 동일한 `1.0.0`이어도 코드가 다를 수 있으므로 버전 문자열만으로 접두어 적용을 판단하지 않는다.
- **18.11.3의 갱신 주의:** `omp plugin upgrade omp-opencode-go-usage --dry-run`을 무변경 검사로 사용하지 않는다. 로컬 연결은 원본 프로젝트를 관리하고, 링크가 바뀌면 `omp plugin install <원래 로컬 경로>`로 다시 연결한다.
- 설치·갱신 후 omp를 다시 실행해 실제 상태줄을 확인한다. Codex·OpenCode는 시작 시, 턴 종료 시, 90초 주기로 조회한다. 기존 로그인·모델·승인 정책은 유지한다.
- 플러그인 설명서: [Codex](https://github.com/pawprint0706/omp-codex-usage), [OpenCode Go](https://github.com/pawprint0706/omp-opencode-go-usage), [OpenRouter](https://github.com/pawprint0706/omp-openrouter-credits).

### 6) Eval 프렐류드 (computer-use / browser-use)

데스크톱 백엔드는 플랫폼별 네이티브 애드온으로 제공되고, 관리형 Chromium은 필요 시 첫 사용 때 준비된다. Windows 애드온 경로 예시는 `~/.omp/natives/<version>/pi_natives.win32-x64-baseline.node`이며 macOS에 이 파일을 복사하지 않는다. `computer.enabled`는 프렐류드 스위치일 뿐, OS 권한이나 사용자 동의를 대신하지 않는다(§4).

- `browser`는 기본 on(`browser.enabled: true`)이라 아무것도 하지 않는다.
- `computer`는 기본 off이므로 §2의 `computer.enabled: true`를 넣는다(§4).
- 설정 파일은 omp가 감시하므로 재시작 없이 다음 Eval 호출부터 반영된다. 세션 한정으로만 쓰려면 `/computer on`.

### 7) 설치 후 확인

아래 omp 명령은 Windows·macOS 공통이다. 기본 프로필이 아니라면 해당 프로필을 선택한 환경에서 실행한다.

```powershell
omp config get statusLine.preset          # custom
omp config get statusLine.leftSegments    # [..."context_pct","cache_hit","cost"] — status 없음
omp config get statusLine.showHookStatus  # true
omp config get statusLine.compactThinkingLevel # false
omp config get theme.dark                 # titanium-custom
omp config get spelling.autocomplete      # off
omp config get computer.enabled           # true
omp config get browser.enabled            # true
omp plugin list                           # omp-usage-row 활성, 설치한 조회 원본은 비활성

omp gallery --segment status --plain --width 200      # 훅 상태가 ' · '로 이어진 형태
omp gallery --segment cache_hit --plain --width 200   # 🎯 77.92%  ← 아이콘 오버라이드 확인
omp gallery --segment model --plain --width 200       # Sonnet 4.5 · high (⬢ 없음)
omp                                                   # 실제 TUI 확인 후 §4 Eval 스모크 실행
```

`omp gallery`는 자격증명 없이 세그먼트 렌더만 결정적으로 확인하는 도구다(`status`는 `Indexer ready · Tests passing`처럼 이어 붙여, `cache_hit`은 현재 테마의 아이콘으로 그린다). 두 프렐류드가 실제로 동작하는지는 Eval에서 확인한다 — §4.

실제 TUI에서 **선택해 설치하고 인증한 제공자의 그룹이 첫째 줄 바로 아래 한 행에 표시되는지** 확인한다. `status` 갤러리는 샘플 훅 문자열만 렌더링하므로 실제 두 줄 배치·인증·API 조회 성공을 증명하지 않는다. 미설치 제공자는 표시되지 않는 것이 정상이다.

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
  leftSegments: [pi, vim, model, mode, collab, stream, path, git, pr, context_pct, cache_hit, cost]
  rightSegments: [session_name]
  separator: powerline-thin
  segmentOptions:
    model: { showThinkingLevel: true }
    path: { abbreviate: true, maxLength: 40, stripWorkPrefix: true }
    git: { showBranch: true, showStaged: true, showUnstaged: true, showUntracked: true }
  showHookStatus: true

# 4) 입력 단어 자동완성 off
spelling:
  autocomplete: "off"

# 5) 데스크톱 제어 — computer Eval 프렐류드 (기본 false, §4)
#    browser 프렐류드는 기본 true라 키를 두지 않는다.
computer:
  enabled: true
```

- `preset: custom`은 `segmentOptions`가 **빈 맵에서 시작**한다. 위 블록을 생략하면 경로 축약·깃 플래그·thinking 아이콘이 사라진다.
- `composer.shape: claude`는 배치를 정한다: `rightSegments`는 입력창 **위** 꼬리줄, `leftSegments`는 **하단 첫째 줄**이다. `omp-usage-row`의 합쳐진 훅 상태가 그 바로 아래 둘째 줄에 붙는다. `status`를 어느 세그먼트 목록에도 넣지 않는다. 기본 컴포저는 `band`.
- `statusLine.compactThinkingLevel: false`는 effort 레벨을 **모델명 아이콘으로 접지 않고** ` · <레벨>` 문자열로 남긴다. 기본값 `true`에서는 레벨 표시가 모델명 앞 아이콘 하나(`◒ DeepSeek…`)로 접히고 문자열은 사라진다. 레벨 문자열 자체는 심볼 값(`thinking.*`)이라 기호를 떼려면 §3-5의 오버라이드가 함께 필요하다.
- `spelling.autocomplete: off`는 **입력창 단어 자동완성(고스트 힌트)만** 끈 값이다. 같은 `interaction → Input` 그룹의 자동완성 항목은 서로 독립이라 따로 지정해야 한다:

  | 설정 키 | 설정 UI 라벨 | 가이드 설정 | 끄는 값 |
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
- 복사본은 **스냅샷**이다. omp 업데이트로 내장 테마가 바뀌면 설치 버전에 맞는 파일을 다시 복사한 뒤 이름 변경과 위 전체 `symbols` 블록을 재적용한다.
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

- 모델명 앞 아이콘은 `icon.model`(unicode `⬢`, nerd `\uec19`, ascii `[M]`)이다. `""`로 두면 모델 아이콘과 그 공백을 없앤다. 같은 심볼을 쓰는 model-hub(`/models`) 행, agents-hub, 모델 멘션 자동완성, 모델 첨부 칩, `/setup` 테마 미리보기에도 적용된다.
- `compactThinkingLevel: true`에서는 이 자리가 thinking 글리프로 대체된다 — 그 조합에서는 `icon.model` 값이 상태줄에 쓰이지 않는다.

### effort 레벨을 문자열로 (§3-5)

- 레벨 표시 문자열은 심볼 값이다(키 네임스페이스 `thinking.*`). unicode 프리셋 기본값은 **글리프가 문자열에 붙은 형태**다: `thinking.minimal`=`○ min`, `thinking.low`=`◔ low`, `thinking.medium`=`◑ med`, `thinking.high`=`◒ high`, `thinking.xhigh`=`◕ xhigh`, `thinking.max`=`◉ max`, `thinking.autoPending`=`⟳`(auto 미해결 시 `⟳ auto`). nerd/ascii 프리셋도 같은 구조(`[med]` 등)다.
- 그래서 "기호 대신 문자열"은 설정 키 하나로는 안 되고 두 조각이 필요하다:

  | 조각 | 값 | 역할 |
  |---|---|---|
  | `statusLine.compactThinkingLevel` (§2) | `false` | 레벨 표시를 모델명 아이콘으로 접지 않고 ` · <문자열>` 꼬리로 유지 |
  | `symbols.overrides` `thinking.*` | `"medium"`, `"high"`, `"xhigh"` … | 문자열에서 글리프를 떼고 단어만 남김 |

- §3-3의 전체 블록은 `minimal`/`low`/`medium`/`high`/`xhigh`/`max`를 모두 단어로 바꾼다. 표시 가능한 effort 목록은 모델에 따라 다르다.
- **`auto` 미해결 상태의 `⟳`는 유지한다.** omp 18.11.2의 `${theme.thinking.autoPending} auto` 렌더링에서는 심볼을 비워도 고정 공백이 남는다. auto가 레벨로 해결되면 해당 레벨 단어가 표시된다.
- **`off`의 `⦸`는 유지한다.** `${theme.status.disabled} off`의 공유 심볼을 비우면 다른 화면의 비활성 표식도 사라지고 앞 공백은 남는다.
- 오버라이드는 테마 전역이므로 상태줄 외의 모델·에이전트 표시에도 영향을 준다. `thinking.autoPending`·`status.disabled`는 변경하지 않는다.

---

## 4. computer-use / browser-use (Eval 프렐류드)

omp의 두 프렐류드는 AgentTool이 아니라 `eval` 커널에 마운트되는 전역 객체다. 따라서 **켜져 있는 Eval 런타임이 전제**이고(`eval.js`/`eval.py`, 기본 `true`), 켜고 끄는 것은 별도 키다.

| 프렐류드 | 다루는 대상 | 스위치 | 기본값 |
|---|---|---|---|
| `browser` | Chromium/CDP 탭 — DOM·ARIA·페이지 JS·스크린샷·다운로드·요청 라우팅 | `browser.enabled` | `true` |
| `computer` | 실제 호스트 데스크톱 — 창 열거·캡처·OS 입력·UI Automation·클립보드 | `computer.enabled` | **`false`** |

`browser`는 기본 on이라 손댈 것이 없고, §2의 `computer.enabled: true` 한 줄이 데스크톱 제어를 켠다. 세션 한정으로만 켜려면 `/computer on`(`/computer status`로 현재 상태, `/computer off`로 해제) — 이 명령들은 설정 파일을 쓰지 않는다.

| 키 | 기본 | 가이드 설정 | 비고 |
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

1. **OS 권한:** 캡처·입력·접근성이 가능한지는 `computer.capabilities()`의 `capturePermission`/`inputPermission`/`axPermission`으로 확인한다. macOS에서는 **시스템 설정 → 개인정보 보호 및 보안**에서 터미널 앱의 캡처·입력·접근성 관련 권한을 허용하고 터미널을 재시작한다. `기기 제어 및 데이터 접근` 등 메뉴명은 macOS 버전에 따라 다를 수 있다. Windows에서도 권한 상태를 조회하며, `computer.enabled: true`나 도구 승인 정책으로 OS 권한을 대신 부여할 수 없다.
2. **omp 도구 실행 승인:** 조회·스크린샷은 read 티어, 입력·변경은 exec 티어다. `tools.approvalMode` 등은 이 도구 호출의 승인 정책이다. `yolo`도 모든 종류의 동의나 권한을 없앤다는 뜻은 아니며, 이 가이드는 승인 정책을 변경하지 않는다.
3. **작업 단위 제어와 중요한 동작의 동의:** `computer.control.acquire({reason})`로 전경 제어를 획득하려면 별도 실시간 사용자 확인이 필요하다. 획득했다면 작업 종료 시 `finally`에서 `computer.control.release()`로 해제한다. 제어 권한을 얻었더라도 전송·구매·삭제·권한 변경 등은 대상·범위에 대한 별도 승인이 필요하며, 일반적인 “제어 테스트” 요청이 이를 허용하지 않는다.

### 브라우저 연결과 Windows 임시 파일

- Windows 스크린샷 저장: `computer`는 `%TEMP%\omp-computer-*.png`, `browser`는 `browser.screenshotDir`(미설정 시 `%TEMP%\omp-sshots-*.webp`).
- 관리형 브라우저에 필요한 바이너리가 없으면 첫 사용 시 준비된다.
- 이미 로그인된 자기 Chrome 탭을 그대로 몰려면 relay: `omp browser-relay install`(확장을 `~/.omp/browser-relay/extension`에 풀고 로드 절차를 출력) → 확장 로드 → `browser.relay: true`.

### 설치 후 동작 확인

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

## 5. 상태줄 문제 해결

조회 플러그인의 원래 출력 키는 `openai-codex`·`opencode-go`·`openrouter`다. 현재 `omp-usage-row`는 이 출력을 고정 순서로 합쳐 **`usage-row` 키 하나**로 게시한다. 조회·인증·갱신 주기·오류 표식은 원본 코드가 담당한다.

| 구성 | `status` 세그먼트 | `showHookStatus` | 렌더 결과 |
|---|---|---|---|
| 현재: 통합 확장만 활성 | 없음 | `true` | 첫째 줄 기본 상태 + 둘째 줄 CO·OC·OR |
| 원본 3종 직접 활성 | 없음 | `true` | 기본 상태 아래 플러그인마다 한 행 |
| `status`에 직접 사용량 표시 | 있음 | `false` | 기본 상태와 모든 사용량을 같은 행에 표시 |

진단 표:

| 증상 | 원인 | 조치 |
|---|---|---|
| 플러그인별로 한 줄씩 내려가거나 중복됨 | 원본 조회 플러그인도 자동 로드됨 | §1-5처럼 `omp-usage-row`만 활성화하고 원본 3종은 비활성화 |
| 값이 아예 안 보임 | 통합 확장 비활성·원본 설치 누락·인증 없음·`showHookStatus: false` | `omp plugin list`, 확장 오류 메시지, §2 설정과 `/login <provider>` 확인 |
| 값이 입력창 위에 나오거나 첫째 줄에도 중복됨 | 세그먼트 목록에 `status`가 남음 | 양쪽 목록에서 `status`를 빼고 §2 적용 |
| 값 끝에 `?` | 플러그인 갱신 실패. 마지막 확인 값이므로 최신 사용량으로 보장되지 않음 | 로그에서 `codex-usage:`, `opencode-go-usage:`, `openrouter-credits:` 확인 |
| `🎯`가 안 보임 | 세그먼트 집계의 `cacheRead`가 0이면 숨겨짐 | 요청 횟수가 아니라 실제 캐시 읽기 발생 여부 확인. 두 번째 요청에도 숨겨질 수 있음 |
| 아이콘이 💾 그대로 | 커스텀 테마 미적용(오타·JSON 오류 → `dark` 폴백) | `omp config get theme.dark`, `omp gallery --segment cache_hit --plain` |
| 커스텀 테마가 무시됨 | `colors` 필수 토큰 누락 또는 JSON 오류 | §3의 내장 테마 복사부터 다시 |
| Codex `CO` 그룹이 안 보임 | Codex OAuth가 없거나 최초 조회 실패, 또는 인증을 사용할 수 없는 상태 | `/login openai-codex`, `codex-usage:` 로그 확인. 로그인 후 다음 90초 갱신·턴 종료 또는 재시작으로 확인 |
| OpenCode 사용률 앞에 `OC`가 없음 | 접두어 변경 이전 플러그인 코드가 로드됨 | §1-5의 설치 방식별 갱신 후 omp 재시작. `1.0.0` 표시만으로 최신 코드 여부를 판단하지 않음 |
| CO·OC의 항목 끝에 `!` | 사용 한도 소진 또는 API 제한 판정 | 단순 조회 실패(`?`)와 구분. Codex의 표식은 유료 크레딧으로 계속 사용 가능한지까지 뜻하지 않음 |

추가 함정:

- 둘째 줄도 터미널 폭보다 길면 **잘리며 자동 줄바꿈하지 않는다**. 긴 수치·오류 표식 또는 좁은 창에서는 끝이 잘릴 수 있다.
- 다른 확장이 훅 상태를 게시하면 추가 행이 생길 수 있다. 이 확장은 세 사용량 플러그인만 합친다.
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
5. §1-5에서 원하는 조회 플러그인만 설치한다. 가이드 저장소 루트에서 `omp plugin install .`을 실행하고, 설치한 제공자의 `disable` 명령으로 원본 자동 로딩을 끈다. 소스 파일을 따로 복사하지 않는다.

6. 다음 CLI 검증을 실행한다:

```sh
omp plugin list                                # omp-usage-row 활성, 설치한 조회 원본은 비활성
omp config get statusLine.leftSegments
omp config get statusLine.showHookStatus        # true
omp config get statusLine.compactThinkingLevel  # false
omp config get theme.dark                      # titanium-custom
omp config get spelling.autocomplete           # off
omp config get computer.enabled                # true
omp config get browser.enabled                 # true
omp gallery --segment model --plain --width 200
omp gallery --segment status --plain --width 200
omp gallery --segment cache_hit --plain --width 200
```

7. omp를 다시 실행해 실제 TUI에서 **선택해 설치하고 인증한 제공자의 그룹이 첫째 줄 바로 아래 한 행에 나오는지** 확인한다. 두 `π`는 두 번째 열에 정렬되고 사용량은 둘째 줄 `π`와 같은 색상이어야 한다. dot 구분자들은 윗줄 기본 구분자 색상을 유지한다. 미설치 제공자는 표시되지 않으며 모든 조회 값이 없으면 둘째 줄 전체가 숨겨진다. 둘째 줄보다 창이 좁으면 끝이 잘리므로 폭도 확인한다. 🎯는 캐시 읽기가 없으면 숨겨지므로 갤러리 결과와 구분한다.
8. §4의 Eval 스모크로 브라우저를 먼저 연다. 관리형 headless Chromium을 사용한 경우 같은 프로젝트의 CLI에서 `omp ps`로 데몬을 추가 확인한다.

### 백업 목적을 구분한다

- **설정만 재현:** `config.yml`, `themes/`, `RULES.md`, `~/.omp/plugins/package.json`과 플러그인 잠금 파일(`omp-plugins.lock.json`), 별도로 안전하게 내보낸 인증을 보관한다. 사용하는 프로필별로 필요한 파일·인증을 챙긴다. 이 목록만으로 이전 대화·사용량 이력까지 복원되지는 않는다.
- **로컬 연결 플러그인:** 설치 목록이나 `package.json`만으로는 원본 프로젝트가 복구되지 않는다. `omp plugin list --json`으로 설치 경로를 확인하고, 링크 대상 소스의 저장소·리비전·로컬 변경을 별도로 보존한다. 새 PC에서는 원본을 복원해 다시 연결하거나 위 GitHub 설치 명령을 사용한다. 심볼릭 링크만 백업하고 실제 소스를 빠뜨리지 않는다.
- **사용량 행 확장:** 이 가이드 저장소의 `package.json`과 `extensions/usage-row.ts`도 함께 보존한다. 문서 하나만 복사해서는 두 줄 레이아웃이 복원되지 않는다. 복구 시 §1-5의 연결·비활성화 절차까지 실행한다.
- **대화·이력까지 보존:** `sessions/`와 필요한 DB도 백업 대상이다. DB에는 자격증명·설정·사용량 내역이 포함될 수 있으므로 **`*.db`를 모두 폐기 가능한 캐시로 취급하지 않는다.** 로그 보존 여부는 진단 필요와 민감정보 보관 정책에 따라 결정한다.
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

다음 내용을 저장한다:

```markdown
# 전역 지침

- 답변 언어는 사용자 메시지의 언어를 그대로 따른다. 사용자가 쓰지 않은 언어로 답하지 않는다. 선택된 모델·역할과 무관하게 적용한다.
  - 한국어 메시지 → 한국어로 답변.
  - 한국어가 아닌 메시지(영어·일본어·중국어 등) → 그 메시지의 언어로 답변한다. 예: `Describe a hash table.`에는 영어로, `ハッシュテーブルとは？`에는 일본어로 답변한다.
- 메시지에 언어 단서가 전혀 없거나(코드·명령만 제출, 도구 출력만 있는 턴 등) 여러 언어가 섞여 있으면 한국어를 기본값으로 쓴다.
- 코드, 식별자, 파일 경로, 명령어, 인용한 도구 출력은 번역하지 않고 원문 그대로 둔다.
```

검증: 규칙이 실려 있는지 보려면 아무 세션에서나 첫 요청의 시스템 프롬프트에 본문이 포함돼야 하고, `RULES.md`를 비우면(또는 삭제하면) 다음 `/new`부터 사라진다.

