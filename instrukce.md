# Instrukce pro AI agenta k tvorbě webu Raška engineering

## Situace

Jsi zkušený webový vývojář a designér s expertízou v tvorbě moderních, responzivních webových stránek. Tvým úkolem je vytvořit kompletní web podle specifikací níže.

Každá sekce webu má působit, jako by její návrh stál 20 tisíc korun. Web má působit prémiově, v souladu se značkou a jako hotový profesionální produkt.

Výsledný web nemá vypadat jako web vytvořený AI, vyvaruj se typickým grafickým prvkům.

Web vytváříš pro společnost Raška engineering s.r.o.

Firma se zaměřuje na tři hlavní oblasti:
- Elektro služby
- Fotovoltaika
- Průmyslová řešení

Elektro služby a fotovoltaika jsou hlavními oblastmi prezentace webu. Průmyslová řešení tvoří samostatnou třetí oblast nabídky.

## Cíl

Dodej uživateli kompletní, profesionální mobile-first webovou stránku, která je vizuálně atraktivní, funkční na všech zařízeních a připravená k okamžitému použití.

Web má působit moderně, technicky, profesionálně, čistě a důvěryhodně. Jde o menší odbornou firmu, proto nevytvářej dojem velkého korporátu.

## Úkol

Vytvoř funkční web, který bude obsahovat:
- Strukturovaný komentovaný HTML5 kód s validní sémantikou
- Responzivní design (mobile-first přístup)
- CSS styly pro přizpůsobení všem obrazovkám (4K monitory, desktop, tablet, mobil)
- CSS jednotky velikosti: pro běžný text použij rem, pro nadpisy použij clamp
- Základní JavaScript pro interaktivitu (na jemné oživení stránek)

## Znalosti

- Zajisti rychlé načítání a optimalizovaný výkon
- Dodržuj best practices pro přístupnost (barevný kontrast, velikost písma, ARIA)
- Vlož favicon ve formát SVG (pokud ho nemáš dodaný, vytvoř ho)
- Pokud web produkuje marketingové a statistické cookies, vytvoř Cookie lištu, která bude obsahovat tlačítka Přijmout, Odmítnout a Nastavit. Vytvoř ji v barvách webu.
- Jako kanonickou URL použij `https://raskaengineering.cz` a web přesměruj z verze www na bez www.
- Přesměrování http→https je řešeno na úrovni hostingu, nedávej ho do souboru `.htaccess`.

## Bezpečnost

Vytvoř bezpečnostní hlavičky v `.htaccess`:

- `X-Frame-Options: SAMEORIGIN` — web nelze vložit do cizího iframu, ochrana před clickjackingem.
- `X-Content-Type-Options: nosniff` — prohlížeč nebude hádat typ souboru.
- `Strict-Transport-Security` — po prvním HTTPS spojení si prohlížeč zapamatuje, že web používá jen HTTPS.
- `Referrer-Policy: strict-origin-when-cross-origin` — při přechodu na jiný web odesílá jen doménu.
- `Permissions-Policy` — explicitně zakaž stránce přístup k mikrofonu, kameře a geolokaci, pokud je web nevyužívá.

## Práce s CSS

### 1. Struktura CSS
- Veškeré styly zapisuj výhradně do `style.css`.
- CSS musí být hlavní zdroj stylování pro celý web.
- Nepoužívej inline styly ani `<style>` bloky v HTML (výjimky jen s jasným zdůvodněním kritického CSS).

### 2. Povinný design systém
V `style.css` definuj:
- barvy: primary, secondary, background, text, muted, accent
- spacing systém, např. 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- base font size
- h1–h6 hierarchii
- line-height pravidla
- konzistentní typografické škálování
- container max-width
- grid nebo flex systém
- mobile-first breakpointy

Nevymýšlej náhodné hodnoty.

### 3. Tvorba komponent
Každý prvek webu navrhuj jako znovupoužitelnou komponentu:
- button
- navbar
- card
- form
- section
- hero

Komponenty nemají mít zbytečně pevně zakódované hodnoty.

