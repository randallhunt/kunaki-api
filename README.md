# Kunaki API

A convenience libarary for anyone integrating the [Kunaki XML API](https://kunaki.com/XMLService.htm).

## Installation

NPM: `npm install --save kunaki-api`

Yarn: `yarn add kunaki-api`

## Prerequisites

You will need to have an account with Kunaki, and products defined with them.

## Usage

> [!CAUTION]
> You probably should not use this library from the browser. API calls for placing and tracking orders require your Kunaki credentials, which would necessitate leaking that info.
>
> This problem does not exist in backend/API code.

### Methods

#### `getShippingOptions()`

Usage: `getShippingOptions({ ShippingLocation: {}, Products: [] })`

#### `placeOrder()`

Usage: `placeOrder({ Recipient: {}, Products: {}, Mode: "TEST" | "LIVE" })`

#### `checkOrderStatus()`

Usage: `checkOrderStatus({ Auth: {}, OrderId: "" })`

### Constants

#### `countriesList`

An array of the proper country names accepted by the Kunaki API.

#### `countrySelectOptions`

An array of `{ label, value }` objects containing the values of `countriesList`, for convenience when using components (like React Select) which expect to have label/value pairs for the `options` attribute.
