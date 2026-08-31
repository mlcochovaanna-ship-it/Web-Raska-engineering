# Stav rozpracované práce – web Raška engineering

_Poslední aktualizace: 2026-08-28_

## Mobilní úpravy – toto sezení

Otestováno přes Playwright (Chromium, mobilní viewport 390×844 + kontrola 320/375/430 px na horizontální přetečení – žádné nenalezeno).

**Opravená chyba:** Po otevření mobilního menu (`.mobile-nav`) zmizelo logo i zavírací (×) tlačítko v hlavičce a tlačítko nešlo ani kliknout (`.mobile-nav` ho vizuálně i interakčně překrývalo), přestože `.site-header` má `z-index: 100` a `.mobile-nav` jen `z-index: 99`. Příčina: `.nav-shell` (obsahuje logo i tlačítko) neměl nastavenou `position`, takže je podle pravidel CSS stackování prohlížeč vykresloval jako nepozicovaný prvek vždy POD jakýmkoli pozicovaným sourozencem (zde `.mobile-nav`) – bez ohledu na z-index rodiče. Oprava: `.nav-shell` dostal `position: relative; z-index: 101;` (`style.css`, sekce 5 Hlavička). Ověřeno screenshoty i funkčním kliknutím na zavírací tlačítko bez potřeby force-kliku; desktop header beze změny.

**Vyřešeno:** `.feature-grid` (karty O nás – Komplexní řešení / Bezpečnost / atd.) přepnuta na mobilu z 2 na 1 sloupec (base `grid-template-columns: 1fr`, beze změny zůstává `@media (min-width:640px) → repeat(4,1fr)`). Desktop (4 sloupce) ověřen beze změny.

**Vyřešeno – přestavba mobilního hera:** Uživatel nahlásil, že na mobilu byl hero text částečně nečitelný a tlačítka ležela přes fotku. Nové řešení pro mobil (`max-width:767px`, desktop nedotčen):
- Vznikl nový obrázek `Obrazky/web/hero-photos-mobile.jpg` (1200×714) – ořez PRAVÉ (fotografické) části aktuální `hero-collage-desktop.jpg`, tj. jen elektro/fotovoltaika/průmysl panely BEZ modré plochy. Modro/elektro šev nalezen přímým vzorkováním pixelů (ne odhadem): solid modrá `(21,58,103)` končí na `x≈1138` při `y=0` (slope `-0.13` sedí s již známým vzorcem švů), takže ořez `(1140, 0, 2400, 750)` z desktop koláže → resize na 1200×714 (dochoval poměr stran, žádné další oříznutí bokem). Vybrán horní pás (y 0–750 z 2000) obsahující výrazné detaily (červené kontrolky jističů, tlakoměr) – porovnáno vizuálně s pásy ze středu/spodu.
- HTML (`index.html`): `.hero-inner` (text) přesunut PŘED `.hero-media` v DOM (na desktopu nehraje roli, `.hero-media` tam zůstává `position:absolute` pozadí; na mobilu teď určuje pořadí v běžném toku). `<img>` na mobilu teď ukazuje na `hero-photos-mobile.jpg`, `width/height` upraveny na 1200×714.
- CSS (`style.css`, sekce 6 Hero): na mobilu `.hero-media` už není `position:absolute` full-bleed pozadí, ale běžný blok `position:relative; aspect-ratio:1200/714;` hned pod textem – modrá plocha za textem je jen samotný gradient `.hero` (stejná formule jako `.site-footer`). `.hero-inner` na mobilu má zrušenou velkou `min-height` rezervu (`min-height:auto`) a menší `padding-bottom`, protože už neslouží k naskládání prostoru pod fotkou na pozadí. `object-position` na `.hero-media img` sjednocen na `center center` pro obě šířky (zrušen zvláštní mobilní `center top`, redundantní `@media(min-width:768px)` blok smazán).
- Staré `Obrazky/web/hero-collage-mobile.jpg` (1200×2200, s modrou nahoře) zůstává v souborech nepoužité, pro případný návrat.
- Ověřeno screenshoty na 390px, 320px (žádné horizontální přetečení) i na desktopu 1440px (hero i feature-grid beze změny).

**Doladění po zpětné vazbě uživatelky (eyebrow "nalepený" na menu, fotka moc zakrytá kartou):**
- `.hero-content` na mobilu dostal `margin-top: calc(var(--header-height) + var(--space-8))` (přidán odstup eyebrow od hlavičky).
- `.hero-content h1` na mobilu zmenšen na `clamp(2rem, 1.5rem + 4vw, 2.5rem)`, `.hero-content .lead` na `font-size: 1rem` (desktop beze změny, oboje jen v `@media (max-width:767px)`).
- `hero-photos-mobile.jpg` přegenerován na PLNOU výšku zdrojového pruhu (ořez `(1140,0,2400,2000)` místo jen `(1140,0,2400,750)`), tj. 1200×1905 místo 1200×714 – uživatelka chtěla mobilní fotku vyšší, "klidně stejně vysokou jako pro desktop, ten výřez", protože při krátké verzi kartu služby (`.services-overlap`, přesah `-8.6rem`) zakrývala téměř celou fotku. `.hero-media` `aspect-ratio` v CSS upraven na `1200/1905`, `<img>` width/height v HTML na `1200/1905`.

**Třetí kolo doladění (padding hero, foto o něco nižší, karta pohotovosti vyšší):**
- `.hero-actions` (tlačítka) na mobilu blíž textu: `margin-top` snížen z `--space-12` na `--space-6`. **Pozor, tahle první verze se ve skutečnosti vůbec neprojevila** – pravidlo bylo omylem zapsané do `@media(max-width:767px)` bloku, který se v souboru nachází PŘED obecným (nepodmíněným) pravidlem `.hero-actions { margin-top: var(--space-12); }` – při stejné specificitě vyhrává pozdější pravidlo v pořadí zdroje, takže mobil dál používal 48px. Opraveno až ve čtvrtém kole (viz níže) přesunutím override AŽ ZA obecné pravidlo.
- Padding modré hero plochy na mobilu sjednocen nahoře/dole: `.hero-inner` teď má `padding-top: calc(var(--header-height) + var(--space-8))` a `padding-bottom: var(--space-8)` (dřív byl nesymetrický – navíc ještě `.hero-content` vynucovalo `min-height: calc(100vh - header-height)`, což dělalo mezeru dole mnohem větší než nahoře). `.hero-content` na mobilu teď má `margin-top:0; min-height:auto` – veškerý odstup od hlavičky řeší jen `.hero-inner`'s padding-top.
- `hero-photos-mobile.jpg` znovu přegenerován, mírně nižší: ořez `(1140,0,2400,1600)` místo `(1140,0,2400,2000)` → 1200×1524 (místo 1200×1905). `.hero-media` `aspect-ratio` a `<img>` width/height upraveny na `1200/1524`.
- Karta „Potřebujete elektrikáře rychle?" (`.band-inner`) na mobilu zvýšena (`min-height: 32rem`) a maska `.band-photo` posunuta tak, aby bylo dole jasně vidět víc fotky (`mask-image` mobilní varianta: transparentní do 40 %, plně krycí už od 82 % místo 52 %/100 %) – text nahoře zůstává stejně velký/čitelný, dole navíc vznikl prostor, kterým fotka zřetelně prosvítá.
- Vše ověřeno na 390px i desktopu 1440px (beze změny na desktopu).

**Čtvrté kolo (uživatelka nahlásila, že tlačítka jsou "pořád daleko od textu"):** Skutečná příčina byla ta CSS pořadová chyba popsaná výše – `margin-top` na mobilu byl ve skutečnosti pořád 48px, ne 24px. Opraveno: mobilní override `.hero-actions { margin-top: var(--space-4); }` (16px) přesunut do nového `@media(max-width:767px)` bloku HNED ZA obecné pravidlo `.hero-actions` (`style.css` cca řádek 644). Ověřeno přímým výpočtem `getComputedStyle` na 390px (mezera lead→tlačítka teď 32px celkem, dřív 64px) i screenshotem; desktop beze změny (pořád 48px).

**Poučení pro příště:** u jakéhokoli mobilního `@media(max-width:...)` override je nutné ho v souboru fyzicky umístit AŽ ZA odpovídající obecné (nepodmíněné) pravidlo se stejným selektorem/specificitou – jinak ho to pozdější obecné pravidlo v cascade přebije a mobilní úprava se navenek vůbec neprojeví, i když vypadá v kódu správně. Při jakékoli podobné úpravě raději rovnou ověřit `getComputedStyle` na daném viewportu, ne jen věřit zápisu v CSS.