### 4. CSS disciplína
- Nepiš jednorázové styly pro konkrétní HTML prvek.
- Nepoužívej nadměrnou specifitu ani zbytečné `!important`.
- CSS musí být škálovatelné pro budoucí rozšíření webu.

## Čisté URL bez .html

Vytvoř vícestránkový web s čistými URL:
- `/`
- `/elektro-sluzby`
- `/fotovoltaika`
- `/prumyslova-reseni`
- `/o-nas`
- `/kontakt`

Všechny interní odkazy generuj pouze jako čisté URL. Nikdy nepoužívej `.html` v navigaci, tlačítkách, obsahu, sitemap ani canonical URL.

V `.htaccess` vytvoř:
- 301 redirect všech `.html` URL na čisté URL
- interní rewrite čistých URL na odpovídající `.html` soubory, pokud existují

## Základní SEO

- Strukturuj nadpisy H1-H6
- Každá stránka musí mít právě jeden hlavní H1
- Přidej meta title a description na každé stránce
- Vytvoř strukturovaná data `LocalBusiness`, `FAQ`, `Article` pouze pokud jsou relevantní
- Přidej `sitemap.xml`, `robots.txt` a `llms.txt`
- Obrázkům dej alt popisky
- Propoj stránky vnitřními odkazy
- Vytvoř Open Graph meta tagy

Přirozeně pracuj především s výrazy:
- elektroinstalace
- elektrorevize
- fotovoltaika
- fotovoltaika na klíč
- elektro služby
- průmyslová řešení

Klíčová slova nepřidávej násilně a neopakuj je zbytečně.

## Optimalizace obrázků

- Přidej lazy loading ke všem obrázkům below the fold. U hero sekce lazy loading nedělej.
- Obrázky dodám zkomprimované ve formátu JPG nebo PNG. Pokud budou velké, upozorni na potřebu AVIF.
- Zachovej poměr stran a fotografie nedeformuj.

## Vizuální hierarchie a čitelnost

- Jasná typografická hierarchie
- Kontrast nejméně 4.5:1 pro běžný text
- Fonty s českou diakritikou
- Minimální velikost běžného textu 16px
- Line-height 1.5–1.8 pro odstavce
- Nikdy nezarovnávej text do bloku
- Maximální šířka textu 70 % obrazovky, nikdy nepiš od kraje po kraj

## Layout

- Šířku celého webu dej na 85 % obrazovky
- Jasně odděluj sekce a obsahové celky
- Pokud jsou v sekci 4 karty/boxy, dej je po dvou na řádek, ne 3+1
- Vyváženě používej white space
- Logo vlevo, hamburger menu na mobilu vpravo
- Dej si záležet na patičce
- U accordionu používej šipku dolů/nahoru a pokud je položek více než 3, rozděl je do dvou sloupců
- Jednopísmenné spojky a předložky nenechávej osamocené na konci řádku
- Jednotky spoj s číslem nedělitelnou mezerou
- Datum piš ve formátu `1. 1. 2026` s nedělitelnými mezerami

## Obsah

- Stručné a srozumitelné texty
- Výrazné nadpisy s klíčovými informacemi a CTA tlačítka
- Vizuální prvky podporující obsah
- Logické uspořádání informací, nejdůležitější nahoře
- Vytvoř chybovou stránku. Místo „404" dej ikonu `<wa-icon name="face-frown" variant="regular"></wa-icon>` a do `.htaccess` přidej `ErrorDocument 404 /404.html`
- Zkontroluj povinné údaje na webu: jméno, sídlo, IČ, zápis v rejstříku

Povinné firemní údaje:
```
Raška engineering s.r.o.
Olšany u Prostějova 24
798 14 Olšany u Prostějova
IČO: 10790659
DIČ: CZ10790659
Spisová značka: C 122874 vedená u Krajského soudu v Brně
```

## Konzistence

- Jednotný styl tlačítek, karet a komponent
- Stejný padding/margin napříč podobnými elementy
- Stejné zaoblení prvků
- Konzistentní ikonografie, používej Font Awesome, ne emotikony
- Stíny karet pouze velmi jemné
- Jednotný projev značky
- Konzistentní použití barev
- Jednotný spacing a odsazení, např. 8px grid

