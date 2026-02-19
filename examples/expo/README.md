# Expo integration example

This folder contains a complete Expo example using:
- `react-native-pincode-2`
- `expo-local-authentication` (Face ID / Touch ID / device auth)
- `expo-secure-store` (PIN persistence)

## 1. Create an Expo app

```bash
npx create-expo-app@latest my-secure-app --template blank-typescript
cd my-secure-app
```

## 2. Install dependencies

```bash
npm install react-native-pincode-2
npx expo install expo-local-authentication expo-secure-store
```

If you are testing this library locally from source, replace the first command with:

```bash
npm install /absolute/path/to/react-native-pin-code
```

## 3. Configure iOS Face ID permission (`app.json`)

```json
{
  "expo": {
    "plugins": [
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID."
        }
      ]
    ]
  }
}
```

## 4. Copy the example app code

Replace your `App.tsx` with `examples/expo/App.tsx` from this repository.

## 5. Run

```bash
npx expo start
```

## Behavior included in this example
- Load PIN from secure storage on app start
- Force PIN setup on first launch
- Unlock with PIN or local authentication
- Auto-lock when app returns to foreground
- Reset PIN and secure storage state