## Páté kolo úprav (další sada mobilních požadavků)

- **Fotka v pásu "Potřebujete elektrikáře rychle?"** – na mobilu (úzká/vysoká karta, `min-height:32rem`) `background-position: center 34%` ořezávalo hlavně obličej/ruku, multimetr a rozvodná skříň (vpravo ve zdrojové fotce `pohotovost-band.jpg`, 1800×649) byly mimo záběr. Přidán mobilní override `background-position: 0% 0%, 80% 34%;` (dvě hodnoty = gradient vrstva beze změny, fotka posunuta doprava). Ověřeno screenshotem – teď jasně vidět multimetr i rozvaděč.
- **Sekce O nás – prohozené pořadí text/fotka na mobilu.** V `index.html` přesunut `.about-content` (text) PŘED `.about-media` (fotka) a `.about-watermark` v DOM. Na desktopu (1024px+) je `.about-media` `position:absolute` (kryje se jako pozadí za textem vpravo), takže pořadí v DOM tam nehraje roli – ověřeno screenshotem, beze změny. Na mobilu (normální tok, žádné absolutní pozicování) teď jde: text → fotka → hned navazující glass karty (`.feature-grid`, přesah `margin-top:-3.5rem` teď kouše do spodku FOTKY místo textu). Vedlejší efekt: `.about-watermark` (translucentní gear logo, `position:absolute;bottom:3.5rem` vůči celému `.about-split`) by se po prohození ocitl schovaný v fotce místo u paty textu – opraveno mobilním override `bottom: calc(75vw + 3.5rem)` (75vw = přesná výška `.about-media` na mobilu, protože má `aspect-ratio:4/3` na plnou šířku bez containeru).
- **Naše realizace – diagonální řez i na mobilu + menší ikony.** Mobilní mřížka `.showcase-gallery` (3 sloupce × 2 řady, `gap:0`) dostala stejný princip šikmého řezu jako desktopová flex verze, jen s menším úhlem (`--showcase-skew-m: 0.85rem` místo desktopových `2rem`) a přes `:nth-child(3n+1/+2/3n)` (první/prostřední/poslední fotka v KAŽDÉ ze 2 řad, místo `:first-child`/`:last-child` jako na desktopu, kde je jen 1 řada). `.showcase-tag` (kroužek s ikonou oboru) na mobilu zmenšen z 3.75rem na 2.25rem (ikona uvnitř z 2.1rem na 1.25rem), odsazení z `--space-4` na `--space-2` – dřív zabíral skoro polovinu šířky malé fotky. Diagonála je na malém near náhledu jemná, ale při přiblížení jasně vidět a fungovala i vizuálně v plném screenshotu.
- **CTA pás "Chcete se dozvědět více o našich službách?"** – padding na mobilu zmenšen z `padding-top:6rem / padding-bottom:7rem` na `padding-top/bottom: var(--space-12)` (48px/48px). Ověřeno `getComputedStyle`.
- **Patička – navigace ve 2 sloupcích po 3 (do 1023px).** `.footer-nav-col ul` dostal do `@media(max-width:1023px)` `display:grid; grid-template-columns:repeat(2,1fr)` s explicitním `grid-column`/`grid-row` po `:nth-child` (HTML pořadí položek beze změny – Domů, Elektro služby, Fotovoltaika, Průmyslová řešení, O nás, Kontakt): levý sloupec = služby (Elektro služby, Fotovoltaika, Průmyslová řešení), pravý sloupec = Domů, O nás, Kontakt. Od 1024px zůstává původní jednosloupcové zarovnání na výšku (`flex; justify-content:space-between`) beze změny.

Všech 5 bodů ověřeno screenshoty na 390px i plným průchodem desktopu (1440px) – beze změny na žádné z upravovaných sekcí.

## Šesté kolo úprav

- **Fotka v pásu pohotovosti – posun na "vrchní část multimetru".** Zjištěno, že `background-position` Y na mobilu neměl vůbec žádný efekt: box (331.5×512) a zdrojová fotka (1800×649) mají tak odlišný poměr stran, že "cover" se vždy přesně srovná na VÝŠKU (512=512×1.024) a ořízne jen šířku – žádná svislá rezerva k posunu neexistuje, ať je Y jakékoliv. Řešení: nový samostatný soubor `Obrazky/web/pohotovost-band-mobile.jpg` (750×500), oříznutý přímo z originálu (`(1050,20,1800,520)`) tak, aby ukazoval hlavně ciferník/tělo multimetru + rozvaděč a co nejméně zápěstí/ruky. Použit jen na mobilu přes `background-image`/`background-position` override (ne celý `background` shorthand, aby zůstalo zachováno `background-size:cover` a gradient overlay z základního pravidla). Doladěná pozice `21% center`. Displej multimetru (LCD) kvůli fixní 40% skryté horní zóně masky není 100 % v záběru, ale ciferník (rotační přepínač) i rozvaděč ano – podstatně méně "jen ruka" než původně. Pokud by uživatelka chtěla i displej výrazněji, je potřeba předělat zdrojový ořez tak, aby displej ležel níž v novém obrázku (blíž viditelné spodní zóně masky), případně mírně posunout práh masky – zatím neřešeno, čeká na zpětnou vazbu.
- **Logo (vodoznak) v O nás blíž kraji na mobilu.** `.about-watermark` mobilní override doplněn o `right: 0` (dřív dědilo `right:4%` ze základního pravidla, stejné jako desktop).
- **Bílý pruh dole u fotek na šířku v mobilní galerii – opravená chyba.** Skutečná příčina: `margin-left` (záporný, pro překryv diagonálního řezu) na CSS Grid itemu se `align-items:stretch` (default) donutí prohlížeč dopočítat VĚTŠÍ šířku daného itemu (track šířka mínus záporný margin = víc místa), a protože `.showcase-photo` má `aspect-ratio:3/4` odvozený z vlastní šířky, položky s záporným marginem (prostřední/poslední ve řádku) vyšly širší A VYŠŠÍ než první položka v řádku – řádek se pak roztáhl na výšku těch vyšších, a first-in-row položka (bez marginu, tedy nižší) nechala dole mezeru = bílý pruh. Netýkalo se to konkrétní orientace fotky, ale POZICE ve řádku (first-in-row), což se jen náhodou překrývalo s tím, že landscape fotky byly zrovna v řádku 2. Oprava: `margin-left` nahrazen `transform: translateX(...)` – transform je čistě vizuální posun, vůbec neovlivňuje layout/šířku, takže všechny položky mají teď stejnou šířku (130px) i výšku (173px), žádná mezera. Ověřeno přímým měřením přes `getComputedStyle`/`getBoundingClientRect`.
- **Standardní mobilní padding sekcí (`--section-padding-mobile: var(--space-12)`, 48px).** Nový CSS custom property v `:root`. Aplikován na `.section` (jen `padding-top`, aby zůstalo zachováno `.showcase-section`ovo záměrné `padding-bottom:0`), `.about-section` a `.contact-section` (oba `padding-block`) – vše v novém bloku na úplném konci `style.css` (sekce 15), aby při stejné specificitě spolehlivě přebil všechna dřívější nepodmíněná pravidla pro tytéž sekce. `.showcase-cta-band` (nastaveno minulé kolo) přepsáno, ať používá stejnou proměnnou místo natvrdo `--space-12`. Desktop hodnoty (64px/96px/96px/96+112px) ověřeny beze změny.

Všechny 4 body ověřeny na 390px i desktopu 1440px.

## Sedmé kolo úprav