## Barevná paleta pro web – Raška Engineering

### Základní barvy

- Primární: `#1F4E8C` (tmavě modrá, z loga) – hlavička, patička, nadpisy, primární prvky
- Akcent: `#E06A2C` (oranžová) – CTA tlačítka, odkazy, hover stavy, zvýraznění
- Pozadí: `#FFFFFF` (bílá) – výchozí pozadí stránky
- Text: `#333333` (tmavě šedá) – veškerý běžný text

### Světlé odstíny pro pozadí sekcí

- Světlá šedá: `#E8E8E8`
- Světlá modrá: `#DCE6F2`
- Světlá oranžová: `#F6DCC7`

Světlé odstíny používej jako jemné pozadí sekcí, karet nebo zvýrazněných obsahových bloků.

Oranžovou `#E06A2C` používej střídmě. Nemá tvořit dominantní velké plochy webu.

Světlou oranžovou `#F6DCC7` používej pouze jako jemný doplňkový odstín.

Na začátku `style.css` definuj minimálně:

```css
:root {
  --color-primary: #1F4E8C;
  --color-accent: #E06A2C;
  --color-background: #FFFFFF;
  --color-text: #333333;
  --color-bg-gray: #E8E8E8;
  --color-bg-blue: #DCE6F2;
  --color-bg-orange: #F6DCC7;
}
```

Používej tyto proměnné konzistentně napříč webem a nevytvářej další nahodilé odstíny bez jasného designového důvodu.

## Fonty

- Zvol vhodný patkový nebo bezpatkový font podle obsahu webu
- Pokud není jasné, zvol moderní sans-serif font, např. Outfit
- Font musí podporovat českou diakritiku a být dobře čitelný
- Pokud nebude dodaný konkrétní brandový font, použij moderní sans-serif font Outfit
- Používej jednu hlavní fontovou rodinu pro celý web

## Struktura

Vytvoř vícestránkový web.

Položky menu:
- Domů
- Elektro služby
- Fotovoltaika
- Průmyslová řešení
- O nás
- Kontakt

Do navigace zakomponuj také telefon s ikonou telefonního sluchátka:

`+420 733 686 898`

Odkaz: `tel:+420733686898`

## Další prvky na webu

- Vlož odkazy na sociální sítě společnosti
- Nevkládej Google mapu
- Nevkládej automatický Instagram feed
- Nevkládej automaticky Google recenze ani jiné externí widgety
- Vytvoř kontaktní formulář včetně antispamu (honeypot), použijeme službu `https://formspree.io/`
- Konkrétní Formspree endpoint bude doplněn později

Sociální sítě:
- Facebook: `https://www.facebook.com/raskaengineering.cz`
- Instagram: `https://www.instagram.com/raskaengineering/`
- LinkedIn: `https://www.linkedin.com/company/raška-engineering/`
- YouTube: `https://www.youtube.com/channel/UCwIyb4olboS8yfoP8JUlgFA/`

## Telefonní odkazy a CTA

Telefonní číslo: `+420 733 686 898`

Všude, kde je telefon určený ke kontaktování firmy, nastav klikací odkaz `tel:+420733686898`.

U telefonních CTA používej ikonu telefonního sluchátka a číslo.

Nepřidávej vedle klikacího telefonního čísla další samostatné tlačítko s textem „Zavolat".

## Design

Design hero sekce / celého webu vytvoř podle vzoru, který ti dám před začátkem tvorby jako obrázek.

Vytvoř moderní mobile-first web: použít můžeš trendy jako souměrný bento grid layout, barevné gradienty, glass efekt, micro-animace na hover a scroll efekty.

## Obrázky

Na webu použij fotky a obrázky ze složky `Obrazky`.

Fotografie je možné roztřídit do podsložek podle jednotlivých stránek.

Používej především skutečné fotografie firmy a realizací.

Nepoužívej stock fotografie bez výslovného pokynu.

Fotografie používej průběžně v obsahových sekcích i v galeriích.

