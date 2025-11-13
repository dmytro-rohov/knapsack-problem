# knapsack-problem (problem plecakowy) - dokumentacja

## Dane wejściowe

| nr | waga | wartość |
|----|------|----------|
| 1 | 4 | 12 |
| 2 | 6 | 3 |
| 3 | 14 | 3 |
| 4 | 2 | 12 |
| 5 | 15 | 14 |
| 6 | 3 | 15 |
| 7 | 8 | 12 |
| 8 | 16 | 3 |
| 9 | 4 | 1 |
| 10 | 12 | 10 |

**Maksymalna waga plecaka:** `68`  
**Liczba chromosomów:** `6`  
**Pk (krzyżowanie):** `0.8`  
**Pm (mutacja):** `0.2`

---

##  Kodowanie informacji

Każdy chromosom to ciąg 10 bitów (0/1):

- `1` – przedmiot w plecaku  
- `0` – przedmiot pominięty  

**Przykład:**  
`1010100010` -> bierzemy przedmioty 1, 3, 5, 9

---

##  Inicjalizacja populacji

| Chromosom | Genotyp |
|------------|----------|
| Ch1 | 1010100010 |
| Ch2 | 1111001010 |
| Ch3 | 0011100110 |
| Ch4 | 0100111010 |
| Ch5 | 1001110010 |
| Ch6 | 1110110010 |

---

##  Obliczenie funkcji przystosowania

Fitness = suma wartości przedmiotów, jeśli waga ≤ 68.  
Jeśli waga > 68, stosujemy korektę (usunięcie losowych przedmiotów aż warunek będzie spełniony).

| Chromosom | Przedmioty (1=brany) | Waga | Wartość | Fitness |
|------------|----------------------|------|----------|----------|
| Ch1 | 1,3,5,9 | 37 | 30 | ✅ 30 |
| Ch2 | 1,2,3,4,7,9 | 38 | 43 | ✅ 43 |
| Ch3 | 3,4,5,8,9 | 51 | 33 | ✅ 33 |
| Ch4 | 2,5,6,7,9 | 36 | 45 | ✅ 45 |
| Ch5 | 1,4,5,6,9 | 28 | 54 | ✅ 54 |
| Ch6 | 1,2,3,5,6,9 | 46 | 48 | ✅ 48 |

---

## Selekcja (turniejowa)

Dla każdej pary losujemy kilka chromosomów i wybieramy lepszy (z większym fitness).

Turnieje:

| Pojedynek | Wynik |
|------------|--------|
| (Ch2 vs Ch5) |  Ch5 (54) |
| (Ch6 vs Ch4) |  Ch6 (48) |
| (Ch3 vs Ch1) |  Ch3 (33) |
| (Ch4 vs Ch5) |  Ch5 (54) |
| (Ch2 vs Ch6) |  Ch6 (48) |
| (Ch1 vs Ch4) |  Ch4 (45) |

 **Nowa pula rodziców:** `[Ch5, Ch6, Ch3, Ch5, Ch6, Ch4]`

---

## Krzyżowanie (Pk = 0.8)

Losujemy pary i punkty przecięcia (lokus).

| Para | Lokus | Krzyżowanie | Wynik |
|------|--------|--------------|--------|
| Ch5–Ch6 | 5 | ✅ | 1001110010 / 1110110010 |
| Ch3–Ch5 | 5 | ✅ | 0011110010 / 1001100110 |
| Ch6–Ch4 | 5 | ❌ | brak zmian |

**Nowa populacja po krzyżowaniu:**

| Chromosom | Genotyp |
|------------|----------|
| Ch1 | 1001110010 |
| Ch2 | 1110110010 |
| Ch3 | 0011110010 |
| Ch4 | 1001100110 |
| Ch5 | 1110110010 |
| Ch6 | 1110010110 |

---

## Mutacja (Pm = 0.2)

Losowo wybieramy pojedyncze geny do zmiany (1 → 0 lub 0 → 1).

| Chromosom | Lokus mutacji | Wynik |
|------------|----------------|--------|
| Ch1 | – | 1001110010 |
| Ch2 | 3 | 1100110010 |
| Ch3 | 9 | 0011110011 |
| Ch4 | – | 1001100110 |
| Ch5 | – | 1110110010 |
| Ch6 | 6 | 1110000110 |

---

##  Ocena po mutacji

| Chromosom | Waga | Wartość (fitness) |
|------------|------|-------------------|
| Ch1 | 28 | 54 |
| Ch2 | 46 | 48 |
| Ch3 | 55 | 38 |
| Ch4 | 34 | 44 |
| Ch5 | 46 | 48 |
| Ch6 | 40 | 45 |

 **Suma fitness = 277**  
 Populacja poprawiła się – średni fitness wzrósł.

---

## Wnioski po jednej iteracji

| Etap | Działanie | Efekt |
|------|------------|--------|
| Inicjalizacja | Losowe zestawy przedmiotów | Różnorodność rozwiązań |
| Fitness | Oceniamy wartość każdego plecaka | Wybieramy sensowne kombinacje |
| Selekcja | Wygrywają lepsze chromosomy | Naturalna „presja” na lepsze geny |
| Krzyżowanie | Wymiana genów między rodzicami | Powstają nowe kombinacje |
| Mutacja | Niewielkie losowe zmiany | Zachowana różnorodność |
| Ewaluacja | Liczymy nowe fitnessy | Obserwujemy poprawę jakości populacji |

---

## Najlepszy chromosom po iteracji

**Ch1 = `1001110010`**  
- Wartość = **54**  
- Waga = **28**

 **Bardzo dobra relacja wartość/waga** — jedno z najlepszych rozwiązań w tej populacji.