- **Logo (vodoznak) v O nás – zmenšeno a odsazení sjednoceno s pravým okrajem.** Nejdřív zkoušeno doslova `bottom:0; right:0` (roh fotky) podle zadání "stejný odstup jako od pravého okraje". Zjištěno (ověřeno screenshotem se zvýrazněným kontrastem), že logo s `opacity:0.2` položené přímo na busy fotku je prakticky neviditelné – na desktopu je vidět jen proto, že tam sedí na ploché modré ploše, ne na fotce. Po konzultaci s uživatelkou zůstává řešení: logo zůstává na modré ploše (nad fotkou, stejně jako desktop), `bottom: 75vw` (= přesná výška `.about-media`, tj. logo těsně nad horní hranou fotky, nulová mezera) + `right: 0`, `width` zmenšena z `14rem` na `6rem`, poté na základě zpětné vazby (bylo příliš malé) zvětšena na `11rem`. Odstup od spodní (horní hrana fotky) i pravé hrany modré plochy nakonec sjednocen na `var(--space-2)` (0.5rem) místo nulového, ať logo trochu "dýchá" v prostoru. Ověřeno screenshotem, desktop (`bottom:3.5rem; right:4%; width:14rem`) beze změny.
- **Fotka v pásu pohotovosti – zkusili jsme užší ořez (750×350) ukazující displej multimetru, ale uživatelce se nelíbil (ztratil se rozvaděč, moc přiblížené) → vráceno zpět.** `pohotovost-band-mobile.jpg` je znovu 750×500 (dial + rozvaděč, stejně jako předtím), jen ořez z originálu posunut z `(1050,20,1800,520)` na `(1050,0,1800,500)` – tj. využito zbylých 20px prostoru nad multimetrem v originálu (výš už zdrojová fotka nejde, 0 je její úplný horní okraj). `background-position-x` zpět na `21%`. **Důležité omezení zjištěné v tomto kole:** displej multimetru (LCD) je ve zdrojové fotce jen ~170–195px od úplného horního okraje (y=0), zatímco maska `.band-photo` na mobilu odkrývá fotku až od 40 % výšky karty dolů – při zachování širšího záběru (dial+rozvaděč, výška ořezu ~500px) se displej nikdy nedostane výš než ~40–44 % masky, tedy zůstane v zóně, kde je téměř neviditelný. Displej lze plně odkrýt jen užším/vyšším ořezem (viz zavržený pokus výše), který ale oříznutím rozvaděče mění charakter fotky. Pokud by uživatelka chtěla displej vidět A zachovat širší záběr zároveň, řešením by bylo upravit práh masky (`mask-image` na `.band-photo` v mobilním bloku) tak, aby odkrývala fotku od nižšího procenta (např. 25 % místo 40 %) – zatím neprovedeno, čeká na rozhodnutí, protože to může zhoršit čitelnost textu nad fotkou.
- **Fotka v pásu pohotovosti – nahrazena vlastní fotkou s dostatkem prostoru nad multimetrem.** Uživatelka doplnila do `Obrazky/Pohotovost/pohotovost-4.jpg` novou (vlastní, vysoké rozlišení 5472×3648) fotku téhož multimetru, tentokrát s mnohem větším odstupem nad přístrojem (technik, helma, rozvaděč nahoře) – na rozdíl od dřívějšího úzkého stock-banneru (`pohotovost-band.jpg`, 1800×649) tu konečně byl prostor obojí zároveň: displej i širší záběr s rozvaděčem. Nový ořez `(2350,1845,4000,2945)` → 1650×1100, zmenšeno na 900×600 pro `Obrazky/web/pohotovost-band-mobile.jpg`. Displej (v ořezu y≈550–800 z 1100, tj. ~50–73 % výšky) padne do viditelné/dofukované zóny masky (40–82 %), `background-position-x` doladěn na `23%`. Výsledek: displej multimetru i ciferník viditelné zároveň, plus rozmazaný (mimo ostrost fotografa) kousek rozvaděče vpravo. Ověřeno screenshotem, desktop (jiný soubor/pravidlo, `pohotovost-band.jpg` + `center 34%`) beze změny.
- **Fotka v pásu pohotovosti – oddáleno, ať jsou multimetr i rozvaděče vidět bez detailního přiblížení.** Nový, mnohem širší ořez ze stejné fotky (`pohotovost-4.jpg`): `(1984,100,5472,3400)` → 3488×3300 (skoro čtvercový, ne úzký panoramatický pás jako předtím), zmenšeno na 1200×1135 pro `pohotovost-band-mobile.jpg`. Ukazuje multimetr, celý bílý rozvaděč s jističi a kus tyrkysové rozvodné skříně vpravo – žádný detail, spíš celkový záběr. `background-position-x` přepočítán na `52%` (menší přesah do stran než u předchozích užších ořezů, protože tento crop má aspect ratio blíž boxu, cover má míň vodorovné rezervy k posunu). Ověřeno screenshotem, desktop beze změny.
- **Fotka v pásu pohotovosti – rozvodná skříň odstraněna ze záběru.** Uživatelka chtěla jen ruku, multimetr a jističe, bez tyrkysové rozvodné skříně. Ořez zúžen z `(1984,100,5472,3400)` na `(1984,100,4250,3400)` (2266×3300 místo 3488×3300 – jen pravá hranice, skříň začínala až za x=4250), zmenšeno na 850×1238. `background-position-x` zpět na `50%` (aspect ořezu 0.687 je teď velmi blízko boxu 0.6475, takže cover má jen ~20px vodorovné rezervy, prakticky bez potřeby posunu). Ověřeno screenshotem, desktop beze změny.
- **Fotogalerie – vrácen rovný (nešikmý) řez na mobilu.** Diagonální řez z minulého kola (transform + clip-path na `:nth-child(3n±)`) způsoboval nový bílý pruh v BOKU některých fotek – transform posouval box jen vizuálně, ale sousední clip-path polygony se přesně nekryly s posunutou hranou, takže v místě švu problikávalo pozadí. Uživatelka požádala o návrat ke standardnímu rovnému oddělení. Řešení: celý blok `transform`/`clip-path` pro `.showcase-item:nth-child(...)` na mobilu smazán – zůstává jen základní `.showcase-gallery { grid-template-columns: repeat(3,1fr); gap:0 }`, což dává čistou mřížku 3×2 bez mezer i švů. Zmenšené odznaky ikon (`.showcase-tag` 2.25rem) z minulého kola zůstávají beze změny. Ověřeno `getBoundingClientRect` – všech 6 fotek má identickou velikost 130×173.3px, `clip-path:none`, `transform:none`. Desktop (šikmý řez, `--showcase-skew:2rem`) beze změny.

## O webu

Statická marketingová prezentace firmy Raška engineering s.r.o. (elektroinstalace, fotovoltaika, průmysl). Žádný build systém – čisté `index.html` + `style.css` + `script.js`, obrázky ve složce `Obrazky/`. Testuje se přímo přes `file://`.

## Designový systém – konvence pro novou stránku (co není zřejmé z běžného zadání)

Než se navrhne nová stránka/sekce v duchu stávajícího designu, tohle je potřeba dodržet – běžné zadání ("modrá firma, oranžové CTA") tyhle detaily nepokryje:

1. **Tři responsive vrstvy, ne dvě.** Web se nedělá jen pro "mobil + desktop", ale pro tři pásma se skutečně odlišným layoutem: mobil `≤767px`, tablet `768–1023px`, desktop `≥1024px` (viz `--header-height`, sekce 15/16 v `style.css`). Navíc existuje jedna účelová výjimka: hero má ještě mezikrok `1024–1399px` ("menší notebooky"), protože `.container` (85 %, max 1280px) na těchto šířkách nechává jinou mezeru než na širokých monitorech. Drobné doladění jsou i na `480px` (`.nav-phone-cta` se objeví) a `640px` (grid sloupce). Nová sekce by měla od začátku počítat s vlastním chováním na všech třech hlavních pásmech, ne se spoléhat, že tablet "to zdědí" z desktopu – přesně tohle byl kořen skoro všech tabletových oprav v tomhle sezení.
2. **Standardní vertikální padding sekce** (viz "Pravidla pro budoucí práci" výše): mobil `var(--section-padding-mobile)`=48px, tablet `var(--space-16)`=64px, desktop laděno individuálně (48–112px podle důrazu sekce). Nová sekce má tohle dodržet, ne si vymýšlet vlastní hodnotu.
3. **Container / full-bleed trik.** `.container` = 85 % šířky, max 1280px, `margin-inline:auto`. Několik prvků ale záměrně "prokoukne" mimo container na celou šířku obrazovky (`left:50%; width:100vw; transform:translateX(-50%)` nebo přímo `width:100vw; margin-left:calc(50% - 50vw)`) – používá se u `.showcase-gallery` (galerie realizací) a u gradientového pozadí hero textu na tabletu (`.hero-inner::before`). Kdykoli je vidět "pruh přes celou šířku obrazovky uvnitř jinak vycentrované stránky", jde o tenhle vzor, ne o vlastní layout.
4. **`--tunnel-inset` pro fotku-vlevo/text-vpravo layouty.** Sekce "O nás" (`.about-content`) počítá svůj boční padding jako `calc((100% - min(var(--container-width), var(--container-max))) / 2)` – tj. i když sekce sama je full-bleed (bez `.container`), text uvnitř zůstává zarovnaný na stejnou neviditelnou osu jako `.container` obsah nad/pod ní. Používat všude, kde má full-bleed sekce obsahovat text zarovnaný s containerem.
5. **Karty jsou "glass" (sklo), ne plná bílá.** Skleněné karty (`.service-card`, `.feature-item`, `.contact-form-card`, hlavička/mobilní menu) mají všechny stejnou recepturu: `background: rgba(255,255,255,0.5)`, `backdrop-filter: blur(28px) saturate(160%)` (u hlavičky jen `blur(10–20px)` bez saturate), `border: 0.5px solid rgba(255,255,255,0.12)`, `box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.18)`. Nová karta v tomhle stylu musí použít stejnou kombinaci, ne jen `background:white`.
6. **Karty přesahující přes hranu předchozí sekce.** `.services-overlap` má záporný `margin-top` (mění se podle šířky, teď navíc tabletová výjimka `-6rem` jen na peek přes zkrácenou hero fotku) – to je záměrný "přesah" vzor, používaný jen mezi hero a kartami služeb. Nekopírovat mechanicky jinam bez rozmyslu, kolik má karta "vykukovat".
7. **Diagonální řez (`clip-path: polygon(...)`) se používá na dvou místech** – `.about-media` (fotka O nás na desktopu) a `.showcase-gallery` (galerie realizací od 768px). Na mobilu je diagonála buď vypnutá (O nás – nemá na mobilu žádný `clip-path`, jde o normální obdélník), nebo zmenšená na jemnější úhel (`--showcase-skew-m` u galerie) – nikdy stejná hodnota skewu jako na desktopu, protože na úzké fotce by uřízla příliš.
8. **Dva odlišné gradienty pro dvě barevné role**, nezaměňovat: modrý "brand" gradient sekcí/pozadí je `linear-gradient(160deg, primary-dark 0%, primary-dark 55%, primary 100%)` (hero, případně `115deg`/`165deg` varianty u `.band`/mobilního menu – směr úhlu se mezi komponentami mírně liší, ale vždy primary-dark→primary). Oranžový CTA gradient je vždy `135deg, accent 0%, accent-dark 100%` (ikony, `.btn-accent` používá `90deg` variantu). Nekombinovat směry/barvy nahodile.
9. **Tlačítka: `border: 2px solid transparent` na base `.btn`, i tam, kde tlačítko žádný viditelný rámeček nemá.** Díky tomu můžou varianty jako `.btn-outline-dark` na hoveru nastavit `border-color: transparent` a nechat gradientovou výplň vyplnit i prostor pod rámečkem beze švu (viz "Sekundární tlačítka" výše) – nová varianta tlačítka s barevným rámečkem + hover výplní musí tenhle vzor dodržet, jinak vznikne viditelný lem.
10. **Ikony: dva systémy vedle sebe.** UI ikony (šipka, telefon, menu, zavřít, sociální sítě) jsou inline SVG sprite (`<symbol id="icon-...">` v `<svg style="display:none">` na začátku `<body>`, použití přes `<use href="#icon-x">`). Fotografické/produktové ikony (elektro, fotovoltaika, průmysl, feature-item ikony) jsou samostatné PNG soubory v `Obrazky/web/`. Nová ikona v UI kontextu (tlačítko, nav) patří do SVG sprite; nová "kategorie/obor" ikona do PNG po vzoru stávajících.
11. **Scroll-reveal animace přes `data-reveal`** – atribut na kontejneru (ne na jednotlivých dětech), `IntersectionObserver` v `script.js` přidává `.is-visible`, CSS definuje jen počáteční/cílový stav (`[data-reveal]` → `[data-reveal].is-visible`). Vždy respektovat `@media (prefers-reduced-motion: reduce)` (animace úplně vypnutá). Nová sekce, která má "najet" při scrollu, přidá jen atribut `data-reveal` na svůj wrapper, ne vlastní animaci.
12. **Fixní hlavička vyžaduje offset všude, kde se na sekci skáče kotvou.** `--header-height` (5.0625rem/81px) se přičítá k `padding-top` (hero) nebo k `scroll-margin-top` (kotvy typu `#sluzby`). Nová sekce s vlastní kotvou (menu odkaz, "Zjistit více" apod.) musí mít `scroll-margin-top: calc(var(--header-height) + odstup)`, jinak jí po scrollu bude horní část schovaná pod menu – přesně tenhle bug se řešil u tlačítka "Naše služby".
13. **Fotky pro různé breakpointy jsou často samostatné, předem oříznuté soubory, ne jen CSS `object-position`.** Hero a pohotovostní pás mají zvlášť `*-mobile.jpg`/`*-desktop.jpg` verze (přesné pixelové ořezy dohledané vzorkováním barev, ne odhadem) – `object-fit:cover` s jedním obrázkem přes všechny šířky často nestačí (viz "Hero fotokoláž" a "Rozměry hero pozadí" výše). Nová fotografická sekce, kde se motiv na úzkých šířkách hodně ořeze, by měla rovnou počítat s vlastním mobilním/tabletovým výřezem, ne to řešit jen posunem `object-position`.

## Pravidla pro budoucí práci

- **Vertikální padding sekcí musí zůstat sladěný napříč breakpointy.** Při přidání/úpravě jakékoli obsahové sekce vždy zkontrolovat `padding-top`/`padding-bottom` (`getComputedStyle`) na desktopu, tabletu (768–1023px) i mobilu (≤767px) a porovnat s ostatními sekcemi na stejné šířce – ne se spoléhat na to, že `rem`-based hodnota napsaná pro desktop bude na tabletu vypadat konzistentně (viz "Sjednocení vertikálního paddingu sekcí na tabletu" níže, kde se to bez kontroly rozjelo na 48–112px). Aktuální standard: mobil `var(--section-padding-mobile)` (48px, sekce 15 v `style.css`), tablet `var(--space-16)` (64px, sekce 16), desktop dle sekce (48–112px, laděno individuálně). Výjimky (`.services-overlap` horní padding 0, `.showcase-section` dolní padding 0) jsou záměrné – u nové sekce podobnou výjimku zdůvodnit komentářem, ne nechat jako náhodu.

## Struktura stránky (`index.html`)

1. **Hlavička** – sticky header, mobilní menu
2. **Hero** (`.hero`) – fotokoláž na pozadí + úvodní text
3. **Karty služeb** (`#sluzby`, `.services-overlap`) – přesahují přes ostrou hranu hero sekce do bílého pozadí (elektro / fotovoltaika / průmysl)
4. **Pohotovostní elektro služby** (`.band`)
5. **O nás** (`.about-section`)
6. **Naše realizace** (`.showcase-section`) – galerie s lightboxem
7. **CTA pás před kontaktem** (`.showcase-cta-band`)
8. **Kontakt** (`#poptavka`) – formulář s honeypot antispamem
9. **Patička**
10. **Cookie lišta** (Přijmout / Odmítnout / Nastavit, ukládá se do `localStorage`)
11. **Lightbox galerie realizací**

`script.js` řeší: sticky header, mobilní menu, scroll-reveal animace (`data-reveal` + IntersectionObserver), cookie lištu, lightbox galerie, honeypot kontrolu formuláře.

## Hero fotokoláž – hlavní rozpracovaná věc tohoto sezení

Hero pozadí NENÍ tvořeno CSS clip-path panely, ale dvěma hotovými (zploštělými) JPG obrázky bez editovatelných vrstev:

- `Obrazky/web/hero-collage-desktop.jpg` (2400×2000)
- `Obrazky/web/hero-collage-mobile.jpg` (1200×2200)

Každý zobrazuje 4-panelovou diagonální koláž: plná modrá (brand) → elektro closeup → fotovoltaika → průmysl.

### Aktuální (finální) stav desktop koláže