Na stránkách Elektro služby, Fotovoltaika a Průmyslová řešení vytvoř galerii realizací. Pokud bude fotografií dostatek, použij přibližně 6 až 8 fotografií.

## Eyebrow texty

Eyebrow používej pouze tam, kde přináší konkrétní informaci.

Na homepage v hero použij:
`ELEKTRO SLUŽBY • FOTOVOLTAIKA • PRŮMYSLOVÁ ŘEŠENÍ`

Na běžných obsahových sekcích eyebrow nepoužívej.

Na podstránkách můžeš v hero použít malý název dané služby nad hlavním H1, pokud tím zlepšíš orientaci.

Na stránkách O nás a Kontakt eyebrow není potřeba.

## Jazyková verze

V této fázi vytvoř českou verzi webu.

Další jazykové verze budou řešeny později.

Nevytvářej automatický strojový překlad ani další jazykovou mutaci bez samostatného zadání.

## Texty

Na webu použij následující texty pro jednotlivé sekce a stránky.

Drž se jich doslova a nic neměň ani nepřidávej.

Nevymýšlej nové claimy, slogany, odstavce, popisy služeb, reference, zkušenosti, certifikace, statistiky ani informace o firmě, které nejsou v podkladech.

Pokud je v textu poznámka nebo placeholder pro obsah, který bude doplněn později, nevytvářej za něj náhradní text. Připrav pouze odpovídající místo v designu.

---

## HOMEPAGE

### Hero sekce

`ELEKTRO SLUŽBY • FOTOVOLTAIKA • PRŮMYSLOVÁ ŘEŠENÍ`

**Tam, kde jiní říkají ne, my máme řešení**

Specializujeme se na elektroinstalace včetně elektrorevizí, fotovoltaiku na klíč a průmyslová řešení, která vyžadují skutečné odborníky. Pro domácnosti, firmy i průmyslové provozy po celé ČR.

Tlačítko: Naše služby
Tlačítko: +420 733 686 898

### Pohotovostní elektro služby

**Potřebujete elektrikáře rychle?**

Máte poruchu nebo akutní problém s elektroinstalací? Zavolejte nám a domluvíme se na nejrychlejším možném řešení.

Tlačítko: +420 733 686 898

### Co pro vás zajistíme

**Elektro služby**

Kompletní elektroinstalační a elektromontážní práce pro domácnosti, firmy i průmyslové objekty. Zajišťujeme nové elektroinstalace, rekonstrukce rozvodů, montáže osvětlení a rozvaděčů, servis i elektrorevize.

Tlačítko: Zjistit více

**Fotovoltaika**

Navrhujeme a realizujeme fotovoltaické systémy pro domácnosti i firmy. Postaráme se o celý proces od návrhu vhodného řešení přes instalaci až po následný servis. Pracujeme s technologiemi SolaX, GoodWe a NORD.

Tlačítko: Zjistit více

**Průmyslová řešení**

Dlouholeté zkušenosti z průmyslu využíváme při realizaci specializovaných technických řešení pro výrobní provozy. Zajišťujeme servis výrobních technologií, stěhování výrobních strojů a další technická řešení v ČR i zahraničí.

Tlačítko: Zjistit více

### O nás

Raška engineering s.r.o. je česká společnost se sídlem v Olšanech u Prostějova. Stavíme na odborných zkušenostech získaných při realizaci elektrotechnických zakázek, fotovoltaických systémů a technických projektů v průmyslovém prostředí.

Ke každému projektu přistupujeme podle jeho konkrétních technických požadavků a hledáme řešení, které bude spolehlivě fungovat i z dlouhodobého hlediska.

**Komplexní řešení**
Zakázku dokážeme převzít od prvotního návrhu přes realizaci až po následnou technickou péči.

**Důraz na bezpečnost**
Pracujeme s ohledem na bezpečné provedení, spolehlivost a platné technické normy.

**Řešení podle konkrétní zakázky**
Každý projekt posuzujeme individuálně podle technických možností a vašich požadavků.

**Odborné zázemí**
Zkušenosti z různých oblastí techniky nám umožňují řešit i složitější zakázky.

