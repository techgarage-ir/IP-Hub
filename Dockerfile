FROM --platform=$BUILDPLATFORM scratch AS final

ENV TZ=Asia/Tehran
WORKDIR /app

COPY dist/ /
EXPOSE 3000
ENTRYPOINT ["/app"]