- **Elektro panel** – beze změny, původní.
- **Fotovoltaika panel** – ořez `(1600, 820, 2280, 2680)` ze zdroje `Obrazky/kolaz/aerial-view-private-house-with-solar-panels-roof.jpg`, resize na 725×2000. Iterativně doladěno na max. počet panelů, bez oken/vikýře, s malým (uživatelem odsouhlaseným) kouskem tašek v levém dolním rohu. **Uživatel potvrdil: "fotovoltaika je teď super."**
- **Průmysl panel** – ořez `(374, 100, 1282, 3104)` ze zdroje `Obrazky/kolaz/closeup-view-cylindrical-grinder-industrial-concept.jpg` (potrubí/ventily), resize na 595×2000. Mezitím se zkoušela i nová fotka `Obrazky/kolaz/prumysl.jpg` (extrudovací linka s oranžovým násypkou), ale uživatel se rozhodl **vrátit zpět na fotku s potrubím** – to je aktuální stav. `prumysl.jpg` zůstává ve složce pro případné budoucí použití, momentálně se nepoužívá.
- **Stínování švů** – na obě diagonální hrany (elektro/fotovoltaika a fotovoltaika/průmysl) je aplikován jemný multiplikativní gradient (numpy), simulující vržený stín, konzistentní s přirozeným stínem na původním švu panel1/panel2.
- **Mobilní koláž byla v tomto sezení nahrazena** – viz sekce "Mobilní úpravy – toto sezení" výše: nový `hero-photos-mobile.jpg` (jen 3 fotopanely, bez modré, 1200×714) nahradil starý `hero-collage-mobile.jpg` (1200×2200, s modrou nahoře) coby zdroj mobilního `<img>` v hero sekci. Starý soubor zůstává v `Obrazky/web/` nepoužitý.

### Poznámka k souborům

Ve složce `Obrazky/web/` existují záložní kopie `hero-collage-desktop (kopie).jpg` a `hero-collage-mobile (kopie).jpg` – jde o zálohy před poslední úpravou, lze je smazat, až bude finální stav definitivně odsouhlasen.

### Geometrie koláže (pro budoucí úpravy)

Desktop: jeden konzistentní sklon švu `x(y) = x0 − 0.13·y` napříč celou koláží (ověřeno na čistém švu modrá/elektro). Panel průmysl má pravou hranu rovnou (okraj obrázku), levou diagonální podle vzorce. Přesné vzorce švů použité v tomto sezení:
- `seam23(y) = 1600 - 0.13*y` (elektro/fotovoltaika)
- `seam34(y) = 2065 - 0.13*y` (fotovoltaika/průmysl)

Mobil: fotopás začíná vodorovnou hranou na y=1320, dolů k y=2200; švy diagonální se stejným principem.

Podrobný postup (crop → mask → paste → shadow gradient) je uložen v projektové paměti (`project_hero_collage.md`), včetně důležitého pravidla: při přebarvování jednoho panelu je nutné vždy čerstvě překreslit OBA sousední panely v jednom průchodu a teprve poté aplikovat stín přes oba švy – jinak hrozí zdvojení stínu na již hotovém sousedním panelu.

## Rozměry hero pozadí (informační zjištění z tohoto sezení)

Desktop šířka koláže 2400 px je v pořádku; minimální potřebná výška byla dopočítána ze CSS formulí `.hero` / `.hero-media` / `.hero-inner` (min-height `100vh + Nrem` dle breakpointu) tak, aby obrázek pokryl i nejvyšší běžné monitory bez roztažení.

## Tabletové úpravy – toto sezení

**Vyřešeno – přesah hero fotky přes tlačítko telefonu:** Uživatelka požádala o doladění hero sekce na tabletu. Diagnostika (Playwright na šířkách 768–1440px + pixelové vzorkování) odhalila, že obrysové tlačítko `+420 733 686 898` (`.hero-actions`) leží velkou částí přes fotku jističů z koláže (`.hero-media`), s velmi špatným kontrastem bílého textu na světlém plastu jističe – **problém sahal od 768px až do ~1400px**, tedy nejen tablety, ale i běžné notebooky (1280×800, 1366×768).

Příčina: sloupec s textem (`.hero-content`, `max-width: clamp(29rem, 20vw, 32rem)` – v tomto rozsahu šířek se `clamp` prakticky vždy ustálí na pevných 29rem, protože `20vw` je menší) má šířku prakticky nezávislou na okně, zatímco `.hero-media` je vždy nalepená na PRAVÝ okraj celé obrazovky (`right:0; width:100%`) – velký "gutter" mezi textem a fotkou vzniká teprve když `.container` (85% šířky, max 1280px) přestane růst 1:1 s oknem, což je až kolem ~1400–1440px.

Oprava (`style.css`, sekce 6 Hero, nový blok `@media (min-width:768px) and (max-width:1399px)`): `.hero-media` dostala pevný `left: 34rem` (544px) místo `width:100%` (šířka teď `auto`, `right:0` zůstává) – levý okraj koláže je tak vždy dost daleko napravo, aby nezasahoval pod tlačítka, a šířka viditelné fotky přirozeně roste s šířkou okna. Ověřeno screenshoty i výpočtem (`mediaLeft` vs. `phoneRight`) na 768/820/900/1024/1200/1366/1399px (vše čisté) i na hranicích 1400/1440px a mobilu 767px (beze změny oproti původnímu stavu).

**Otevřené:** stejný přesah (do ~1400px) technicky existuje i na běžných noteboocích – uživatelka žádala jen o tablet, ale oprava řeší oba případy najednou (jde o stejné pravidlo/rozsah).

**Přepracováno na základě zpětné vazby – zúžená koláž ukazovala jen elektro panel:** Uživatelka nahlásila, že po předchozí opravě je na tabletu vidět jen tenký svislý pruh elektro panelu a zbytek koláže (fotovoltaika, průmysl) je skrytý – chtěla stejný princip jako na mobilu (text přes celou modrou plochu, koláž jako pruh POD textem).

Řešení rozdělené na dva rozsahy podle toho, co se u obou reálně osvědčilo:
- **768–1023px (tablet, `style.css` nový blok na konci sekce 6 Hero):** `.hero-content{max-width:none}` (text se roztáhne přes celou šířku), `.hero-inner` dostal stejnou strukturu jako mobil (`width:100%`, zrušená velká `min-height` rezerva, padding nahoře/dole), `.hero-media` přestala být `position:absolute` full-bleed pozadí a stala se normálním blokem (`position:relative; width:100%; aspect-ratio:12/5;`) v běžném toku hned pod textem – širší (méně vysoký) poměr stran než mobilní `1200/1524`, protože tablet má na šířku mnohem víc místa. Žádný nový obrázek nebyl potřeba – použita stejná `hero-collage-desktop.jpg` (přes `<picture>` `srcset` pro `min-width:768px`), `object-fit:cover` s výchozím `object-position:center center` ukazuje vodorovný pruh přes celou koláž (elektro + fotovoltaika + část průmyslu).
- **1024–1399px (menší notebooky):** ponechána oprava z předchozího kola (`.hero-media{left:34rem;width:auto}`, koláž zůstává vedle textu jako na desktopu) – na těchto šířkách bylo vedle sebe vidět dost fotky (celá diagonála, všechny 3 panely), takže tam přestavba na "mobilní" pruh nebyla potřeba ani žádoucí.

Ověřeno screenshoty na 768, 820, 1023px (nový skládaný layout, koláž viditelná celá) i na 1024px landscape a 1440px desktop (obojí beze změny oproti předchozímu stavu).

**Opraveny dvě chyby nalezené uživatelkou hned po nasazení výše:**
1. **Nadpis byl schovaný pod fixní hlavičkou.** Příčina: `padding-top`/`padding-bottom` v novém tabletovém bloku používaly `var(--space-10))` – token `--space-10` v tomto projektu vůbec neexistuje (škála skáče `space-8`→`space-12`), takže celý neplatný `calc()` spadl na `0px` (potvrzeno `getComputedStyle` – `padding-top` byl skutečně `0px` místo očekávaných ~129px). Oprava: nahrazeno existujícím `var(--space-12)` na všech třech místech (`.hero-inner` padding-top/-bottom, `.hero-media` margin-top).
2. **V pruhu koláže byla vidět i modrá plocha.** Příčina: `<picture>` v `index.html` měl jediný zdroj `<source media="(min-width:768px)" srcset="hero-collage-desktop.jpg">` – tablet tedy dostával STEJNÝ obrázek jako desktop (celou koláž včetně modrého panelu 1), a protože nový box je širší (`aspect-ratio:12/5`) než tento obrázek (2400×2000), `object-fit:cover` ořezával jen svisle a modrý panel zůstal vždy vidět vlevo. Oprava: přidán mezistupeň zdroje – `<source media="(min-width:1024px)" srcset="hero-collage-desktop.jpg">` (celá koláž jen od desktopu) + `<source media="(min-width:768px)" srcset="hero-photos-mobile.jpg">` (768–1023px dostává STEJNÝ, už jednou oříznutý obrázek bez modré, co používá mobil) – zdroje se vyhodnocují shora dolů, takže na 1024px+ vyhraje první (celá koláž), na 768–1023px druhý (bez modré), pod 768px se použije `<img>` fallback (týž soubor).