Tlačítko: Více o nás

### Naše realizace

Podívejte se na ukázky našich projektů z oblasti elektroinstalací, fotovoltaiky a průmyslových řešení.

- Elektroinstalace
- Fotovoltaika
- Průmyslová řešení

Tlačítko: Kontaktujte nás

### Máte projekt? Ozvěte se nám.

Potřebujete elektroinstalaci, fotovoltaiku nebo technické řešení pro svůj dům, firmu či provoz? Ozvěte se nám a probereme možnosti realizace vašeho projektu.

Telefon: +420 733 686 898
E-mail: zdenek@raskaengineering.cz

**Nezávazná poptávka**
- Jméno a příjmení
- Telefon
- E-mail
- O jakou službu máte zájem? (Elektro služby / Fotovoltaika / Průmyslová řešení)
- Vaše zpráva

Tlačítko: Odeslat poptávku

### Patička

logo

ELEKTRO SLUŽBY • FOTOVOLTAIKA • PRŮMYSLOVÁ ŘEŠENÍ

**Služby**
- Elektro služby
- Fotovoltaika
- Průmyslová řešení

**Odkazy**
- O nás
- Kontakt

**Kontakt**
Telefon: +420 733 686 898
E-mail: zdenek@raskaengineering.cz

Raška engineering s.r.o.
Olšany u Prostějova 24
798 14 Olšany u Prostějova

IČO: 10790659
DIČ: CZ10790659

**Sociální sítě**
- Facebook - https://www.facebook.com/raskaengineering.cz
- Instagram - https://www.instagram.com/raskaengineering/
- LinkedIn - https://www.linkedin.com/company/raška-engineering/
- YouTube - https://www.youtube.com/channel/UCwIyb4olboS8yfoP8JUlgFA/

---

## Stránka ELEKTRO SLUŽBY

### Hero

**Elektroinstalace a elektrorevize pro domácnosti, firmy i průmysl**

Zajišťujeme kompletní elektroinstalační a elektromontážní práce od nových rozvodů a rekonstrukcí až po servis a pravidelné elektrorevize. Každé řešení přizpůsobujeme vašemu objektu a jeho technickým požadavkům.

Tlačítko: Nezávazná poptávka
Tlačítko: +420 733 686 898

### Pohotovostní elektro služby

**Potřebujete elektrikáře rychle?**

Máte poruchu nebo akutní problém s elektroinstalací? Zavolejte nám a domluvíme se na nejrychlejším možném řešení.

Tlačítko: +420 733 686 898

### Co nabízíme

**Nové elektroinstalace**
Kompletní návrh a realizace elektroinstalací pro novostavby, rodinné domy, firmy i další objekty.

**Rekonstrukce elektroinstalací**
Obnova starších elektrických rozvodů s ohledem na současné technické a bezpečnostní požadavky.

**Osvětlení**
Montáž, výměna a opravy vnitřního i venkovního osvětlení včetně moderních LED řešení.

**Rozvaděče a jištění**
Návrh, montáž, úpravy a servis elektrických rozvaděčů a jistících prvků.

**Chytrá domácnost**
Instalace inteligentních prvků a systémů pro pohodlnější ovládání domácnosti.

**Servis a opravy**
Diagnostika závad, opravy elektroinstalací a servis elektrických zařízení.

### Elektrorevize

Elektrorevize pomáhají ověřit bezpečnost a technický stav elektroinstalace a odhalit závady, které mohou vést k poruše zařízení, úrazu elektrickým proudem nebo vzniku požáru. Po provedené revizi obdržíte revizní zprávu se zhodnocením stavu zařízení a případným doporučením potřebných oprav.

**Provádíme revize**

**Rodinných domů a bytových objektů**
Elektroinstalace, zásuvky, vypínače a rozvaděče.

**Komerčních a průmyslových objektů**
Elektrické rozvody, provozní zařízení, stroje a výrobní technologie.

**Hromosvodů**
Kontrola systému ochrany před bleskem.

**Elektrospotřebičů a nářadí**
Kontroly elektrických spotřebičů, přístrojů a pracovního nářadí.

