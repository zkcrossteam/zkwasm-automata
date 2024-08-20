# ZKWASM application demo

## How to start the backend with nonce

### Prepare environment

For fresh environment, run `source script/environment_linux.sh` for Linux.

If you see some error messages, need manually install the error module in your OS.

### Git clone the backend repo

```
git clone https://github.com/DelphinusLab/zkwasm-mini-rollup.git
cd zkwasm-mini-rollup
git checkout akayi/addNonceCheck
```

### Start Redis

`redis-server`

### Start Mongodb

```
mkdir db
mongod --dbpath db
```

### Start dbservice

In `./dbservice`, run `bash run.sh`

### Compiling the bootstrap WASM image.

In `./host`, run `make build`

### Compiling the application WASM image.

In `./example`, run `make build`

### Start service

In `./ts`, run:
```
npm install
npx tsc
node src/service.js
```