Obojí ověřeno přes `getComputedStyle`/`currentSrc` i screenshoty na 768/820/900/1023px (nadpis celý pod hlavičkou, žádná modrá v pruhu) a zpětně na 767/1024/1440px (beze změny).

## Mobilní menu – telefonní tlačítko

**Vyřešeno:** V rozklikávacím mobilním menu (`#mobilni-menu`) byl telefonní kontakt jen prostý odkaz s ikonou (`.phone-link.phone-link--mobile`), zatímco uživatelka chtěla stejné oranžové tlačítko jako v hlavičce desktopu (`.nav-phone-cta`, `.btn.btn-accent`).

- `index.html`: odkaz přepsán z `<a class="phone-link phone-link--mobile">` na `<a class="btn btn-accent btn-block">` (stejné třídy jako tlačítko "Nezávazná poptávka" pod ním).
- `style.css`: nepoužívané třídy `.phone-link` a `.phone-link--mobile` (byly jen na tomto jednom místě) smazány.
- **Nalezená a opravená druhá chyba:** po prostém přidání tříd `.btn` se tlačítko zobrazilo rozbité (ikona nad textem na dvou řádcích, bez paddingu) – příčina: `.mobile-nav a { display:block; font-size:1.25rem; padding: var(--space-4) 0; border-bottom: ...}` má vyšší specificitu (třída+element) než `.btn` (jen třída), takže přebilo flex zarovnání i padding tlačítka. Oprava: nové pravidlo `.mobile-nav a.btn` (vyšší specificita než obě) vrací `display:inline-flex; align-items:center; justify-content:center`, padding shodný s `.btn-accent` (`padding-block/inline: calc(0.7rem/1.4rem + 2px)`), `font-size:1rem`, `border-bottom:none`, plus `margin-bottom: var(--space-4)` pro odstup od tlačítka "Nezávazná poptávka" pod ním.

Ověřeno screenshoty na 320/375/430/767px (žádné horizontální přetečení, tlačítko vycentrované, stejný styl jako "Nezávazná poptávka") i na desktopu 1440px (hlavičkové `.nav-phone-cta` beze změny).

**Doplněno:** tlačítko "Nezávazná poptávka" v mobilním menu na žádost uživatelky odstraněno (`index.html`) – v menu teď zůstává jen telefonní tlačítko. `.mobile-nav a.btn { margin-bottom: var(--space-4) }` zůstává (odsazení od spodního paddingu menu), CSS beze změny.

## Patička – barva odkazu harmonickyweb.cz

**Vyřešeno:** Odkaz na tvůrce webu (`.footer-bottom a`) byl `var(--color-accent)` (oranžová), uživatelka chtěla jen jemně světlejší šedou než copyright text vedle něj (ten má `rgba(255,255,255,0.55)`). Změněno na `rgba(255,255,255,0.8)`. Platí pro všechny šířky (žádný media query se sem netrefuje).

## Scroll na tlačítko "Naše služby" (hero) – dojíždělo pod fixní hlavičku

**Vyřešeno:** Tlačítko `href="#sluzby"` v hero sekci scrollovalo tak, že vršek `#sluzby` (=.services-overlap, ikony první řady karet) přistál přesně na `y=0`, tedy schovaný pod fixní hlavičkou (81px / `--header-height: 5.0625rem`) – ikony a horní část karet byly useknuté. `#sluzby` nemělo žádný `scroll-margin-top`.

- **Fix:** `.services-overlap { scroll-margin-top: calc(var(--header-height) + var(--space-6)); }` – prohlížeč teď při scrollu na kotvu nechá pod hlavičkou ještě `--space-6` rezervu, takže je vidět celá první karta včetně ikony.
- Ověřeno Playwright kliknutím na tlačítko na 1440/768/390px šířky – `sectionRect.top` po scrollu ~105px (81px header + 24px rezerva) na všech třech, screenshoty potvrzují kompletní kartu i ikonu pod menu bez oříznutí.

## Sekundární tlačítka (.btn-outline-dark) – rámeček viditelný přes gradient na hoveru

**Vyřešeno:** U `.btn-outline-dark` ("Zjistit více" v kartách služeb) byl na hoveru rámeček pořád plnou barvou `var(--color-primary)`, zatímco výplň se měnila na gradient `var(--color-primary) → var(--color-primary-dark)` – na pravé straně tlačítka (kde gradient ztmavne) byl rámeček oproti výplni rozeznatelný.

- **Fix:** `.btn-outline-dark:hover { border-color: transparent; }` – base `.btn` má `border: 2px solid transparent` a výchozí `background-clip: border-box`, takže s průhledným rámečkem gradient vyplní i prostor pod ním a švík zmizí.
- Ověřeno Playwright screenshotem hoveru – rámeček splývá s výplní, normální (nehover) stav beze změny. `.btn-outline` (varianta na tmavém pozadí, používaná jinde) stejný problém nemá, tam se barva rámečku na hoveru sladěně mění spolu s výplní.

## Tablet hero – druhé kolo doladění (paddingy, gradient, rozestupy, výška fotky, přesah karty)

Uživatelka nahlásila pět věcí na tabletovém (768–1023px) hero po předchozí přestavbě na "mobilní" skládaný layout:

1. **Jiné paddingy kolem textu.** `.hero-inner` měl pevný `padding-inline: var(--space-8)` (32px) místo běžného chování `.container` (85% šířky, max 1280px) – dávalo to textu o ~26px víc místa než mají karty služeb pod ním (`.services-overlap .container`), takže levý/pravý okraj textu s ničím pod sebou nelícoval (na 768px: text od x=32, karty od x=57.6). **Fix:** `width/max-width/padding-inline` přebití z `.hero-inner` u tabletu odstraněno – necháno na běžném `.container`. Aby to nerozbilo `.hero-content .eyebrow { white-space:nowrap }` (vynucené na jeden řádek pro úzký desktopový sloupec vedle koláže, zděděné i do tabletu), přidáno `white-space: normal` – bez postranního sloupce už nehrozí zalomení uprostřed slova a chová se to stejně jako na mobilu (kde `nowrap` nikdy neplatilo).
2. **Gradient z hero pozadí nebyl vidět.** `.hero` má `linear-gradient(160deg, primary-dark 0%, primary-dark 55%, primary 100%)`, ale na tabletu `.hero-media` není `position:absolute` (jako na desktopu), nýbrž běžný blok v toku – prodlužuje tak celkovou výšku `.hero` o výšku fotky. Světlejší konec gradientu (55–100 %) proto vycházel na oblast schovanou za neprůhlednou fotkou a nad textem zůstávala jen plochá tmavá barva. **Fix:** stejný gradient přesunut na `.hero-inner::before` – `position:absolute; top:0; bottom:0` (= přesně výška textové zóny) + `left:50%; width:100vw; transform:translateX(-50%)` (trik na "prokouknutí" z 85%-container šířky do celé obrazovky, jinak by na okraji `.hero-inner` vznikl viditelný šev proti ploché barvě `.hero` za ním – ověřeno a opraveno, první verze bez tohoto tricku měla viditelný obdélníkový obrys).
3. **Velká mezera mezi textem a tlačítky / nesladěné rozestupy.** Eyebrow→nadpis→text→tlačítka měly 24/32/64px (nekonzistentní, `.hero-actions margin-top: var(--space-12)=48px` navíc ve flexu NEkoluje s `.lead margin-bottom`, ale sčítá se – `.hero-content` je `flex-direction:column`). **Fix:** `.hero-content h1{margin-bottom:var(--space-6)}`, `.hero-content .lead{margin-bottom:0}`, `.hero-actions{margin-top:var(--space-6)}` – všechny tři mezery teď rovných 24px.
4. **Hero fotky moc nízké.** `.hero-media{aspect-ratio:12/5}` (2.4, na šířku) na zdrojovém `hero-photos-mobile.jpg` (1200×1905, poměr 0.787) ukazoval přes `object-fit:cover` jen prostřední ~33 % výšky obrázku – silně "seříznutý" pohled na všechny tři panely (elektro/FV/průmysl). **Fix:** `aspect-ratio: 4/3` – ukáže se ~60 % výšky, panely jsou čitelnější.
5. **Karty mají jen "kouknout".** `.services-overlap` dědil `margin-top:-9.6rem` (153.6px) ze společného pravidla pro 768px+ – v kombinaci s vyšší fotkou (bod 4) by to znamenalo ještě větší zásah do fotky. **Fix:** tabletu vlastní `margin-top: -3rem` (48px) – jen zaoblený vršek karty s ikonou vykoukne přes spodní okraj fotky, zbytek karty je až v běžném bílém toku pod ní.

