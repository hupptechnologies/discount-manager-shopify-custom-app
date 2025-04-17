# Discount Manager – A Shopify App (Remix Template)

A starter template for building a **Shopify app** using the **Remix framework**. This app is named **Discount Manager** and is designed to help merchants manage and apply custom discounts easily.

## Quick start

### Prerequisites

1. **Node.js**: [Download and install](https://nodejs.org/en/download/) it if you haven't already.
2. **Shopify Partner Account**: [Create an account](https://partners.shopify.com/signup) if you don't have one.
3. **Test Store**: Set up either a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or a [Shopify Plus sandbox store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store) for testing your app.

### Setup

Install dependencies:


```shell
yarn install
```

```shell
npm install
```

```shell
pnpm install
```

### Generate .env file

Create your .env file with default keys:

```shell
cp .env.example .env
```
```shell
echo "SHOPIFY_API_KEY=\nSHOPIFY_API_SECRET=\nSCOPES=\nSHOP_CUSTOM_DOMAIN=\nDATABASE_URL=" > .env
```

### Local Development

```shell
yarn dev
```

```shell
npm run dev
```

```shell
pnpm run dev
```

## 📽 Watch Demo Video

![Watch the demo](./public/assets/demo.gif)