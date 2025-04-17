# Inhalt
- [1 Entwicklungsumgebung](#1-entwicklungsumgebung)
    - [1.1 Datenbank und Nginx-Server](#11-datenbank-und-nginx-server)
    - [1.2 Backend](#12-backend)
    - [1.3 Frontend](#13-frontend)
- [2 Projektaufbau](#2-projektaufbau)
    - [2.1 leohoot-frontend](#21-leohoot-frontend)
        - [2.1.1 assets](#211-assets)
        - [2.1.2 components](#212-components)
        - [2.1.3 model](#213-model)
        - [2.1.4 screens](#214-screens)
        - [2.1.5 services](#215-services)
        - [2.1.6 validators](#216-validators)
    - [2.2 leohoot-backend](#22-leohoot-backend)
        - [2.2.1 Base](#221-base)
        - [2.2.2 Core](#222-core)
        - [2.2.3 Persistence](#223-persistence)
        - [2.2.4 ConsoleApp](#224-consoleapp)
        - [2.2.5 Api](#225-api)
- [3 Wichtige Teile](#3-wichtige-teile)
    - [3.1 Game Ablauf](#31-game-ablauf)
    - [3.2 Quiz Maker](#32-quiz-maker)
- [4 Hosting](#4-hosting)
    - [4.1 Github Action](#41-github-action)
    - [4.2 Mit VM verbinden](#42-mit-vm-verbinden)
    - [4.3 Docker Compose](#43-docker-compose)
        - [4.3.1 Traefik](#431-traefik)
        - [4.3.2 Frontend](#432-frontend)
        - [4.3.3 Datenbank](#433-datenbank)
        - [4.3.4 Backend](#434-backend)
        - [4.3.5 Nginx](#435-ngnix)
        - [4.3.6 Netzwerk](#436-netzwerk)
    - [4.4 Neue Version hosten](#44-neue-version-hosten)
- [5 Backup](#5-backup)

# 1 Entwicklungsumgebung
## 1.1 Datenbank und Nginx-Server
Um Lokal das Projekt starten zu können, muss als erstes die Datenbank und der nginx Server gestartet werden.

Sämtliche Files fürs Hosting und auch fürs lokale Starten liegen im Ordner "composes". Für das Entwickeln muss das lokale compose mit folgendem Command gestartet werden: ```docker compose -f docker-compose-local.yml``` 

Um diesen Command ausführen zu können benötigt man **docker und docker-compose**. Als Endresultat sollten nun zwei Container laufen. Mit ```docker ps``` kann das überprüft werden.

## 1.2 Backend
Das Backend ist ein ASP.net Projekt. Geöffnet kann es entweder mit **Rider, Visual Studio oder Visual Studio Code**. Um die API zu starten gibt es mehrere Möglichkeiten:

1) Navigation in den Ordner der API und ausführen von ```dotnet run``` oder ```dotnet watch``` (Watch übernimmt Echtzeit-Updates vom Code)
2) API als Start Projekt in Rider bzw. Visual Studio auswählen und auf grünen Pfeil drücken

Installiert muss dafür die **.NET SDK 8** sein.
## 1.3 Frontend
Das Frontend kann in **Webstorm oder in Visual Studio Code** geöffnet werden. Bevor das Projekt gestartet werden kann muss mit ```npm i``` alle Packages installiert werden. Auch hier kann in der Console oder mithilfe der IDE gestartet werden:

1) Navigation in den Root Ordner vom Angular Projekt und ```ng serve``` ausführen
2) Im Webstorm mit grünem Pfeil starten

Benötigt wird dafür **Nodejs und Angular**.

Standardmäßig können sich nur Lehrer beim Dashboard anmelden. Für das Testen und Entwickeln muss man sich jedoch auch selbst freischalten. Dafür muss im file "model/auth-guard.ts" beim return die eigene if Nummer hinzugefügt werden.

# 2 Projektaufbau
![](./images/architecture.png)
## 2.1 leohoot-frontend
Das Frontend von Leohoot basiert auf Angular. Es wird kein css verwendet sonder tailwindcss. Das heißt sämtliche Stylings erfolgen direkt im HTML-Code. [https://tailwindcss.com/](https://tailwindcss.com/)
### 2.1.1 assets
Alle Bilder etc. befinden sich in diesem Ordner.
### 2.1.2 components
In diesem Ordner befinden sich alle Einzelteile von den Screens, die entweder aufgrund von Übersichtlichkeit oder Wiederverwendbarkeit ausgelagert werden. Alle Komponenten, die auf mehreren Screens verwendet werden, wie zum Beispiel die Navigationsleiste, befinden sich im Order "general-components". Ansonsten sind die Components immer in dem Ordner mit der Bezeichnung des Screens in dem sie verwendet werden. 
### 2.1.3 model
In Model befinden sich alle Interfaces die verwendet werden.
### 2.1.4 screens
Hier befinden sich alle Screens. Dabei sind sie in student und teacher aufgeteilt:
- **Students**: alle Screens für die Spielerseite. Hier muss sich nicht mit Keycloak angemeldet werden, um darauf zu gelangen. 
- **Teacher**: alle Screens für das starten und erstellen eines Quizzes und das einsehen der Statistiken. Es können sich nur Lehrer anmelden.

**Keycloak**: System das verwendet wird, um zu ermöglichen, dass sich die Lehrer mit ihren Schulaccounts anmelden können.
### 2.1.5 services
- **auth-interceptor.service.ts**: Dieser Service sorgt dafür, dass ein vorhandener Token automatisch bei einem REST-Request angehängt wird.

- **auth.service.ts**: Einige Zeit lang war es noch nicht möglich das sich Lehrer mit Keycloak anmelden konnten. Deswegen gab es einen manuellen Login. Mittlerweile geht alles schon über Keycload, jedoch existiert der auth.service noch als Zwischenschicht zwischen Keycloakservice und den Komponenten, falls der eigene Login wieder benötigt wird.

- **rest.service.ts**: Hier befinden sich alle REST-Zugriffe die im ganzen Projekt benötigt werden. Die Url ändert sich je nachdem, ob man in Production oder im Development ist. Dafür sorgen die Files im Ordner "environment".

- **signalr.service.ts**: Bei einem Spiel erfolgt die Kommunikation zwischen dem Lehrer und den Mitspielern über Websockets. In dem Fall SignalR. Hier wird die Connection gestartet und verwaltet.
### 2.1.6 validators
Hier befindet sich der Custom Validator für das Passwort.
## 2.2 leohoot-backend
Das Backend ist ein ASP.net Projekt, dass die WebAPI für das Frontend liefert.
### 2.2.1 Base
In Base befinden sich alle Dinge, die in einem .net Projekt immer gleich sind. Also alles Allgemeine. Dieses Projekt wird **NICHT** verändert.
### 2.2.2 Core
In Core befinden sich alle Klassen und Interfaces.
- **Entities**: In diesem Ordner befindet sich das Datenmodell. Die Klassen werden in der Datenbank gespeichert.

- **Contracts**: Hier befinden sich die Interfaces für die verschiedenen Repositories. Darin werden die Methodensignaturen definiert. Für die Entities von denen man Abfragen benötigt, existiert ein Repository. Im Repository werden somit DB-Abfragen mittels LINQ (DB Abfragesprache von .net) gemacht.

- **DataTransferObjects**: Hier befinden sich alle records, die die API benötigt.

- **Game, Player**: Das sind die Klassen die fürs Spielen benötigt, aber nicht persistiert werden.
### 2.2.3 Persistence
In Perstistence wird ausimplementiert, was mit der Datenbank zu tun hat. Nach jeder Änderung bei den Entities, muss eine neue Migration erstellt werden.

Im ApplicationDbConntext muss von jedem Entity ein DbSet anglegt sein.

In Persitence werden alle Repositories ausimplementiert. Sie erben vom BaseRepository also sind Funktionalitäten, wie GetAsyc oder GetById standarmäßig vorhanden.

UnitOfWork dient als Wrapper für die ganzen Repositories. Dort werden alle einmal angelegt.
### 2.2.4 ConsoleApp
Hier wurde ein kleiner Import für Demo Daten geschrieben.
### 2.2.5 Api
Für jeden Pfad gibt es einen Controller. Dorthin werden alle dazugehörigen Endpoints geschrieben.
# 3 Wichtige Teile
## 3.1 Game Ablauf

## 3.2 Quiz Maker
# 4 Hosting
## 4.1 Github Action
Bei jedem Push auf Main wird werden automatisch mithilfe von einer Github Action die Images für Frontend und das Backend gebaut und auf Dockerhub gepusht. Das File dafür liegt in ".github/workflows".
```
on:
  push:
    branches: [ "main" ]
```
Gibt an das der Workflow bei einem Push auf main getriggert wird.
```
env:
  IMAGE_NAME_FRONTEND: ${{ secrets.DOCKERHUB_USERNAME_SOPHIE }}/leohoot
  IMAGE_NAME_BACKEND: ${{ secrets.DOCKERHUB_USERNAME_SOPHIE }}/leohoot-backend
```
Im Abschnitt env werden alle Umgebungsvariaben definiert. Der Name der Images setzt sich aus dem Dockerhub Username und dem leohoot bzw. leohoot backend zusammen. Die Secrets von einem Repository werden unter "Settings/Secrets and variables" gespeichert. Derzeit läuft alles über mein Dockerhub Konto. Das muss jedoch gehändert werden. Dafür müssen einfach neue Dockerhub Secrets eingefügt werden.

```
jobs:
    build-and-push:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
  
        - name: Set up QEMU
          uses: docker/setup-qemu-action@v2
  
        - name: Set up Docker Buildx
          uses: docker/setup-buildx-action@v2
  
        - name: Login to DockerHub
          uses: docker/login-action@v2
          with:
            username: ${{ secrets.DOCKERHUB_USERNAME_SOPHIE }}
            password: ${{ secrets.DOCKERHUB_TOKEN_SOPHIE }}
  
        - name: Docker Build frontend
          uses: docker/build-push-action@v4
          with:
            # path to Dockerfile build context
            context: ./leohoot
            push: true
            tags: ${{ env.IMAGE_NAME_FRONTEND }}

        - name: Docker Build backend
          uses: docker/build-push-action@v4
          with:
            # path to Dockerfile build context
            context: ./leohoot-backend
            push: true
            tags: ${{ env.IMAGE_NAME_BACKEND }}
```
In Jobs werden alle Schritte angegeben, die nacheinander ausgeführt werden sollen. In dem Fall wird sich mithilfe der Secrets bei Dockerhub angemeldet, die beiden Images werden gebuildet und auf Dockerhub hochgeladen. Nun können die Images jederzeit mit ```docker pull <dockerhub_username>/<image_name>``` heruntergeladen und in einem Container verwendet werden.

## 4.2 Mit VM verbinden
Mit ssh kann sich mit der Schul-VM verbunden werden:
```
ssh <user>@leohoot.htl-leonding.ac.at
```
## 4.3 Docker Compose
Am Server liegt das File "docker-compose.yaml". Hier sind alle Container definiert. Mit ```docker compose up -d``` werden alle container gestartet, die im File angegeben wurden.

### 4.3.1 Traefik
```
traefik:
    image: traefik:v2.11
    container_name: traefik
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
    ports:
      - 80:80
      - 443:443
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik.yml:/etc/traefik/traefik.yml:ro
      - ./certs:/letsencrypt
```
Traefik sorgt dafür, das ein Zertifikat für https vorhanden ist und das die einzelnen Container nicht mit Ports angesprochen werden müssen sondern mit einer bestimmten Route. z.B. alles was an /api geht wird an den port 8080 weitergeleitet.

Aufbau:
- **image**: Basisimage das verwendet wird, dieses Image wird von gepullt, falls es lokal nicht vorhanden ist, in diesem Fall ist es das Image traefik mit dem Tag v2.11.
- **container_name**: Name des Containers
- **ports**: Hier werden die Ports angegeben, die exposed werden sollen, links ist der Port von den man den Container von außen erreichen kann und rechts steht der Port der nach außen exposed wird (interner Port)
- **volumes**: Hier werden alle Speichermedien angegeben, die in den Container gemappt werden sollen.
    - traefik.yml: Hier werden noch weitere Details für Traefik angegeben
    - certs: Hier werden alle Files für das Zertifikat gespeichert
### 4.3.2 Frontend
Das Basisimage für diesen Container ist das Image, das mittels dem Githup Actions Workflow gebaut und auf Dockerhub gepusht wurde. Restart always gibt an, dass der Container automatisch wieder gestartet werden soll, wenn er abstürzt. Bei dem labels werden die Route und der Port für Traefik definiert. Alles was auf leohoot.htl-leonding.ac.at/ geht kommt auf das Frontend und diese hört intern auf Port 80.
```
leohoot-frontend:
    image: haidersophie/leohoot
    container_name: leohoot-frontend
    restart: always
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.leohoot-frontend.rule=Host(`leohoot.htl-leonding.ac.at`)&&PathPrefix(`/`)"
      - "traefik.http.services.leohoot-frontend.loadbalancer.server.port=80"
```
### 4.3.3 Datenbank
Die Datenbank ist eine MySql Datenbank. Mittels des Healthchecks wird überprüft ob die Datenbank erfolgreich gestartet wurde. Das wird dafür gemacht, dass das Backend erst startet, wenn die Datenbank erfolgreich läuft. Bei environment wird das Password und der Datenbankname angegeben. Das Passwort darf niemals auf Github eingecheckt werden. Falls es mal passiert bitte ändern. Das Volume ist leohoot-mysql-data. Wird dieses gelöscht sind alle Daten weg.
```
leohoot-db:
    image: mysql
    container_name: leohoot-db
    restart: always
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 20s
      timeout: 20s
      retries: 5
      start_period: 5s
    environment:
      MYSQL_DATABASE: <db_name>
      MYSQL_ROOT_PASSWORD: <password>
    volumes:
      - leohoot-mysql-data:/var/lib/mysql
```
### 4.3.4 Backend
Beim Backend wird die Umgebungsvariable ASPCORE_ENVIRONMENT auf Production gesetzt, damit das richtige environment File verwendet wird. Im depends_on wird angegen, dass sich der Container erst startet, wenn die DB gestartet wurder. Mithilfe dem Link kann das Backend auf die Datenbank zugreifen, ohne das diese exposes werden muss. Alle Requests die auf /api oder /hub gehen werden hierher weitergeleitet. Backend und Nginx Server werden auf den Ordner /usr/share/cdn-data gemappt. Das Backend lädt einen File in diesen Ordner und der Ngnix Server greift auf den selben Ordner zu, um Bilder auszuliefern.
```
leohoot-backend:
    image: haidersophie/leohoot-backend
    container_name: leohoot-backend
    restart: always
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    depends_on:
      leohoot-db:
        condition: service_healthy
    links:
      - leohoot-db
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.leohoot-backend.rule=Host(`leohoot.htl-leonding.ac.at`)&&(PathPrefix(`/api`) || PathPrefix(`/hub`))"
      - "traefik.http.services.leohoot-backend.loadbalancer.server.port=8080"
    volumes:
      - /usr/share/cdn-data:/usr/share/cdn-data
```
### 4.3.5 Ngnix
Das Image leohoot-nginx ist ein normaler nginx Server nur wird cdn-data gemappt. Alle Routen auf /cdn werden hierher weitergeleitet.
```
leohoot-nginx:
    image: haidersophie/leohoot-nginx
    container_name: leohoot-nginx
    restart: always
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.leohoot-nginx.rule=Host(`leohoot.htl-leonding.ac.at`)&&PathPrefix(`/cdn`)"
      - "traefik.http.services.leohoot-nginx.loadbalancer.server.port=80"
    volumes:
      - /usr/share/cdn-data:/usr/share/cdn-data
```
### 4.3.6 Netzwerk
Das Default-Netzwerk muss auf ein anderes Netz gestellt werden, damit es Schulintern zu keinen unerwarteten Konflikten kommt.
```
networks:
  default:
    driver: bridge
    ipam:
      config:
        - subnet: 192.168.100.0/24
```
## 4.4 Neue Version hosten
1) Auf Main Pushen, so wird automatisch eine neue Version gebaut
2) Mit ssh auf die VM verbinden
3) Aktuelle Version Frontend und Backend von Dockerhub herunterladen:
    ```
    docker pull haidersophie/leohoot
    docker pull haidersophie/leohoot-backend
    ```
4) Docker Compose herunterfahren und neu starten
    ```
    docker compose down
    docker compose up -d
    ```
# 5 Backup
Mithilfe von einem CRON-Task am Server, wird jeden Tag Mitternacht ein Skript ausgeführt und ein Backup erstellt, welches in einem Volume gespeichert wird.

Alle Umgebungsvariablen werden importiert:

```
source /home/lhadm/.env
```

Es wird in das Arbeitsverteichnis navigiert:
```
cd $DIRECTORY
```

Der Datenbank Dump wird erstellt und verschlüsselt:
```
docker exec -it $CONTAINERNAME mysqldump -p$DB_PASSWORD $DATABASE > $FILENAME
openssl enc -aes-256-cbc -salt -pbkdf2 -pass pass:$PASSWORD -in $FILENAME -out $FILENAME_ENC
# DECRYPT: openssl enc -aes-256-cbc -d -pbkdf2 -pass pass:"$PASSWORD" -in "$FILENAME_ENC" -out "FILENAME"
```
Es wird ein temporärer Ordner erstellt und verschlüsselt Backup wird mithilfe von einem alpine container in das Volume gespeichert:
```
mkdir backups
mv $FILENAME_ENC $DIRECTORY/backups/$FILENAME_ENC
docker run --rm \
  -v ${VOLUME_NAME}:/mnt/backup \
  -v $DIRECTORY/backups:/backup \
  alpine \
  sh -c "cp /backup/$FILENAME_ENC /mnt/backup/$FILENAME_ENC"
```
Alle temporär erstellten Files werden gelöscht:
```
rm $FILENAME
rm -r backups
```