Ověřeno Playwright screenshoty na 768 a 1023px šířky (paddingy lícují s kartami, gradient plynulý bez švu, rozestupy 24/24/24px, fotka ~576–767px vysoká, karta kouká jen ~48px) a zpětně na mobilu (390px) a desktopu (1024/1366/1440px) – všude beze změny oproti předchozímu stavu.

**Třetí kolo (na základě screenshotu od uživatelky):** po nasazení výše se objevily tři nové připomínky.

- **Viditelná modrá čára na rozhraní hero/fotka.** Mezera před fotkou byla rozdělená na dvě části – `.hero-inner` `padding-bottom: var(--space-12)` (kryté gradientem z `::before`) + samostatný `.hero-media margin-top: var(--space-12)` (mimo `.hero-inner`, kryté jen plochou barvou `.hero`) – na jejich rozhraní vznikl ostrý přechod ze světlé (konec gradientu) do tmavé (plochá barva). **Fix:** celá mezera (96px) přesunuta do `.hero-inner{padding-bottom: var(--space-24)}`, `.hero-media` už nemá vlastní `margin-top` – všechno je teď v jedné, gradientem kryté ploše, žádný švík.
- **Karty nevylézaly.** `-3rem` přesah byl tak malý (48px), že přes vyšší fotku (bod 4 výše) působil jako by karta vůbec nevyčuhovala. **Fix:** `.services-overlap margin-top: -6rem` (96px) – zřetelný, ale ne přehnaný peek (ověřeno screenshotem na 768 i 1023px – vidět celá ikona a začátek nadpisu karty nad bílou plochou).
- **Text moc nahustonahuštěný.** Sjednocené rozestupy z předchozího kola (24px/`--space-6`) byly na vkus uživatelky příliš těsné. **Fix:** zvětšeno na 32px/`--space-8` u všech čtyř mezer (eyebrow mb, h1 mb, lead mb→actions mt) – pořád jednotné, jen vzdušnější.

Ověřeno znovu na 768/1023px (bez švu, karta zřetelně kouká, mezery 32/32/32px) a zpětně na mobilu a desktopu (beze změny).

**Čtvrté kolo:** dva další požadavky.

- **Nesouměrný padding nahoře/dole kolem hero textu.** Viditelná mezera nad eyebrow (`padding-top` minus `--header-height`, tedy jen `--space-12`=48px) neodpovídala mezeře pod tlačítky před fotkou (`padding-bottom: var(--space-24)`=96px, zavedeno ve 3. kole kvůli švu). **Fix:** `padding-bottom` zpátky na `var(--space-12)` (48px) – teď stejné jako nahoře. Mezera před fotkou se tím zmenšila ze 96 na 48px, ale zůstává celá uvnitř `.hero-inner` (kryté gradientem), takže se švík z 3. kola nevrátil.
- **Karty pořád nevylézaly dost.** I s `-6rem` přesahem (96px) to na vyšší fotce (aspect-ratio 4/3, 576–767px) vypadalo jako málo – 96px je vůči takové výšce jen 12–17 %. **Fix (podle instrukce uživatelky "zkrátit koláž"):** `aspect-ratio` zmenšen ze 4/3 na `3/2` (fotka 512–682px vysoká, pořád ukazuje ~52 % výšky zdrojové koláže místo původních ~33 % u 12/5) – při stejném 96px přesahu je karta vůči nižší fotce vizuálně mnohem víc "venku".

Ověřeno na 768 a 1023px (padding nahoře/dole shodný, karta zřetelně přesahuje přes kratší fotku) a zpětně na mobilu a desktopu (beze změny).

**Páté kolo:** uživatelce se ten menší (48px) padding nelíbil o nic víc než nesouměrný – chtěla radši ten původní větší, ale na obou stranách stejně. **Fix:** `padding-top: calc(--header-height + var(--space-24))`, `padding-bottom: var(--space-24)` – oboje 96px viditelně (nahoře k tomu navíc `--header-height` pro fixní hlavičku). Mezera před fotkou je pořád celá uvnitř `.hero-inner` (žádný švík), přesah karty (96px) i poměr fotky (3/2) beze změny. Ověřeno na 768/1023px a zpětně na mobilu/desktopu (beze změny).

**Šesté kolo:** poslední připomínka – ve výřezu koláže (aspect-ratio 3/2, `object-position` dosud výchozí `center center`) bylo vidět moc z vrchu obrázku (horní část elektro rozvaděče) a málo ze středu (fotovoltaika). **Fix:** `.hero-media img { object-position: center 65%; }` (jen v tabletovém bloku, stejná specificita/pořadí jako ostatní přebití) – posune viditelné okno níž ve zdrojovém obrázku, takže je víc vidět fotovoltaika a průmysl, míň horní okraj rozvaděče. Netýká se mobilu (tam `object-position` nemá efekt, box = poměr zdroje 1:1) ani desktopu (jiný obrázek `hero-collage-desktop.jpg`, jiný box). Ověřeno na 768/1023px a zpětně na mobilu/desktopu (beze změny).

## Karta pohotovosti (.band) na tabletu – přeuspořádáno jako na mobilu

Obecné pravidlo `@media(min-width:768px){.band-inner{flex-direction:row;...}}` platilo od 768px výš, takže tablet zdědil ŘÁDKOVÉ uspořádání z desktopu (ikona/text/tlačítko vedle sebe, diagonální maska na širokoúhlé fotce `pohotovost-band.jpg` 1800×649) – na tabletové šířce to bylo přehuštěné: text se lámal do mnoha úzkých řádků, tlačítko i fotka byly stěsnané doprostřed karty (viz `band-t768.png`/`band-t1023.png` před fixem v historii konverzace).

**Fix:** nový blok `@media (min-width:768px) and (max-width:1023px)` vrací `.band-inner` na stejné SVISLÉ uspořádání jako na mobilu (`flex-direction:column; align-items:flex-start; gap:var(--space-6); padding:var(--space-8)`) a `.band-photo` na stejný svislý ořez/masku a mobilní crop `pohotovost-band-mobile.jpg` (850×1238) – širokoúhlá desktopová fotka by se na vysoké kartě přes `cover` ořízla jen vodorovně a svislá maska by nikdy nic neodkryla. Jediný rozdíl oproti mobilu: `min-height: 26rem` místo mobilních `32rem` – širší tabletový sloupec zalomí text do míň řádků, takže by stejná výška jako na mobilu zbytečně nechala prázdnotu nad fotkou.

Ověřeno screenshoty na 768/1023px (ikona/nadpis/text nahoře, tlačítko pod tím, fotka čitelná dole) a zpětně na mobilu (390px) a desktopu (1024/1440px) – beze změny, pořád řádkové uspořádání s diagonální maskou.

**Druhé kolo:** dvě doladění stejné karty na tabletu.

- **Multimetr nebyl vidět.** `.band-photo` `background-position` zděděné z mobilního fixu bylo `50% center` (svisle na střed) – tabletová karta je ale mnohem širší než mobilní sloupec, takže `cover` z fotky (850×1238) ukazuje jen ~44 % její výšky, a střed padá na řady jističů uprostřed obrázku, ne na multimetr v ruce dole. **Fix:** Y posunuto na `50% 85%` – stejná velikost/zoom (pořád `cover`, žádné přiblížení), jen jiné okno v tomtéž rámu, posunuté níž, takže je multimetr zase vidět (spolu s kouskem rozvaděče nad ním pro kontext).
- **Tlačítko doprava.** `.band .btn-pulse { align-self: flex-end; }` v tabletovém bloku – `.band-inner` je `flex-direction:column; align-items:flex-start`, tohle přebíjí zarovnání jen pro tlačítko, zbytek (ikona, nadpis, text) zůstává vlevo.

