## Initial Application with Express + Jest + Lint (TypeScript)

![build-test](https://github.com/wrsouza/express-jest-typescript/actions/workflows/build-test.yml/badge.svg)
![Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/wrsouza/9b7d5aa0fe6ff3af0f45f9863f5e86a9/raw/express-jest-typescript__master.json)

---

Build Docker Container

```sh
docker build -t node-test --file .github/actions/setup/Dockerfile .
```

Run Container in Shell
```sh
docker run --rm -it -p 3000:3000 --entrypoint sh node-test
```

Install Dependencies
```sh
npm install --silent
```
Run Tests
```sh
npm run test:coverage
```

Build Application
```sh
npm run build
```

Start Application
```sh
npm start
```


