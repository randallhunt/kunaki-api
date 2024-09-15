Kunaki API
==========

## Installation

`npm install --save kunaki-api`

## Prerequisites

...

## Usage

> [!CAUTION]
> You probably should not use this library from the browser. Calls to placing and tracking orders which require your Kunaki credentials would necessitate leaking that info.
>
> This problem does not exist in your backend/API code.


### Methods

#### `getShippingOptions()`

Usage: `getShippingOptions({ ShippingLocation: {}, Products: [] })`

#### `placeOrder()`

Usage: `placeOrder({ Recipient: {}, Products: {}, Mode: "TEST" | "LIVE" })`

#### `checkOrderStatus()`

Usage: `checkOrderStatus({ Auth: {}, OrderId: "" })`