Ověřeno na 768/1023px (multimetr viditelný v kontextu rozvaděče, tlačítko vpravo dole) a zpětně na mobilu a desktopu (beze změny).

## Sekce "O nás" na tabletu – logo a karty jako na mobilu

Strukturně už `.about-split` na tabletu (768–1023px) BYLA stejná jako na mobilu (žádné pravidlo mezi mobilem a 1024px layout mění – text → fotka na celou šířku v běžném toku, `flex`/`clip-path` row layout je jen `min-width:1024px`). Dva konkrétní kusy ale chyběly:

- **Watermark logo Raška nebylo vidět.** `.about-watermark` mělo tabletu vlastní pravidlo jen na `max-width:767px` (`bottom: calc(75vw + var(--space-2))` — počítá s fotkou na celou šířku obrazovky, `aspect-ratio:4/3`). Na tabletu se místo toho použila výchozí (desktopová) hodnota `bottom:3.5rem`, počítaná pro `.about-split` s `min-height:36rem` z 1024px+ layoutu — na tabletu bez téhle výšky skončilo logo schované dole v samotné fotce, kde ho kvůli `opacity:0.2` nebylo přes fotku vůbec vidět. **Fix:** rozšířen mediální dotaz z `max-width:767px` na `max-width:1023px` – stejný vzorec (`75vw` = výška full-bleed fotky se `4/3` poměrem) platí na tabletu stejně dobře, protože `.about-media` je full-bleed (bez `.container`) na obou šířkách.
- **4 karty vedle sebe v jednom stěsnaném řádku.** `@media(min-width:640px){.feature-grid{grid-template-columns:repeat(4,1fr)}}` platilo od 640px výš (tablet i desktop) – na tabletu byly karty úzké, text se lámal do mnoha řádků. **Fix:** nové pravidlo `@media(min-width:768px) and (max-width:1023px){.feature-grid{grid-template-columns:repeat(2,1fr)}}` – karty po dvou pod sebou (2×2).

Ověřeno na 768/1023px (logo viditelné nad fotkou, karty 2×2) a zpětně na mobilu (1 sloupec, logo na svém místě) a desktopu 1024/1440px (4 karty vedle sebe, logo beze změny).

**Druhé kolo:** fotka (`.about-media`, aspect-ratio 4/3 na celou šířku obrazovky) byla na tabletu mnohem vyšší (576–767px podle šířky) než textový blok vedle "O nás" (`.about-content`, ~420px nezávisle na šířce) – uživatelka chtěla fotku nižší, jen o něco vyšší než text. **Fix:** `.about-media { aspect-ratio: auto; height: 28rem; }` (448px, pevná hodnota místo škálování se šířkou přes `aspect-ratio`) – místo `max-width:1023px` mediálního dotazu pro `.about-watermark` (zavedený v předchozím kole) znovu rozdělen zpátky na mobilní (`max-width:767px`, beze změny, pořád `75vw`-based formule pro fotku co škáluje se šířkou) a nový tabletový blok s `bottom: calc(28rem + var(--space-2))` – protože fotka už na tabletu neroste s `vw`, muselo se přepočítat i umístění loga nad ní.

Ověřeno na 768/1023px (fotka ~448px, jen mírně vyšší než text ~417–421px, logo pořád těsně nad fotkou) a zpětně na mobilu a desktopu (beze změny).

**Třetí kolo:** po zkrácení fotky (viz výše) bylo ve výřezu vidět zbytečně moc oblohy – sdílené pravidlo `.about-media img { object-position: left 35%; }` (platí na všech šířkách) bylo vychýlené směrem k vrchu fotky, a na nižším/širším tabletovém výřezu (`cover` ořízne jen málo svisle, protože box 768×448/1023×448 není o moc širší než poměr zdroje 4:3) to nechalo v okně hodně oblohy. **Fix:** `.about-media img { object-position: left 60%; }` jen v tabletovém bloku – posune okno níž ve zdroji (o kousek, ne na doraz), ať je víc auta/domu a míň oblohy; mobil a desktop mají jiný poměr fotky (jiné/žádné omezení výšky), takže tam sdílené `left 35%` zůstává beze změny.

Ověřeno na 768/1023px (méně oblohy, dům/auto výrazněji) a zpětně na mobilu a desktopu (beze změny).

## Galerie "Naše realizace" na tabletu – vyšší fotky

`@media(min-width:768px){.showcase-gallery{display:flex;...}}` platí od 768px výš (tablet i desktop) – všech 6 fotek vedle sebe v jednom diagonálně řezaném řádku, `.showcase-photo{aspect-ratio:3/4}`. Na desktopu (1440px) vychází sloupec ~240px široký → ~320px vysoký, v pořádku. Na tabletu je ale sloupec jen ~128–170px široký (768–1023px/6), takže při stejném poměru 3/4 vyšla fotka jen ~171–227px vysoká – nízký, "useknutý" pruh.

**Fix:** `@media(min-width:768px) and (max-width:1023px){.showcase-photo{aspect-ratio:3/6}}` – vyšší poměr jen pro tablet (počet sloupců i diagonální řez beze změny), fotky teď vychází ~256–341px vysoké.

Ověřeno na 768/1023px (výrazně vyšší, čitelnější fotky) a zpětně na mobilu (jiná pravidla, mřížka 3×2) a desktopu 1440px (beze změny, pořád aspect-ratio 3/4).

## Sjednocení vertikálního paddingu sekcí na tabletu

Uživatelka se ptala, jestli jsou paddingy sekcí napříč webem sladěné pro tablet (768–1023px) – v některých sekcích jí připadaly menší (hero záměrně mimo, viz zadání). Audit (`getComputedStyle` na `.services-overlap/.band/.about-section/.showcase-section/.showcase-cta-band/.contact-section`) potvrdil nesoulad – hodnoty jsou na tabletu identické s desktopem (žádné škálování v rámci 768–1023, jen `rem`-based): `.band` 48px, `.about-section`/`.showcase-section` 64px, `.contact-section` 96px, `.showcase-cta-band` 96/112px.

**Fix:** nový blok (sekce 16, na konci souboru vedle mobilního ekvivalentu ze sekce 15, kvůli cascade pořadí) sjednocuje `.band`, `.contact-section` a `.showcase-cta-band` na `var(--space-16)` (64px) jen pro 768–1023px – stejná hodnota, jakou už přirozeně mají `.section`/`.about-section`, takže žádná nová proměnná nebyla potřeba. `.services-overlap` (horní padding záměrně 0, karty přesahují přes hero) a `.showcase-section` (dolní padding záměrně 0, galerie navazuje na CTA pás bez mezery) ponechány beze změny – jde o úmyslný, ne nahodilý rozdíl.

Ověřeno `getComputedStyle` na 768/1023px – všech 6 zkoumaných sekcí teď 64/64px (kromě těch dvou záměrných výjimek) – a zpětně na mobilu (390px, beze změny, pořád vlastní 48px unifikace ze sekce 15) a desktopu (1024/1440px, beze změny, původní odstupňované hodnoty 48/64/96–112px).

**Uživatelka potvrdila jako doladěné.** Viz i nové standardní pravidlo v sekci "Pravidla pro budoucí práci" nahoře – padding sekcí hlídat na všech třech šířkách (desktop/tablet/mobil) při každé nové/upravené sekci, ne až dodatečně na vyžádání.

## Otevřené / nedořešené body

- Uživatel zatím nepotvrdil finální schválení posledního stavu průmysl panelu (návrat k fotce s potrubím) – čeká se na vizuální kontrolu.
- Rozhodnout, zda smazat záložní `(kopie)` soubory a nepoužitou `prumysl.jpg`, až bude vše definitivně odsouhlaseno.
- Mobilní verze koláže nebyla v tomto kole vůbec revidována – stojí za to ověřit, zda poslední úpravy (fotovoltaika, průmysl) chce uživatel promítnout i tam.
