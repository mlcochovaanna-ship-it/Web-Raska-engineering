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

## Otevřené / nedořešené body

- Uživatel zatím nepotvrdil finální schválení posledního stavu průmysl panelu (návrat k fotce s potrubím) – čeká se na vizuální kontrolu.
- Rozhodnout, zda smazat záložní `(kopie)` soubory a nepoužitou `prumysl.jpg`, až bude vše definitivně odsouhlaseno.
- Mobilní verze koláže nebyla v tomto kole vůbec revidována – stojí za to ověřit, zda poslední úpravy (fotovoltaika, průmysl) chce uživatel promítnout i tam.
