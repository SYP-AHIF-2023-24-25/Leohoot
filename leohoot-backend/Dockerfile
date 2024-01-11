FROM mcr.microsoft.com/dotnet/sdk:7.0 AS builder
WORKDIR /app
COPY . .
RUN dotnet restore
RUN dotnet build
ENTRYPOINT [ "dotnet", "run" ]