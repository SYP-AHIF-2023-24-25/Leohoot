FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
# Copy csproj and restore as distinct layers
COPY ./Api/Api.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish ./Api/Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443
ENV ASPNETCORE_ENVIRONMENT=Production
COPY ./Api/Files/quizzes.json ./Files/
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]