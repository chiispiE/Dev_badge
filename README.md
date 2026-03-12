# 🤖 Active Developer Badge Bot [Luci]

[![Node.js CI](https://github.com/cristobalvm10/Active-Developer-Badge/actions/workflows/node.js.yml/badge.svg)](https://github.com/cristobalvm10/Active-Developer-Badge/actions/workflows/node.js.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Discord.js](https://img.shields.io/badge/discord.js-v14.6.0-5865F2?logo=discord&logoColor=white)](https://discord.js.org/)

Un bot de Discord moderno, estructurado y listo para usar, diseñado para ayudarte a obtener la **Active Developer Badge** de Discord.

## 🚀 Características

- **Slash Commands:** Totalmente compatible con los comandos de barra de Discord.
- **Arquitectura Limpia:** Separación clara entre la lógica del bot y los comandos.
- **Moderación Básica:** Incluye comandos de `ban` y `kick` con validación de permisos.
- **Información Detallada:** Comandos para obtener datos del servidor y de los usuarios.

## 📂 Estructura del Proyecto

```text
Dev_badge/
├── src/
│   ├── commands/     # Carpeta de comandos (Slash Commands)
│   ├── bot.js        # Configuración y eventos del cliente
│   └── index.js      # Punto de entrada de la lógica
├── .env              # Variables de entorno (Token)
├── index.js          # Punto de entrada principal
└── package.json      # Dependencias y scripts
