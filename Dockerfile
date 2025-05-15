FROM golang:alpine AS builder

RUN apk add build-base ca-certificates

ARG Version
ARG LookupEndpoint
ENV GOCACHE=/root/.cache/go-build

WORKDIR /build

COPY go.mod .
COPY go.sum .

RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,source=go.sum,target=go.sum \
    --mount=type=bind,source=go.mod,target=go.mod \
    go mod download -x

COPY . .

RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=cache,target="/root/.cache/go-build" \
    --mount=type=bind,target=. \
    go build -ldflags="-X 'github.com/techgarage-ir/IP-Hub/config.Version=${Version}' -X 'github.com/techgarage-ir/IP-Hub/config.LookupEndpoint=${LookupEndpoint}' -s -w" -trimpath -o /dist/app

RUN for f in plugins/*/*.go; do \
        echo "Building $f"; \
        go build -buildmode=plugin -ldflags='-s -w' -trimpath -o "/dist/${f%.go}.so" "$f"; \
    done
    
RUN ldd /dist/app | tr -s [:blank:] '\n' | grep ^/ | xargs -I % install -D % /dist/%
RUN ln -s ld-musl-x86_64.so.1 /dist/lib/libc.musl-x86_64.so.1

RUN mkdir -p /dist/etc/ssl/certs
RUN mkdir -p /dist/views
RUN mkdir -p /dist/public
RUN cp /etc/ssl/certs/ca-certificates.crt /dist/etc/ssl/certs/
RUN cp -r /build/views/*  /dist/views
RUN cp -r /build/public/* /dist/public

FROM scratch AS final

COPY --from=builder /dist /
EXPOSE 3000
ENTRYPOINT ["/app"]
