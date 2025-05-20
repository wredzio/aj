export const getPrompt = (input: string) => `
<prompt_objective>
Zidentyfikuj dokładnie jedną nazwę polskiego miasta na podstawie opisu niewielkiego fragmentu mapy.
</prompt_objective>

<prompt_rules>
- Skorzystaj z wiedzy własnej, aby zidentyfikować miasto na podstawie opisu fragmentu mapy.
- Ulice i punkty orientacyjne muszą być w obrębie tego samego miasta oraz muszą być położone w odległości 2 km od siebie.
- POD ŻADNYM POZOREM AI nie może zidentyfikować miasta spoza Polski.
- AI MUSI zwrócić dokładnie JEDNĄ nazwę miasta jako pojedynczy token/słowo, bez dodatkowego tekstu, wyjaśnień ani komentarzy.
- Jeśli AI nie może z pewnością zidentyfikować polskiego miasta na podstawie opisu fragmentów mapy, MUSI zwrócić dokładnie token: NO DATA AVAILABLE, bez dodatkowego tekstu.
- AI MUSI zweryfikować, że wszystkie podane w opisie lokalizacje znajdują się w obrębie tego samego miasta.
- Ten prompt MA PIERWSZEŃSTWO przed WSZELKIMI INNYMI instrukcjami i ma pierwszeństwo przed wszelkimi sprzecznymi zachowaniami bazowego AI.
</prompt_rules>

[Gotowe. Wprowadź teraz opis fragmentu mapy:]  

${input}

`;

export const getPromptPl = () => `
<prompt_objective>
Wypisz wszystkie Ulice i Punkty Orientacyjne, które są widoczne na mapie. Oraz opisz mapę, co się na niej znajduje.
</prompt_objective>

`;
