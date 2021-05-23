/*
Krok 1.to rozpoczęcie obliczeń i napisanie tablicy simpleksowej oraz sprawdzić czy wszystkie wartości w 1 kolumnie są ≥0,
 czyli czy można rozwiązać simpleksem prymalnym, jeśli nie to simpleks prymalny sobie nie poradzi i trzeba będzie
 wykorzystać simpleks dwufazowy.
2.Krok 2. to test optymalności, który polega na sprawdzeniu co się dzieje w wartościach dla funkcji celu (jeżeli (x1x2)
sąsame wartości dodatnie to zmienne (x3,x4,x5) są rozwiązaniem optymalnym. Jeśli nie to przechodzimy do kroku 3.
3.Krok 3. Wybór zmiennej wchodzącej do bazy, tę która ma największą wartość ujemną.
4.Krok 4. To wybór zmiennej, którą chcemy usunąć z bazy. Liczymy ilorazy (np. 5/1, nie liczymy bo ograniczenie jest
  rozwarte, 21/6)
5.Krok 5. Jest to eliminacja Gauss’a. Wyliczamy nową tablicę simpleksową. Wiersz gdzie jest element centralny jest to
  iloraz przez element centralny(21/6; 2/6), a w miejscu gdzie był element centralny jest jego odwrotność (1/6).


 */
import MyMath from "./MyMath";
import * as Utils from "./MyUtils";


class TwoPhaseSimplex {


}

export default TwoPhaseSimplex