**Jak elektrorevize probíhá**

1. **Domluvíme rozsah revize**
Zjistíme typ objektu nebo zařízení a rozsah požadované kontroly.

2. **Provedeme kontrolu a měření**
Revizní technik prověří stav elektroinstalace a její jednotlivé součásti.

3. **Dostanete revizní zprávu**
Výsledkem je dokument se zhodnocením stavu elektroinstalace a případným doporučením oprav.

### Otázky a odpovědi

**Kdy je potřeba elektrorevize?**
Revize se provádějí při kontrole bezpečnosti a technického stavu elektroinstalace. U některých objektů a provozů jsou pravidelné revize součástí povinností spojených s bezpečností provozu.

**Co získám po provedené revizi?**
Po dokončení revize obdržíte revizní zprávu, která popisuje stav elektroinstalace a případná doporučení k opravám.

**Provádíte revize také ve firmách a průmyslových provozech?**
Ano. Revize se týkají také komerčních a průmyslových objektů, kabelových rozvodů, strojů a výrobních linek.

**Provádíte i revize hromosvodů a elektrospotřebičů?**
Ano. Součástí nabídky jsou také revize hromosvodů, elektrického nářadí, spotřebičů a přístrojů.

### Ukázky naší práce

Sem bych dala menší galerii třeba 6 až 8 fotek.

### Máte zájem o elektro služby?

Řešíte elektroinstalaci, opravu nebo revizi? Kontaktujte nás a domluvíme se na řešení pro váš projekt.

Telefon: +420 733 686 898
E-mail: zdenek@raskaengineering.cz

Tlačítko: Nezávazná poptávka

---

## Stránka FOTOVOLTAIKA

### Hero sekce

**Fotovoltaické systémy pro domácnosti i firmy**

Navrhneme a zrealizujeme fotovoltaické řešení podle vašich konkrétních potřeb. Postaráme se o celý proces od návrhu vhodného systému přes instalaci až po následný servis.

Tlačítko: Nezávazná poptávka
Tlačítko: +420 733 686 898

### Co nabízíme

**Fotovoltaické systémy na míru**
Navrhneme fotovoltaický systém s ohledem na typ objektu, spotřebu energie a technické možnosti instalace.

**Střídače**
Součástí fotovoltaického systému je vhodně zvolený střídač, který zajišťuje efektivní využití vyrobené energie. Pracujeme s technologiemi ověřených výrobců SolaX a GoodWe.

**Bateriová úložiště**
Bateriový systém umožňuje uchovat přebytečnou energii vyrobenou během dne a využít ji později podle aktuální potřeby.

**Wallbox**
Fotovoltaický systém lze doplnit také o řešení pro nabíjení elektromobilu.

**Monitoring systému**
Vybrané technologie umožňují sledovat výrobu a výkon fotovoltaického systému prostřednictvím aplikace.

### Technologie, se kterými pracujeme

**SolaX**
*Chytré využití vyrobené energie*

SolaX nabízí fotovoltaické střídače a bateriové systémy zaměřené na efektivní využití solární energie v domácnostech i firmách.

Mezi hlavní výhody patří vysoká účinnost střídačů, možnost ukládání přebytečné energie do baterií a monitoring výkonu systému prostřednictvím aplikace.

**NORD**
*Odolnost a dlouhá životnost*

Fotovoltaické systémy NORD jsou navržené s důrazem na odolnost, dlouhou životnost a spolehlivý výkon i v náročnějších podmínkách.

Systémy NORD oceníte, pokud hledáte stabilní fotovoltaické řešení s důrazem na dlouhodobý provoz a minimální nároky na údržbu.

**GoodWe**
*Moderní technologie pro chytré řízení energie*

GoodWe nabízí moderní fotovoltaická řešení umožňující efektivně řídit energii mezi solárními panely, bateriovým úložištěm a elektrickou sítí.

Hybridní měniče umožňují optimalizovat využití vyrobené energie a vybrané systémy lze propojit také s chytrým řízením domácnosti.

### Jak spolupráce probíhá

