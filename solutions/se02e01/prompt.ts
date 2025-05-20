export const getPrompt = (
  text: string
) => `# [Ustal nazwę ulicy instytutu, w którym pracuje prof. Andrzej Maj]

Ustal na podstawie zeznań 6 osób, na jakiej ulicy znajduje się **instytut uczelni**, w którym wykłada profesor Andrzej Maj.

<prompt_objective>
Celem prompta jest jednoznaczne ustalenie, na jakiej ulicy mieści się konkretny instytut uczelni, w którym pracuje Andrzej Maj, na podstawie analizy zeznań oraz wiedzy własnej modelu.
</prompt_objective>

<prompt_rules>
- ANALIZUJ TYLKO instytut, w którym pracuje Andrzej Maj – NIE główną siedzibę uczelni.
- PRZEANALIZUJ każde z sześciu zeznań osobno, krok po kroku, identyfikując związki z Andrzejem Majem, nazwą instytutu i lokalizacją.
- Wykorzystaj technikę Chain-of-Thought (rozumowanie krok po kroku) przy analizie wypowiedzi.
- Skorzystaj z wiedzy własnej, aby wskazać adres instytutu, jeśli nie jest jasno wskazany w zeznaniach.
- UZASADNIJ swoją odpowiedź, pokazując tok rozumowania na końcu.
- Jeśli nie da się ustalić ulicy, odpowiedz: '❌ NIE UDAŁO SIĘ USTALIĆ' i podaj powód.
- POD ŻADNYM POZOREM nie wskazuj adresu ogólnej siedziby uczelni – tylko tego konkretnego instytutu.
- BEZWZGLĘDNIE NIE ZGADUJ – każda informacja musi mieć źródło w zeznaniach lub w Twojej wiedzy.
- Jeśli udało ustalić się instytut, ale nie ulicę, skorzystaj ze swojej wiedzy i podaj ulicę zgodnie z nią.
</prompt_rules>

<prompt_examples>
USER: 
Adam: Nie wiem, gdzie pracuje Maj, ale wspominał coś o wykładzie blisko Biblioteki Uniwersyteckiej.  
Agnieszka: Byłam kiedyś na seminarium prowadzonym przez prof. Maja, to było w Instytucie Socjologii.  
Ardian: Nie znam go osobiście, tylko z publikacji.  
Michał: Wiem, że wykłada na UW.  
Monika: Chyba na Karowej 18, tam prowadził zajęcia.  
Rafał: Mówił, że ma pokój na ostatnim piętrze instytutu koło Mariensztatu.

AI:  
➡️ Ulica: Karowa  
Model rozpoznał, że Andrzej Maj pracuje w Instytucie Socjologii UW, a ten instytut mieści się przy ul. Karowej 18. Informacje z wypowiedzi Agnieszki i Moniki pokrywają się ze znaną lokalizacją instytutu. Rafał również podał informację, która geograficznie potwierdza wskazanie.

---

USER:  
Adam: Maj to profesor na UW.  
Agnieszka: Nigdy nie byłam na jego zajęciach.  
Ardian: Wspomniał raz, że jego instytut jest obok BUWu.  
Michał: Brzmi jak Karowa, ale nie jestem pewien.  
Monika: Może Krakowskie Przedmieście?  
Rafał: Coś wspominał o "Socjo".

AI:  
➡️ Ulica: Karowa  
Na podstawie wzmianki o BUW (obok Karowej) i terminu "Socjo", który potocznie oznacza Instytut Socjologii, model wykorzystuje wiedzę własną, by wskazać Karową jako lokalizację.

---

USER:  
Adam: Maj prowadził zajęcia w Instytucie Psychologii.  
Agnieszka: Na Żwirki i Wigury chyba.  
Ardian: Zdecydowanie nie socjologia.  
Michał: Instytut Psychologii.  
Monika: Potwierdzam, byłam tam.  
Rafał: Tak, to był instytut na Stawki.

AI:  
➡️ Ulica: ❌ NIE UDAŁO SIĘ USTALIĆ  
Zeznania są sprzeczne – jedna osoba mówi o Żwirki i Wigury, inna o Stawkach. Model nie może jednoznacznie wskazać instytutu, ponieważ nie wiadomo, czy chodzi o tego samego Andrzeja Maja. Brak spójnych danych.

---

USER:  
Adam: Maj wykłada na UW.  
Agnieszka: Nigdy go nie widziałam.  
Ardian: Nie wiem.  
Michał: Nie wiem.  
Monika: Nie wiem.  
Rafał: Nie wiem.

AI:  
➡️ Ulica: ❌ NIE UDAŁO SIĘ USTALIĆ  
Brak danych o instytucie, nie można też jednoznacznie wywnioskować lokalizacji z wiedzy własnej – UW ma wiele instytutów.

</prompt_examples>

[Gotowe. Wprowadź teraz zeznania w poniższym formacie, aby rozpocząć analizę:]  

${text} 

`;
