<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Arquitectura de la app
![image](https://github.com/thonyDeveloperSoftware77/next-word-web/assets/122832433/1a6ec43e-2ec1-4ac6-bc5a-7da659d21c0a)

## Flujo  de login y rutas protegidas
![image](https://github.com/thonyDeveloperSoftware77/next-word-web/assets/122832433/8d51e225-3625-4fa9-b194-9171a7a10cb5)

## Funcionalidades:
1. CRUD de profesores:

    Permite crear, editar y eliminar profesores.
    Las entradas de datos se validan en el backend para garantizar la integridad de la información.

2. CRUD de cursos:

    Permite crear, editar y eliminar cursos.
    Las entradas de datos se validan en el backend para garantizar la integridad de la información.
   ![image](https://github.com/thonyDeveloperSoftware77/next-word-web/assets/122832433/d84dec5c-aecc-4d24-b277-c5b45d43b3b0)


4. CRUD de cards:

    Permite crear, editar y eliminar cards.
    Las entradas de datos se validan en el backend para garantizar la integridad de la información.
    La creación de cards se puede realizar de dos maneras:
    - Objeto individual: Permite crear una card individual especificando los parámetros necesarios.
      ![image](https://github.com/thonyDeveloperSoftware77/next-word-web/assets/122832433/2058e6ca-2bac-4760-8da5-1774e5df096a)

    - JSON de cards: Permite crear varias cards de forma masiva mediante un archivo JSON. Esta funcionalidad solo está disponible para cuentas de administrador y valida la información mediante tokens y variables de entorno.
    Las cards contienen los parámetros necesarios para el aprendizaje de inglés, como vocabulario y ejemplos.
![image](https://github.com/thonyDeveloperSoftware77/next-word-web/assets/122832433/8987d45a-ac8d-4dbd-b7ad-ade08db4bf9c)


5. CRUD de similar cards:

    Permite crear, editar y eliminar similar cards.
    Las entradas de datos se validan en el backend para garantizar la integridad de la información.
   ![image](https://github.com/thonyDeveloperSoftware77/next-word-web/assets/122832433/1f5635a0-b49f-43b6-b1d6-fe35e2fe12c6)


6. CRUD de estudiantes:

    Permite crear y manejar estudiantes por curso, con estados como activo, denegado, en espera.
    Las entradas de datos se validan en el backend para garantizar la integridad de la información.
   ![image](https://github.com/thonyDeveloperSoftware77/next-word-web/assets/122832433/d04126d2-6fae-4fb6-92a1-39f2c9bd2682)




Nest is [MIT licensed](LICENSE).