1. **Konzultace**
Probereme vaše požadavky, spotřebu energie a technické možnosti objektu.

2. **Návrh řešení**
Navrhneme vhodný fotovoltaický systém a zvolíme jednotlivé technologie podle potřeb konkrétní instalace.

3. **Realizace**
Zajistíme dodání a odbornou instalaci fotovoltaického systému.

4. **Spuštění a následný servis**
Po dokončení instalace systém uvedeme do provozu a zajistíme následný servis.

### Certifikace a odborná způsobilost

Při realizaci fotovoltaických systémů využíváme odborné znalosti a zkušenosti s technologiemi, se kterými pracujeme.

Zde budou zobrazeny certifikace a osvědčení společnosti.

### Otázky a odpovědi

**Pro koho je fotovoltaika vhodná?**
Fotovoltaika je vhodná pro domácnosti i firmy. Konkrétní řešení vám vždy navrhneme podle typu vašeho objektu, jeho spotřeby energie a technických možností instalace.

**Je možné fotovoltaický systém doplnit baterií?**
Ano. Bateriové úložiště umožňuje uchovávat přebytečnou vyrobenou energii a využít ji později podle potřeby.

**Lze výkon fotovoltaiky sledovat v aplikaci?**
Ano. Vybrané technologie umožňují prostřednictvím aplikace sledovat výrobu a výkon fotovoltaického systému.

**Jaké technologie používáte?**
Pracujeme s fotovoltaickými technologiemi SolaX, GoodWe a NORD.

**Zajišťujete také následný servis?**
Ano. Součástí našich služeb je také následný servis realizovaných fotovoltaických systémů.

### Ukázky našich realizací

Zde bude galerie realizovaných fotovoltaických systémů.

### Máte zájem o fotovoltaiku?

Plánujete fotovoltaický systém pro svůj dům nebo firmu? Kontaktujte nás a probereme možnosti řešení podle vašich potřeb.

Telefon: +420 733 686 898
E-mail: zdenek@raskaengineering.cz

Tlačítko: Nezávazná poptávka

---

## Stránka PRŮMYSLOVÁ ŘEŠENÍ

### Hero sekce

**Technická řešení pro průmyslové provozy**

Dlouholeté zkušenosti z průmyslového prostředí využíváme při servisu výrobních technologií, stěhování strojů a dalších specializovaných technických pracích. Působíme v ČR i zahraničí.

Tlačítko: Nezávazná poptávka
Tlačítko: +420 733 686 898

### Co nabízíme

**Servis výrobních technologií**
Zajišťujeme servis vstřikovacích, vytlačovacích, pneumatických a hydraulických systémů ve výrobních provozech.

**Stěhování výrobních strojů**
Pomůžeme vám se stěhováním a technickým zajištěním výrobních strojů a zařízení.

**Průmyslové elektroinstalace a elektrorevize**
Provádíme elektroinstalační práce a elektrorevize pro průmyslové objekty, stroje a výrobní technologie.

**Rozvody materiálů a energií**
Realizujeme technické rozvody materiálů a energií podle požadavků konkrétního výrobního provozu.

**Čištění vodních a chladicích okruhů**
Zajišťujeme čištění vodních a chladicích okruhů průmyslových zařízení.

**Výroba a opravy topných těles**
Provádíme výrobu a opravy topných těles pro průmyslové využití.

### Otázky a odpovědi

**Realizujete průmyslové zakázky i mimo Českou republiku?**
Ano. Na průmyslových projektech pracujeme v České republice, na Slovensku i v Polsku.

**Provádíte servis přímo ve výrobních provozech?**
Ano. Zajišťujeme servis výrobních technologií přímo podle potřeb konkrétního provozu.

**Můžete zajistit více technických prací v rámci jedné zakázky?**
Ano. Rozsah prací vždy řešíme podle konkrétního projektu a technických požadavků vašeho provozu.

### Ukázky naší práce

Zde bude galerie realizací z průmyslových provozů.

### Řešíte technický projekt ve výrobním provozu?

Popište nám, co potřebujete zajistit. Probereme s vámi technické požadavky projektu a možnosti realizace.

