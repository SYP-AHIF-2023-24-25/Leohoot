FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
# Copy csproj and restore as distinct layers
COPY ./leohoot-backend.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish ./leohoot-backend.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443
ENV ASPNETCORE_ENVIRONMENT=Production
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "leohoot-backend.dll"]