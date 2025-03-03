# Leohoot
## Entwicklungsumgebung
### 1) Datenbank und Nginx-Server
Um Lokal das Projekt starten zu können, muss als erstes die Datenbank und der nginx Server gestartet werden.

Sämtliche Files fürs Hosting und auch fürs lokale Starten liegen im Ordner "composes". Für das Entwickeln muss das lokale compose mit folgendem Command gestartet werden: ```docker compose -f docker-compose-local.yml``` 

Um diesen Command ausführen zu können benötigt man **docker und docker-compose**. Als Endresultat sollten nun zwei Container laufen. Mit ```docker ps``` kann das überprüft werden.

![[1740999769_grim.png]]
## 2) Backend
Das Backend ist ein ASP.net Projekt. Geöffnet kann es entweder mit **Rider, Visual Studio oder Visual Studio Code**. Um die API zu starten gibt es mehrere Möglichkeiten:

1) Navigation in den Ordner der API und ausführen von ```dotnet run``` oder ```dotnet watch``` (Watch übernimmt Echtzeit-Updates vom Code)
2) API als Start Projekt in Rider bzw. Visual Studio auswählen und auf grünen Pfeil drücken

Installiert muss dafür die **.NET SDK 8** sein.
## 3) Frontend
Das Frontend kann in **Webstorm oder in Visual Studio Code** geöffnet werden. Bevor das Projekt gestartet werden kann muss mit ```npm i``` alle Packages installiert werden. Auch hier kann in der Console oder mithilfe der IDE gestartet werden:

1) Navigation in den Root Ordner vom Angular Projekt und ```ng serve``` ausführen
2) Im Webstorm mit grünem Pfeil starten

Benötigt wird dafür **Nodejs und Angular**.
## Projektaufbau
### Frontend
### Backend
## Wichtige Teile
### Game Ablauf
### Quiz Maker
## Hosting