Telefon: +420 733 686 898
E-mail: zdenek@raskaengineering.cz

Tlačítko: Nezávazná poptávka

---

## Stránka O NÁS

### Hero sekce

**O nás**

Raška engineering s.r.o. je česká firma z Olšan u Prostějova. Naše zkušenosti vycházejí především z dlouholeté práce v průmyslu, na kterou dnes navazujeme elektroinstalacemi, elektrorevizemi a fotovoltaickými systémy.

Tlačítko: Kontaktujte nás

### Náš příběh

Kořeny našich zkušeností sahají především do průmyslového prostředí. Dlouholetá práce s výrobními technologiemi, elektroinstalacemi a technickými systémy nám dala široký přehled, který dnes využíváme při řešení zakázek pro domácnosti, firmy i výrobní provozy.

Postupně jsme své služby rozšířili o kompletní elektroinstalační práce, elektrorevize a fotovoltaické systémy. Právě elektro služby a fotovoltaika dnes tvoří hlavní část naší práce.

Zkušenosti z průmyslu zůstávají důležitou součástí firmy. Patří mezi ně servis vstřikovacích a vytlačovacích technologií, pneumatických a hydraulických systémů i stěhování výrobních strojů v České republice a zahraničí.

### Kdo za Raška engineering stojí

**Zdeněk Raška**
Majitel společnosti Raška engineering s.r.o.

[Sem doplníme konkrétní profesní medailonek majitele. Kolik let se pohybuje v oboru, kde získal zkušenosti, čemu se věnoval v průmyslu, kdy a proč vznikla Raška engineering a jaké odborné kvalifikace má.]

Telefon: +420 733 686 898
E-mail: zdenek@raskaengineering.cz

### Zkušenosti a certifikace

Zde budou zobrazeny jednotlivé certifikace a osvědčení.

U každého bych uvedla:
- [Název certifikace nebo osvědčení]
- [Krátká informace, čeho se certifikace týká.]

### Reference

Zde budou uvedeny vybrané firmy a zákazníci, pro které jsme realizovali zakázky v oblasti elektroinstalací, fotovoltaiky nebo průmyslových řešení.

Zde budou loga klientů, případně krátké reference.

### Máte projekt, který chcete probrat?

Ozvěte se nám a probereme možnosti realizace vašeho projektu.

Telefon: +420 733 686 898
E-mail: zdenek@raskaengineering.cz

Tlačítko: Nezávazná poptávka

---

## Stránka KONTAKT

### Hero sekce

**Kontaktujte nás**

Potřebujete elektro služby, fotovoltaiku nebo řešení pro průmysl? Ozvěte se nám telefonicky, e mailem nebo prostřednictvím kontaktního formuláře.

Telefon: +420 733 686 898
E-mail: zdenek@raskaengineering.cz

E-mail pro servis: servis@raskaengineering.cz

E-mail pro fakturace: administrace@raskaengineering.cz

### Nezávazná poptávka

Máte zájem o naše služby? Pošlete nám poptávku prostřednictvím formuláře a my se vám brzy ozveme.

**Kontaktní formulář**
- Jméno a příjmení
- Telefon
- E-mail
- O jakou službu máte zájem? Elektro služby / Fotovoltaika / Průmyslová řešení
- Vaše zpráva

Tlačítko: Odeslat poptávku

### Kontaktní údaje

Raška engineering s.r.o.

Olšany u Prostějova 24
798 14 Olšany u Prostějova

Telefon: +420 733 686 898
E-mail: zdenek@raskaengineering.cz

### Fakturační údaje

Raška engineering s.r.o.

IČO: 10790659
DIČ: CZ10790659

Spisová značka:
C 122874 vedená u Krajského soudu v Brně

### Sledujte nás

- Facebook — https://www.facebook.com/raskaengineering.cz
- Instagram — https://www.instagram.com/raskaengineering/
- LinkedIn — https://www.linkedin.com/company/raška-engineering/
- YouTube — https://www.youtube.com/channel/UCwIyb4olboS8yfoP8JUlgFA/
