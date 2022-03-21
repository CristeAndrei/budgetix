## Techologies and libraries used
 
- React 
- Material UI 
- Redux Toolkit 
- React Router DOM 
- Firebase Authentification 
- Firestore 
- Firebase Functions 
- Firebase Messaging 
- Firebase Store 
- Workbox 
- React Chartjs 2 
- MomentJs 
- React Material UI Form Validator  
- React Icons 
- Uuid 


## Autentificarea în aplicație
Autentificarea în aplicație se poate face în două feluri în funcție de contul de utilizator, fie utilizând email-ul și parola contului, fie utilizând contul Google prin apăsarea butonului cu logo-ul Google.

![auth](https://user-images.githubusercontent.com/60604692/159226301-262780ff-18d2-4796-b0af-58ae9fa73b38.jpg)

## Crearea contului de utilizator
Există două tipuri de conturi de utilizator, unul este creat prin intermediul unei adrese de email și o parolă iar celălalt prin intermediul contului Google. Diferența dintre cele două tipuri de conturi este faptul că în cazul alegerii creări unui cont folosind o adresă email, utilizatorul își alege direct username-ul, spre deosebire de conturile create folosind platforma Google, username-ul acestor utilizatorii fiind adresa de gmail. În cazul în care se dorește schimbarea username-ului se poate realiza această acțiune în ecranul account. Adresa de email cât și username-ul sunt unice pentru fiecare utilizator. Crearea unui cont nu necesită verificare prin email, acesta este folosit numai pentru recuperarea parolei.

![signin](https://user-images.githubusercontent.com/60604692/159226302-bf4df1bc-3752-479c-9d70-9fc1556653c5.jpg)

## Resetare parolă
Resetarea parolei se face prin apasarea link-ului ”Forgot Password? ” din ecranul de logare. În cazul unei resetari cu succes un email va fi trimis la adresa de email specificată cu instrucțiuni privind resetarea parolei. 

![password-reset](https://user-images.githubusercontent.com/60604692/159226300-8bd33691-3207-42b0-8e3d-9cc9cfeeb8d9.jpg)

## Ecranul de start al aplicației
După logare suntem redirecționați spre ecranul de start al aplicației. Din acest ecran putem naviga prin fluxurile create de noi, putem adăuga înregistrări în acestea, putem edita fluxurile și înregistrările existente și putem adăuga fluxuri la budget sau grafice.

### Bara de jos
În bara de jos a aplicației se află butoanele pentru realizarea acțiunilor asupra fluxului deschis și afișarea de informații corespunzătoare fluxului. Prin ținerea apăsată a unuia dintre aceste butoane se afișează un tooltip cu descrierea acțiunii realizate de butonul apăsat.

![start-screen](https://user-images.githubusercontent.com/60604692/159226308-dd21a1b5-119c-4c57-bcd8-4256fb6c510b.jpg)

## Crearea unui flux
Prin apasarea iconitei ”Add” din colțul stânga jos se deschide meniul pentru acțiunile care pot fi realizate asupra unui flux. În continuare se apasă butonul ”Add Flux”.

![create-flux](https://user-images.githubusercontent.com/60604692/159226310-d69c1439-11a4-4549-b08a-a92051d93d53.jpg)

Acesta deschide dialogul de creare a unui flux. Aici se poate selecta numele fluxului și dacă acesta ar trebui să fie adăugat la bugetele la care este subscris fluxul părinte (în cazul în care fluxul părinte nu aparține nici unui buget această opțiune nu este disponibilă).

![create-flux-dialog](https://user-images.githubusercontent.com/60604692/159226306-08b8e400-5b1a-4f09-8471-24c8698713d6.jpg)

## Navigarea între fluxuri
Dacă există fluxuri spre care se poate naviga atunci sub bara aplicației apare un meniu intitulat “Fluxes” , la apăsare acesta se extinde, afișând toate fluxurile spre care se poate naviga din fluxul curent. Apăsarea pe un astfel de flux ne redirecționează spre fluxul selectat.

![flux-nav](https://user-images.githubusercontent.com/60604692/159226311-d7d00ea3-2abd-457e-9cf8-0718a8b56d7a.jpg)

![extended-nav](https://user-images.githubusercontent.com/60604692/159226317-c4d53a9f-483c-4675-8ffd-0a6dd0151724.jpg)

Pentru a naviga înapoi în fluxurile în care am fost, utilizăm listă de linkuri aflată deasupra meniului “Fluxes”. La apăsarea pe un astfel de link suntem redirecționați spre fluxul respectiv.

![breadcrums](https://user-images.githubusercontent.com/60604692/159226316-f9f3a5b5-d1e5-465a-8fc8-ca14ec08361a.jpg)

## Editarea unui flux și afișarea de informații despre acesta
Meniul pentru editare și afișarea de informații este deschis prin apăsarea butonului “Flux Info” accesibil din bara de jos a aplicației din meniul “Info”.

![flux-info-button](https://user-images.githubusercontent.com/60604692/159226313-402b9003-beb0-45df-9cb5-92c3f61f1a5e.jpg)

În acest meniu se poate vedea data creări fluxului, numele, valoarea totală a înregistrarilor strict din acest flux cât și valoarea totală a înregistrărilor aflate în acest flux și în fluxurile care aparține de acesta.
La apăsarea butonului ”Edit” se face posibilă editarea numelui fluxului. Butonul ”Delete Flux” șterge fluxul, înregistrările asociate cu acesta cât și orice mențiune ar avea cu unul dintre bugetele sau graficele create. Ștergerea unui flux declanșează și ștergerea fluxurilor care aparțin de acesta. Dacă dorim să ștergem doar înregistrările fluxului selectat putem folosi butonul ”Delete Lines”.

![flux-info-dialog](https://user-images.githubusercontent.com/60604692/159226314-b1f40a5d-7760-4a08-acb2-084e3919f49c.jpg)

## Crearea de înregistrări
Există două tipuri de înregistrări ce pot fi create. Simple, acestea sunt definite de o valoare și un nume al înregistrării. În plus mai există și varianta înregistrărilor cu fișier atașat. Dialogul de creare a oricărui tip de înregistrare se accesează din butonul “Add” din dreapta jos.

![add-simple-entrie](https://user-images.githubusercontent.com/60604692/159226327-bdf09229-02e1-4e14-8f67-21a95a2a6ef1.jpg)

![add-file-entrie](https://user-images.githubusercontent.com/60604692/159226328-6b2ac2ee-d67c-40b2-8286-4e8c9ea12ad6.jpg)

![simple-entrie-dialog](https://user-images.githubusercontent.com/60604692/159226325-5df5eaa4-a4fb-46a5-bb37-20ead6e400a2.jpg)

![file-entrie-dialog](https://user-images.githubusercontent.com/60604692/159226323-a1a73a9a-3ca8-4f52-84d0-7537180f8328.jpg)

## Progres încărcare fișiere
Toate fișierele în curs de încărcare se pot observa în colțul din stânga jos în meniul “Pending Files”. Nr de fișiere în curs de încărcare se afișează în colțul iconiței  “Pending Files”. La apăsare se afișează o listă cu progresul fișierelor.

![progress-bar](https://user-images.githubusercontent.com/60604692/159226329-c2360a8d-89e2-4c41-94f8-9821d3905340.jpg)

## Editare înregistrare
În urma creări unei înregistrări, aceasta va fi afișată sub meniul de navigare al fluxurilor. La apăsarea unei înregistrări se deschide un dialog care afișează informații despre această înregistrare și face posibilă editarea sau ștergerea acesteia. În cazul editări se poate modifica numele și valoarea acesteia. Înregistrările care sunt acompaniate de un fișier oferă un link  “Open Link” pentru descărcarea fișierului respectiv. 

![line-info](https://user-images.githubusercontent.com/60604692/159226321-47f34987-0320-4dff-b785-a7369e1e7e45.jpg)

## Navigarea în aplicație 
Navigarea se face prin bara aplicației. Apăsarea pe iconița din colțul stânga sus (în cazul utilizări dispozitivelor mobile se poate și glisa din stânga spre dreapta), deschide meniul în care sunt listate toate ecranele aplicației. Prin apăsarea “Budgetix” în bara aplicației suntem redirecționați spre pagina de start.

![side-nav](https://user-images.githubusercontent.com/60604692/159226330-bf0e404f-eda7-49be-a39a-cdc1423e65f4.jpg)

## Fluxurile pentru grupuri
Din meniul de navigare se pot accesa fluxurile pentru grupuri, diferența dintre acestea si fluxurile normale este posibilitatea de a adăuga alți utilizatori la acestea. Toți utilizatorii care aparțin unui flux pot face modificări la acesta și pot adăuga sau elimina alți utilizatori. Subfluxurile create într-un astfel de flux pot fi accesate de toți userii fluxului parinte.

![group-button](https://user-images.githubusercontent.com/60604692/159226259-c573485e-8829-4450-ba02-5535f7c9c0fa.jpg)

## Adăugarea de utilizatori în fluxurile pentru grupuri
Pentru a adauga un user la un flux pentru grupuri se apasă pe meniul “Add” din colțul stânga jos urmat de apăsarea butonului “Subscribe User”. Acest buton deschide un dialog unde putem introduce username-ul unui utilizator existent pentru al adăuga la flux.

![group-dialog](https://user-images.githubusercontent.com/60604692/159226266-f21a9eff-9278-421e-863a-13aa268c4e6b.jpg)

## Eliminarea de utilizatori din fluxurile pentru grupuri
Pentru a elimina un user adăugat la un flux se apasă pe meniul “Info” aflat în mijlocul barei de jos a aplicației urmat de apăsarea butonului “Subscribed Users”. Acest buton deschide un dialog ce conține o listă a tuturor utilizatorilor ce au acces la fluxul în care ne aflăm. Prin selectarea unuia sau a mai multor utilizatori și apăsând “Delete” putem elimina utilizatori din fluxul curent. În cazul în care un user este și subscris la un budget în fluxul din care a fost eliminat acesta este eliminat și din acel buget.

## Bugete
Prin apasarea iconitei “Budgets” din meniul de navigare din stânga se accesează ecranul pentru bugete. Aici se afișează o listă a tuturor bugetelor din care faci parte și un mod de a crea noi bugete prin apăsarea butonului “+” din dreapta jos.

![budgets-screan](https://user-images.githubusercontent.com/60604692/159226269-8f473d4a-c73a-4cd5-8181-27fb751519ed.jpg)

## Creare buget
Prin apăsarea butonului “+” din dreapta jos se deschide dialogul pentru crearea unui buget. Aici se poate alege numele bugetului, limita acestuia cât și utilizatori care dorim să facă parte din acest buget.

![create-budget](https://user-images.githubusercontent.com/60604692/159226272-17d4d62d-b3e5-4759-87ca-4fd982e386bc.jpg)

## Editare sau ștergere buget
Prin apăsarea butonului cu iconița creion din dreptul unui buget se deschide dialogul de editare a unui buget. Aici putem edita numele bugetului, limita acestuia și utilizatori care au acces la buget sau putem șterge bugetul. Dacă pentru acest buget avem fluxuri personale atunci nu putem adăuga alți utilizatori.

![edit-budget](https://user-images.githubusercontent.com/60604692/159226274-3b338142-75e7-42c6-8443-7bf148606e87.jpg)

## Adăugarea de fluxuri la buget
Adaugarea unui flux la buget se face prin meniul “Add” din ecranul principal, apăsând butonul “Subscribe to budget”. Acesta deschide un meniu unde putem vedea toate bugetele ce le putem adăuga la acest flux și bugetele deja adăugate.

![subscribe-budget-button](https://user-images.githubusercontent.com/60604692/159226278-529d140a-0f85-4714-8f54-2905d046ba4b.jpg)

La final când se apasă “Submit” bugetele care sunt noi în coloana “Chosen” vor fi adăugate la flux iar bugetele care au fost în coloana “Chosen” dar se află acum în coloana “Choices” vor fi eliminate din flux. De asemenea putem alege și dacă vrem să adăugăm numai fluxul la care suntem sau dacă dorim să adăugăm și fluxurile care se află în fluxul curent (a se nota că se adaugă toate fluxurile care pornesc din fluxul curent nu doar cele cu un nivel mai jos). În cazul în care bugetul are mai mulți utilizatori aceștia sunt adăugați la fluxuri.  Pentru fluxurile la care avem acces numai noi nu sunt afișate bugetele care au mai mulți utilizatori.

![budget-dialog](https://user-images.githubusercontent.com/60604692/159226275-71768cd7-606d-46ab-8f3c-c5b5ef0200f3.jpg)

## Lista bugetelor la care un flux este subscris
Prin intermediul meniului “Info” din bara de jos a aplicației putem apăsa pe butonul “Budgets Subscriptions”. 

![budget-subscriptions-button](https://user-images.githubusercontent.com/60604692/159226277-308b4315-6fad-4dbc-8166-b02b0e41ff08.jpg)

Aici avem o lisat cu toate bugetele la care un flux este subscris. La apăsarea unui buget din listă suntem redirecționați către ecranul cu informații despre buget.

![budget-subscription-list](https://user-images.githubusercontent.com/60604692/159226280-c27fbed1-4ead-4eff-b5a1-0604b40528d5.jpg)

## Informați despre buget
Putem accesa acest ecran în două moduri, prin intermediul meniului “Info” din bara de jos a aplicației putem apăsa pe butonul “Budgets Subscriptions” sau din meniul de navigare din stânga apăsând butonul “Budgets” și selectând un buget din lista. În acest ecran se poate vedea o reprezentare grafică a bugetelor aparținând fluxului. O reprezentare grafică a relației dintre suma tuturor fluxurilor din buget și limita și reprezentarea în procente. Informații despre buget precum limita acestuia cât și suma fluxurilor care sunt subscrise. O lista a tuturor fluxurilor aparținând bugetului cât și valoarea acestora. Este posibil să eliminăm un flux din buget prin apăsarea butonului reprezentat prin un “x” din dreapta unui flux. Aici se pot vedea și notificarea care este adaugată automat în momentul în care depășim limita setată. Acestea pot fi editate direct aici prin apăsarea butonului reprezentat de un creion din dreptul notificării sau prin a apăsa pe aceasta pentru a fi redirecționați spre ecranul notificări.

![budget-screen](https://user-images.githubusercontent.com/60604692/159226282-22f6fea6-9d6f-4d38-92ff-e5846f857f09.jpg)

## Crearea de grafice
Graficele se creează prin accesarea ecranului grafice, acesta se poate accesa prin meniul de navigare din stânga apăsând iconița cu numele “Graphs”. În acest ecran exista o lista cu graficele create. 

![graph-screen](https://user-images.githubusercontent.com/60604692/159226283-284a4ab6-59e9-4b44-904c-df8213ed79d8.jpg)

Crearea unui graf se face prin apăsarea butonului cu iconița reprezentată de un “x”. Acest buton deschide un dialog unde putem introduce numele dorit pentru graful creat.

![graph-create](https://user-images.githubusercontent.com/60604692/159226285-4bb0ce21-c24d-46b3-8a11-2b15005b0d64.jpg)

Editarea unui graf creat se face prin apăsarea butonului reprezentat de iconița creion. Dialogul deschis face posibilă editarea numelui unui graf sau ștergerea acestuia. Apăsarea pe un graf din listă, deschide ecranul cu informații despre acesta, setarile lui și graful în sine. 

![graph-edit](https://user-images.githubusercontent.com/60604692/159226288-0615ecc3-a19f-4554-ba1f-a66ba088c9d6.jpg)

## Adăugarea de flux la graf
Adăugarea unui flux la graf se face în același mod în care se face adăugarea de fluxuri la un buget. Prin meniul “Add”, apăsând butonul “Subscribe to graph”.

![subscribe-graph-button](https://user-images.githubusercontent.com/60604692/159226281-1c7bd260-cedb-44a1-a9f9-6ca3bd086cc1.jpg)

Acesta deschide un meniu unde putem vedea toate bugetele ce le putem adăuga la acest flux și graficele deja adaugate. La final când apăsăm “Submit” graficele care nu erau în coloana “Chosen” vor fi adăugate la flux iar graficele care au fost în coloana “Chosen” dar se află acum în coloana “Choices” vor fi eliminate din flux. De asemenea putem alege și dacă vrem să adăugăm numai fluxul la care suntem sau dacă dorim să adăugăm și fluxurile care se află în fluxul curent (de menționat că se adaugă toate fluxurile care pornesc din fluxul curent nu doar cele cu un nivel mai jos).

![graph-subscription](https://user-images.githubusercontent.com/60604692/159226289-cf8164d8-84ad-4f20-8248-1a411f652a97.jpg)

## Graficele și setările acestora
Pentru setarea și vizualizarea graficelor se apasă pe graful dorit din lista de grafice din ecranul grafice. Graficele pot fi setate astfel încât să preia din fluxurile selectate doar datele dintr-o anumită perioadă. Pe lângă asta se poate seta modul de calcul a datelor preluate. Pentru acest mod de calcul există 3 opțiuni: gruparea după zi, gruparea după lună și gruparea după an. Prin grupare, se înțelege faptul că pentru reprezentare se calculează suma tuturor înregistrărilor din fiecare zi, lună sau an în funcție de setarea aleasă. În grafice este reprezentată valoarea totală a fluxului într-o anumită dată și valoarea cu care a crescut sau scăzut. În această pagină există și lista fluxurilor, este posibilă eliminarea unui flux prin apăsarea butonului reprezentat de un minus într-un cerc negru din dreptul acestuia.

![graph](https://user-images.githubusercontent.com/60604692/159226291-7020555d-bda7-42b1-ae74-e99cb1bd3be0.jpg)

## Ecranul notificări
Din meniul de navigare din stânga se poate accesa ecranul de notificări.

![notifications](https://user-images.githubusercontent.com/60604692/159226292-2df03401-6d8d-4bdc-bc29-d2de6c7a428d.jpg)

Aici se pot crea notificări noi, se pot edita notificari existente, se pot pune în așteptare anumite notificări sau se pot șterge notificări. Notificările pot fi de două feluri, create de utilizator sau create automat în momentul depășiri limitei unui buget. Pentru crearea sau modificarea unei notificări trebuie selectată data primiri notificări, mesajul notificări și intervalul la care să se repete aceasta. Crearea se face prin apăsarea butonului din dreapta jos reprezentat de un clopoțel cu un plus în mijloc. 

![create-notification](https://user-images.githubusercontent.com/60604692/159226296-efbd5edb-cf10-4c06-9875-a2e1426aac4d.jpg)

Pentru editare se poate apăsa pe o notificare din listă. Punerea în așteptare se face prin comutatorul din dreapta notificării dorite. Acesta este în partea dreaptă dacă notificarea este activă și în stânga dacă este în așteptare. Comutatorul este înlocuit de un semn de exclamare într-un cerc negru în cazul unei erori, este recomandată ștergerea notificării și crearea unei notificări noi.

![edit-notification](https://user-images.githubusercontent.com/60604692/159226293-24dfdc09-a2ce-4dea-899f-84eae997abc9.jpg)

## Editarea contului de utilizator
Contul de utilizator se poate edita prin intermediul butonului “Account” din meniul de navigare din stânga. Pentru ambele tipuri de conturi se poate schimba numelui de utilizator. Pentru conturile create folosind email-ul și parola este posibilă modificarea acestora. Editarea se face prin apăsarea pe câmpul dorit, această acțiune declanșează deschiderea unui dialog în care putem introduce noile date. Pentru editarea email-ului trebuie introdusă și parola.

![email-account](https://user-images.githubusercontent.com/60604692/159226299-59820175-2819-4fb0-b357-5b76770f7337.jpg)

![gmail-account](https://user-images.githubusercontent.com/60604692/159226297-184c9375-f639-4246-b639-b23aee3c5165.jpg)

## Ieșirea din aplicație
Ieșirea din aplicație se face prin apăsarea butonului  “Logout” din meniul de navigare din stânga.

