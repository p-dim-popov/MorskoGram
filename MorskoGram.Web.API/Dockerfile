#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0-buster-slim AS build

ENV NODE_VERSION=12.6.0
RUN apt update
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

WORKDIR /src
COPY ["MorskoGram.Web.API/MorskoGram.Web.API.csproj", "MorskoGram.Web.API/"]
COPY ["MorskoGram.Services.Mapping/MorskoGram.Services.Mapping.csproj", "MorskoGram.Services.Mapping/"]
COPY ["MorskoGram.Services/MorskoGram.Services.csproj", "MorskoGram.Services/"]
COPY ["MorskoGram.Data.Models/MorskoGram.Data.Models.csproj", "MorskoGram.Data.Models/"]
COPY ["MorskoGram.Data.Common/MorskoGram.Data.Common.csproj", "MorskoGram.Data.Common/"]
COPY ["MorskoGram.Web.ViewModels/MorskoGram.Web.ViewModels.csproj", "MorskoGram.Web.ViewModels/"]
COPY ["MorskoGram.Common/MorskoGram.Common.csproj", "MorskoGram.Common/"]
RUN dotnet restore "MorskoGram.Web.API/MorskoGram.Web.API.csproj"
COPY . .
WORKDIR "/src/MorskoGram.Web.API"
RUN dotnet build "MorskoGram.Web.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MorskoGram.Web.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MorskoGram.Web.API.dll"]
