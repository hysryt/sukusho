Sukusho
===

# インストール
```
$ npm install -g @hysryt/sukusho
```

# 使い方
`sukusho.json`を用意して`sukusho`を実行

# sukusho.json
例
```json
{
  "viewports": {
    "pc": {
      "device-width": 1280,
      "dpr": 1
    },
    "sp": {
      "device-width": 400,
      "dpr": 2,
      "save-width": 400
    }
  },
  "targets": [
    {
      "name": "menu",
      "url": "https://google.com/",
      "type": "jpeg"
    },
    {
      "name": "example",
      "url": "https://example.com/",
      "type": "jpeg"
    }
  ]
}
```
`viewports`ブロックは省略できる。